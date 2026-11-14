import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import taskService from '../services/taskService'

/**
 * TasksContext — state management global untuk daftar tugas.
 * Semua halaman (Beranda, Tugas, Jadwal) membaca data dari sini sehingga
 * perubahan CRUD langsung terlihat di seluruh aplikasi.
 */
const TasksContext = createContext(null)

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('local')
  const [pending, setPending] = useState(taskService.getPendingCount())

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await taskService.getAllTasks()
      setTasks(res.data)
      setSource(res.source)
      if (res.error) setError(res.error)
    } catch (err) {
      setError(err?.message || 'Gagal memuat tugas')
    } finally {
      setPending(taskService.getPendingCount())
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    // Saat koneksi kembali, kirim antrean offline lalu muat ulang data
    const handleOnline = async () => {
      await taskService.syncPending()
      refresh()
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [refresh])

  const afterMutation = async () => {
    const res = await taskService.getAllTasks()
    setTasks(res.data)
    setSource(res.source)
    setPending(taskService.getPendingCount())
  }

  const createTask = async (payload) => {
    const task = await taskService.createTask(payload)
    await afterMutation()
    return task
  }

  const updateTask = async (id, changes) => {
    const task = await taskService.updateTask(id, changes)
    await afterMutation()
    return task
  }

  const deleteTask = async (id) => {
    await taskService.deleteTask(id)
    await afterMutation()
  }

  const toggleDone = (task) =>
    updateTask(task.id, { status: task.status === 'selesai' ? 'belum' : 'selesai' })

  const value = {
    tasks,
    loading,
    error,
    source,
    pending,
    refresh,
    createTask,
    updateTask,
    deleteTask,
    toggleDone,
  }

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error('useTasks harus dipakai di dalam <TasksProvider>')
  return ctx
}
