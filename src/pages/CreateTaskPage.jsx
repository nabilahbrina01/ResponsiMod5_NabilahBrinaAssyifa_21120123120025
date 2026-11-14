import { ArrowLeft } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import TaskForm from '../components/task/TaskForm'

export default function CreateTaskPage({ onBack, onSuccess }) {
  const { tasks, createTask } = useTasks()
  const courses = [...new Set(tasks.map((t) => t.course).filter(Boolean))]

  const handleSubmit = async (data) => {
    const task = await createTask(data)
    onSuccess?.(task)
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800">
        <ArrowLeft size={16} /> Kembali
      </button>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tambah Tugas</h1>
        <p className="text-sm text-slate-500">Catat tugas baru beserta deadline-nya.</p>
      </div>
      <TaskForm submitLabel="Simpan tugas" courses={courses} onSubmit={handleSubmit} onCancel={onBack} />
    </div>
  )
}
