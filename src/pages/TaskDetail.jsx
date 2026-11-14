import { ArrowLeft, BookOpen, CalendarClock, CheckCircle2, Flag, Pencil, RotateCcw, Trash2 } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { deadlineLabel, deadlineTone, formatDateTime, getPriority, getStatus } from '../utils/helpers'

export default function TaskDetail({ taskId, onBack, onEdit, onDelete }) {
  const { tasks, toggleDone } = useTasks()
  const task = tasks.find((t) => t.id === taskId)

  if (!task) {
    return (
      <div className="card p-8 text-center animate-fade-in">
        <p className="text-slate-600">Tugas tidak ditemukan atau sudah dihapus.</p>
        <button onClick={onBack} className="btn btn-ghost mt-4">
          <ArrowLeft size={16} /> Kembali
        </button>
      </div>
    )
  }

  const priority = getPriority(task.priority)
  const status = getStatus(task.status)
  const done = task.status === 'selesai'

  return (
    <div className="space-y-4 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800">
        <ArrowLeft size={16} /> Kembali
      </button>

      <article className="card overflow-hidden">
        <div className="border-b border-slate-100 bg-indigo-50/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{task.course}</p>
          <h1 className={`mt-1 text-2xl font-bold text-slate-900 ${done ? 'line-through opacity-60' : ''}`}>{task.title}</h1>
          <p className={`mt-2 text-sm font-semibold ${deadlineTone(task)}`}>{deadlineLabel(task)}</p>
        </div>

        <dl className="divide-y divide-slate-100">
          <Row icon={CalendarClock} label="Deadline" value={formatDateTime(task.deadline)} />
          <Row icon={BookOpen} label="Mata kuliah" value={task.course} />
          <Row
            icon={Flag}
            label="Prioritas"
            value={<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priority.className}`}>{priority.label}</span>}
          />
          <Row
            icon={CheckCircle2}
            label="Status"
            value={<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>{status.label}</span>}
          />
        </dl>

        <div className="border-t border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700">Catatan</h2>
          <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{task.description || '—'}</p>
          <p className="mt-4 text-xs text-slate-400">
            Dibuat {formatDateTime(task.created_at)} · Diperbarui {formatDateTime(task.updated_at)}
          </p>
        </div>
      </article>

      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => toggleDone(task)} className={`btn ${done ? 'btn-ghost' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
          {done ? <RotateCcw size={16} /> : <CheckCircle2 size={16} />}
          {done ? 'Buka lagi' : 'Selesai'}
        </button>
        <button onClick={() => onEdit(task)} className="btn btn-ghost">
          <Pencil size={16} /> Edit
        </button>
        <button onClick={() => onDelete(task)} className="btn bg-rose-50 text-rose-600 hover:bg-rose-100">
          <Trash2 size={16} /> Hapus
        </button>
      </div>
    </div>
  )
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 text-sm">
      <Icon size={16} className="text-slate-400" />
      <dt className="w-28 text-slate-500">{label}</dt>
      <dd className="flex-1 font-medium text-slate-800">{value}</dd>
    </div>
  )
}
