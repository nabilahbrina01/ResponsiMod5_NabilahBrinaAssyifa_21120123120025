import { CheckCircle2, Circle, Clock, Pencil, Trash2 } from 'lucide-react'
import { deadlineLabel, deadlineTone, formatDate, formatTime, getPriority, getStatus } from '../../utils/helpers'

export default function TaskCard({ task, onOpen, onToggle, onEdit, onDelete, compact = false }) {
  const priority = getPriority(task.priority)
  const status = getStatus(task.status)
  const done = task.status === 'selesai'

  return (
    <article className="card flex items-start gap-3 p-4 transition hover:border-indigo-200 hover:shadow-md">
      <button
        onClick={() => onToggle?.(task)}
        className={`mt-0.5 shrink-0 ${done ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
        aria-label={done ? 'Tandai belum selesai' : 'Tandai selesai'}
      >
        {done ? <CheckCircle2 size={22} /> : <Circle size={22} />}
      </button>

      <button onClick={() => onOpen?.(task)} className="min-w-0 flex-1 text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{task.course || 'Umum'}</p>
        <h3 className={`mt-0.5 font-semibold text-slate-900 ${done ? 'line-through opacity-60' : ''}`}>
          {task.title}
        </h3>
        {!compact && task.description && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{task.description}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className={`flex items-center gap-1 font-medium ${deadlineTone(task)}`}>
            <Clock size={13} />
            {deadlineLabel(task)}
            {task.deadline && (
              <span className="font-normal text-slate-400">
                · {formatDate(task.deadline, { weekday: 'short', year: undefined, month: 'short' })}{' '}
                {formatTime(task.deadline)}
              </span>
            )}
          </span>
          <span className={`rounded-full px-2 py-0.5 font-medium ${priority.className}`}>{priority.label}</span>
          {!compact && (
            <span className={`rounded-full px-2 py-0.5 font-medium ${status.className}`}>{status.short}</span>
          )}
        </div>
      </button>

      {!compact && (
        <div className="flex shrink-0 flex-col gap-1">
          <button
            onClick={() => onEdit?.(task)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
            aria-label="Edit tugas"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete?.(task)}
            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            aria-label="Hapus tugas"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </article>
  )
}
