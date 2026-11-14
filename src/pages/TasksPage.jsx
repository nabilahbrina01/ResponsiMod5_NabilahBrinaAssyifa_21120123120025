import { useMemo, useState } from 'react'
import { AlertCircle, ClipboardList, Loader, Plus, RefreshCw, Search } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import TaskCard from '../components/task/TaskCard'
import { isOverdue } from '../utils/helpers'

const FILTERS = [
  { key: 'aktif', label: 'Aktif' },
  { key: 'semua', label: 'Semua' },
  { key: 'terlambat', label: 'Terlambat' },
  { key: 'selesai', label: 'Selesai' },
]

const PRIORITY_RANK = { tinggi: 0, sedang: 1, rendah: 2 }

export default function TasksPage({ onNavigate, onDelete }) {
  const { tasks, loading, error, source, pending, refresh, toggleDone } = useTasks()
  const [filter, setFilter] = useState('aktif')
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState('')
  const [sort, setSort] = useState('deadline')

  const courses = useMemo(
    () => [...new Set(tasks.map((t) => t.course).filter(Boolean))].sort(),
    [tasks],
  )

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = tasks.filter((t) => {
      if (filter === 'aktif' && t.status === 'selesai') return false
      if (filter === 'selesai' && t.status !== 'selesai') return false
      if (filter === 'terlambat' && !isOverdue(t)) return false
      if (course && t.course !== course) return false
      if (q && !`${t.title} ${t.course} ${t.description}`.toLowerCase().includes(q)) return false
      return true
    })
    if (sort === 'prioritas') {
      list = [...list].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
    } else if (sort === 'terbaru') {
      list = [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
    return list
  }, [tasks, filter, query, course, sort])

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daftar Tugas</h1>
          <p className="text-sm text-slate-500">
            {tasks.length} tugas · sumber data: {source === 'server' ? 'Supabase' : 'perangkat'}
            {pending > 0 && <span className="text-amber-600"> · {pending} menunggu sinkron</span>}
          </p>
        </div>
        <button onClick={refresh} className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100" aria-label="Muat ulang">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input pl-9"
          placeholder="Cari judul, mata kuliah, atau catatan…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === f.key ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select className="input" value={course} onChange={(e) => setCourse(e.target.value)} aria-label="Filter mata kuliah">
          <option value="">Semua mata kuliah</option>
          {courses.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Urutkan">
          <option value="deadline">Urut: deadline</option>
          <option value="prioritas">Urut: prioritas</option>
          <option value="terbaru">Urut: terbaru dibuat</option>
        </select>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>Server tidak dapat dihubungi, menampilkan data yang tersimpan di perangkat. ({error})</span>
        </div>
      )}

      {loading && tasks.length === 0 ? (
        <div className="flex justify-center py-16 text-slate-400">
          <Loader className="animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="card flex flex-col items-center p-10 text-center">
          <ClipboardList size={40} className="text-slate-300" />
          <p className="mt-3 font-medium text-slate-700">Belum ada tugas di sini</p>
          <p className="text-sm text-slate-500">Coba ubah filter atau tambahkan tugas baru.</p>
          <button onClick={() => onNavigate('Create')} className="btn btn-primary mt-4">
            <Plus size={16} /> Tambah tugas
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onToggle={toggleDone}
              onOpen={(task) => onNavigate('Detail', task)}
              onEdit={(task) => onNavigate('Edit', task)}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
