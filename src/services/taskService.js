import { apiClient, IS_SUPABASE } from '../config/api'
import SAMPLE_TASKS from '../data/sampleTasks'

// ---------------------------------------------------------------------------
// taskService — CRUD tugas kuliah
//
// Strategi "local-first":
//  1. Setiap perubahan langsung disimpan ke localStorage, sehingga CRUD
//     tetap berjalan walaupun sedang offline.
//  2. Jika Supabase dikonfigurasi (.env), perubahan juga dikirim ke
//     Supabase REST API (/rest/v1/tasks) via Axios.
//  3. Jika request gagal (offline / server error), operasi dimasukkan ke
//     antrean sinkronisasi dan dikirim ulang saat koneksi kembali.
// ---------------------------------------------------------------------------

const LOCAL_KEY = 'tugasku_tasks'
const QUEUE_KEY = 'tugasku_sync_queue'
const SEEDED_KEY = 'tugasku_seeded'
const ENDPOINT = '/rest/v1/tasks'

// ---------- helpers localStorage ----------
const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn('[taskService] gagal menyimpan ke localStorage', err)
  }
}

const getLocal = () => readJSON(LOCAL_KEY, [])
const setLocal = (tasks) => writeJSON(LOCAL_KEY, tasks)
const getQueue = () => readJSON(QUEUE_KEY, [])
const setQueue = (queue) => writeJSON(QUEUE_KEY, queue)

const enqueue = (op) => setQueue([...getQueue(), { ...op, queuedAt: Date.now() }])

export const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  // Fallback UUID v4 sederhana
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

// Normalisasi supaya bentuk data selalu konsisten (dari API maupun lokal)
export const normalizeTask = (t = {}) => ({
  id: t.id,
  title: t.title ?? '',
  course: t.course ?? '',
  description: t.description ?? '',
  deadline: t.deadline ?? null,
  priority: t.priority ?? 'sedang',
  status: t.status ?? 'belum',
  created_at: t.created_at ?? new Date().toISOString(),
  updated_at: t.updated_at ?? t.created_at ?? new Date().toISOString(),
})

const sortByDeadline = (tasks) =>
  [...tasks].sort((a, b) => {
    if (!a.deadline) return 1
    if (!b.deadline) return -1
    return new Date(a.deadline) - new Date(b.deadline)
  })

const isOnline = () => typeof navigator === 'undefined' || navigator.onLine

// Data contoh hanya diisi sekali pada mode lokal agar aplikasi tidak kosong
const seedIfNeeded = () => {
  if (IS_SUPABASE) return
  if (localStorage.getItem(SEEDED_KEY)) return
  if (getLocal().length === 0) setLocal(SAMPLE_TASKS.map(normalizeTask))
  localStorage.setItem(SEEDED_KEY, '1')
}

// ---------------------------------------------------------------------------
// Sinkronisasi antrean offline -> Supabase
// ---------------------------------------------------------------------------
export async function syncPending() {
  if (!IS_SUPABASE || !isOnline()) return { synced: 0, pending: getQueue().length }

  const queue = getQueue()
  let synced = 0

  for (const op of queue) {
    try {
      if (op.type === 'create' || op.type === 'update') {
        // upsert agar aman dijalankan berulang (idempotent)
        await apiClient.post(ENDPOINT, op.task, {
          headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        })
      } else if (op.type === 'delete') {
        await apiClient.delete(`${ENDPOINT}?id=eq.${op.id}`)
      }
      synced += 1
    } catch (err) {
      // Berhenti di operasi pertama yang gagal; sisanya dicoba lagi nanti
      if (err?.status && err.status >= 400 && err.status < 500) {
        // Error dari sisi data (bukan jaringan) — buang agar antrean tidak macet
        console.warn('[taskService] operasi dibuang:', op, err.message)
        synced += 1
        continue
      }
      break
    }
  }

  const remaining = queue.slice(synced)
  setQueue(remaining)
  return { synced, pending: remaining.length }
}

export const getPendingCount = () => getQueue().length

// ---------------------------------------------------------------------------
// READ
// ---------------------------------------------------------------------------
export async function getAllTasks() {
  seedIfNeeded()

  if (IS_SUPABASE && isOnline()) {
    try {
      await syncPending()
      const data = await apiClient.get(`${ENDPOINT}?select=*&order=deadline.asc`)
      const tasks = sortByDeadline((data || []).map(normalizeTask))
      // Gabungkan dengan operasi yang masih tertunda agar tidak "hilang" di UI
      setLocal(applyPendingOps(tasks))
      return { data: getLocal(), source: 'server' }
    } catch (err) {
      console.warn('[taskService] memakai data lokal:', err.message)
      return { data: sortByDeadline(getLocal()), source: 'local', error: err.message }
    }
  }

  return { data: sortByDeadline(getLocal()), source: 'local' }
}

const applyPendingOps = (serverTasks) => {
  let tasks = [...serverTasks]
  for (const op of getQueue()) {
    if (op.type === 'create' || op.type === 'update') {
      const exists = tasks.some((t) => t.id === op.task.id)
      tasks = exists
        ? tasks.map((t) => (t.id === op.task.id ? normalizeTask(op.task) : t))
        : [...tasks, normalizeTask(op.task)]
    } else if (op.type === 'delete') {
      tasks = tasks.filter((t) => t.id !== op.id)
    }
  }
  return sortByDeadline(tasks)
}

export async function getTaskById(id) {
  return getLocal().find((t) => t.id === id) || null
}

// ---------------------------------------------------------------------------
// CREATE
// ---------------------------------------------------------------------------
export async function createTask(payload) {
  const now = new Date().toISOString()
  const task = normalizeTask({ ...payload, id: generateId(), created_at: now, updated_at: now })

  setLocal(sortByDeadline([...getLocal(), task]))

  if (IS_SUPABASE) {
    try {
      if (!isOnline()) throw new Error('offline')
      await apiClient.post(ENDPOINT, task, { headers: { Prefer: 'return=minimal' } })
    } catch {
      enqueue({ type: 'create', task })
    }
  }
  return task
}

// ---------------------------------------------------------------------------
// UPDATE
// ---------------------------------------------------------------------------
export async function updateTask(id, changes) {
  const current = getLocal().find((t) => t.id === id)
  if (!current) throw { message: 'Tugas tidak ditemukan' }

  const task = normalizeTask({ ...current, ...changes, id, updated_at: new Date().toISOString() })
  setLocal(sortByDeadline(getLocal().map((t) => (t.id === id ? task : t))))

  if (IS_SUPABASE) {
    try {
      if (!isOnline()) throw new Error('offline')
      // eslint-disable-next-line no-unused-vars
      const { id: _omit, ...body } = task
      await apiClient.patch(`${ENDPOINT}?id=eq.${id}`, body, {
        headers: { Prefer: 'return=minimal' },
      })
    } catch {
      enqueue({ type: 'update', task })
    }
  }
  return task
}

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------
export async function deleteTask(id) {
  setLocal(getLocal().filter((t) => t.id !== id))
  // Hapus juga operasi create/update yang belum terkirim untuk id ini
  const queue = getQueue()
  const hadPendingCreate = queue.some((op) => op.type === 'create' && op.task.id === id)
  setQueue(queue.filter((op) => !(op.task && op.task.id === id)))

  if (IS_SUPABASE && !hadPendingCreate) {
    try {
      if (!isOnline()) throw new Error('offline')
      await apiClient.delete(`${ENDPOINT}?id=eq.${id}`)
    } catch {
      enqueue({ type: 'delete', id })
    }
  }
  return true
}

const taskService = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  syncPending,
  getPendingCount,
}

export default taskService
