export const PRIORITIES = [
  { value: 'rendah', label: 'Rendah', className: 'bg-emerald-100 text-emerald-700' },
  { value: 'sedang', label: 'Sedang', className: 'bg-amber-100 text-amber-700' },
  { value: 'tinggi', label: 'Tinggi', className: 'bg-rose-100 text-rose-700' },
]

export const STATUSES = [
  { value: 'belum', label: 'Belum dikerjakan', short: 'Belum', className: 'bg-slate-100 text-slate-600' },
  { value: 'proses', label: 'Sedang dikerjakan', short: 'Proses', className: 'bg-sky-100 text-sky-700' },
  { value: 'selesai', label: 'Selesai', short: 'Selesai', className: 'bg-emerald-100 text-emerald-700' },
]

export const getPriority = (v) => PRIORITIES.find((p) => p.value === v) || PRIORITIES[1]
export const getStatus = (v) => STATUSES.find((s) => s.value === v) || STATUSES[0]

const startOfDay = (d) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

/** Selisih hari kalender antara hari ini dan deadline (negatif = lewat). */
export const daysLeft = (deadline) => {
  if (!deadline) return null
  const ms = startOfDay(deadline) - startOfDay(new Date())
  return Math.round(ms / 86400000)
}

export const isOverdue = (task) =>
  task.status !== 'selesai' && task.deadline && new Date(task.deadline) < new Date()

export const deadlineLabel = (task) => {
  if (!task.deadline) return 'Tanpa deadline'
  if (task.status === 'selesai') return 'Selesai'
  if (isOverdue(task)) return 'Terlambat'
  const d = daysLeft(task.deadline)
  if (d === 0) return 'Hari ini'
  if (d === 1) return 'Besok'
  return `${d} hari lagi`
}

export const deadlineTone = (task) => {
  if (task.status === 'selesai') return 'text-emerald-600'
  if (isOverdue(task)) return 'text-rose-600'
  const d = daysLeft(task.deadline)
  if (d !== null && d <= 1) return 'text-amber-600'
  return 'text-slate-500'
}

export const formatDate = (iso, opts = {}) => {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...opts,
  })
}

export const formatTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'

export const formatDateTime = (iso) => (iso ? `${formatDate(iso)}, ${formatTime(iso)}` : '-')

/** ISO -> nilai untuk <input type="datetime-local"> (waktu lokal). */
export const toInputValue = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Nilai <input type="datetime-local"> -> ISO string. */
export const fromInputValue = (value) => (value ? new Date(value).toISOString() : null)

export const dateKey = (iso) => {
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
