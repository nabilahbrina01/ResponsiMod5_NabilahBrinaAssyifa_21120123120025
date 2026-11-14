import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import TaskCard from '../components/task/TaskCard'
import { dateKey, formatDate } from '../utils/helpers'

const DAY_NAMES = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

export default function SchedulePage({ onNavigate }) {
  const { tasks, toggleDone } = useTasks()
  const today = new Date()
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState(dateKey(today))

  // Kelompokkan tugas berdasarkan tanggal deadline
  const byDate = useMemo(() => {
    const map = {}
    for (const t of tasks) {
      if (!t.deadline) continue
      const k = dateKey(t.deadline)
      ;(map[k] ||= []).push(t)
    }
    return map
  }, [tasks])

  // Bangun grid kalender (minggu dimulai Senin)
  const cells = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const first = new Date(year, month, 1)
    const offset = (first.getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const out = []
    for (let i = 0; i < offset; i++) out.push(null)
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(year, month, d))
    while (out.length % 7) out.push(null)
    return out
  }, [cursor])

  const shiftMonth = (n) => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + n, 1))
  const todayKey = dateKey(today)
  const selectedTasks = byDate[selected] || []

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Jadwal Deadline</h1>
        <p className="text-sm text-slate-500">Ketuk tanggal untuk melihat tugas yang jatuh tempo.</p>
      </div>

      <section className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => shiftMonth(-1)} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Bulan sebelumnya">
            <ChevronLeft size={18} />
          </button>
          <h2 className="font-semibold text-slate-900">
            {cursor.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => shiftMonth(1)} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Bulan berikutnya">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400">
          {DAY_NAMES.map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, i) => {
            if (!date) return <div key={i} />
            const k = dateKey(date)
            const items = byDate[k] || []
            const active = items.filter((t) => t.status !== 'selesai').length
            const isSel = k === selected
            const isToday = k === todayKey
            return (
              <button
                key={k}
                onClick={() => setSelected(k)}
                className={`flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition ${
                  isSel
                    ? 'bg-indigo-600 font-semibold text-white'
                    : isToday
                      ? 'bg-indigo-50 font-semibold text-indigo-700'
                      : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {date.getDate()}
                <span className="mt-0.5 flex h-1.5 gap-0.5">
                  {items.slice(0, 3).map((t) => (
                    <span
                      key={t.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSel ? 'bg-white' : t.status === 'selesai' ? 'bg-emerald-400' : active && t.priority === 'tinggi' ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                    />
                  ))}
                </span>
              </button>
            )
          })}
        </div>
        <button
          onClick={() => {
            setCursor(new Date(today.getFullYear(), today.getMonth(), 1))
            setSelected(todayKey)
          }}
          className="mt-3 w-full text-center text-xs font-medium text-indigo-600"
        >
          Kembali ke hari ini
        </button>
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-slate-900">{formatDate(selected + 'T00:00:00')}</h2>
        {selectedTasks.length === 0 ? (
          <div className="card p-6 text-center text-sm text-slate-500">Tidak ada deadline di tanggal ini.</div>
        ) : (
          <div className="space-y-3">
            {selectedTasks.map((t) => (
              <TaskCard key={t.id} task={t} compact onToggle={toggleDone} onOpen={(task) => onNavigate('Detail', task)} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
