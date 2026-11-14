import { useMemo } from 'react'
import { AlertCircle, ArrowRight, CheckCircle2, Clock, ListTodo, Loader, Plus } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import TaskCard from '../components/task/TaskCard'
import { daysLeft, isOverdue } from '../utils/helpers'

const greeting = () => {
  const h = new Date().getHours()
  if (h < 11) return 'Selamat pagi'
  if (h < 15) return 'Selamat siang'
  if (h < 18) return 'Selamat sore'
  return 'Selamat malam'
}

export default function HomePage({ onNavigate }) {
  const { tasks, loading, toggleDone } = useTasks()

  const stats = useMemo(() => {
    const done = tasks.filter((t) => t.status === 'selesai').length
    const overdue = tasks.filter(isOverdue).length
    const thisWeek = tasks.filter((t) => {
      if (t.status === 'selesai' || !t.deadline) return false
      const d = daysLeft(t.deadline)
      return d >= 0 && d <= 7
    }).length
    const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0
    return { total: tasks.length, done, overdue, thisWeek, progress }
  }, [tasks])

  const upcoming = useMemo(
    () => tasks.filter((t) => t.status !== 'selesai').slice(0, 4),
    [tasks],
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-lg">
        <p className="text-sm text-indigo-100">{greeting()}, Nabilah 👋</p>
        <h1 className="mt-1 text-2xl font-bold">
          {stats.total - stats.done > 0
            ? `${stats.total - stats.done} tugas menunggu dikerjakan`
            : 'Semua tugas beres!'}
        </h1>
        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-xs text-indigo-100">
            <span>Progres keseluruhan</span>
            <span>{stats.progress}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white transition-all" style={{ width: `${stats.progress}%` }} />
          </div>
        </div>
        <button onClick={() => onNavigate('Create')} className="btn mt-5 bg-white text-indigo-700 hover:bg-indigo-50">
          <Plus size={16} /> Tambah tugas
        </button>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={ListTodo} label="Total tugas" value={stats.total} tone="text-indigo-600 bg-indigo-50" />
        <Stat icon={Clock} label="Deadline 7 hari" value={stats.thisWeek} tone="text-amber-600 bg-amber-50" />
        <Stat icon={AlertCircle} label="Terlambat" value={stats.overdue} tone="text-rose-600 bg-rose-50" />
        <Stat icon={CheckCircle2} label="Selesai" value={stats.done} tone="text-emerald-600 bg-emerald-50" />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Deadline terdekat</h2>
          <button onClick={() => onNavigate('Tugas')} className="flex items-center gap-1 text-sm font-medium text-indigo-600">
            Lihat semua <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10 text-slate-400">
            <Loader className="animate-spin" />
          </div>
        ) : upcoming.length === 0 ? (
          <div className="card p-8 text-center text-sm text-slate-500">
            Tidak ada tugas aktif. Waktunya istirahat ☕
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                compact
                onToggle={toggleDone}
                onOpen={(task) => onNavigate('Detail', task)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function Stat({ icon: Icon, label, value, tone }) {
  return (
    <div className="card p-4">
      <div className={`inline-flex rounded-xl p-2 ${tone}`}>
        <Icon size={18} />
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  )
}
