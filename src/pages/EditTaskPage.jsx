import { ArrowLeft } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import TaskForm from '../components/task/TaskForm'

export default function EditTaskPage({ task, onBack, onSuccess }) {
  const { tasks, updateTask } = useTasks()
  const courses = [...new Set(tasks.map((t) => t.course).filter(Boolean))]

  const handleSubmit = async (data) => {
    const updated = await updateTask(task.id, data)
    onSuccess?.(updated)
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800">
        <ArrowLeft size={16} /> Kembali
      </button>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Tugas</h1>
        <p className="text-sm text-slate-500">Perbarui detail, deadline, atau status tugas.</p>
      </div>
      <TaskForm initial={task} submitLabel="Simpan perubahan" courses={courses} onSubmit={handleSubmit} onCancel={onBack} />
    </div>
  )
}
