import { CalendarDays, Home, ListTodo, Plus, User } from 'lucide-react'

export const TABS = [
  { key: 'Beranda', label: 'Beranda', icon: Home },
  { key: 'Tugas', label: 'Tugas', icon: ListTodo },
  { key: 'Jadwal', label: 'Jadwal', icon: CalendarDays },
  { key: 'Profil', label: 'Profil', icon: User },
]

export default function Header({ tab, onTab, onNavigateCreate }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <button onClick={() => onTab('Beranda')} className="flex items-center gap-2">
          <img src="/favicon.svg" alt="" className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Tugas<span className="text-indigo-600">Ku</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Navigasi utama">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onTab(key)}
              aria-current={tab === key ? 'page' : undefined}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                tab === key ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <button onClick={onNavigateCreate} className="btn btn-primary px-3! py-2!" aria-label="Tambah tugas">
          <Plus size={18} />
          <span className="hidden sm:inline">Tambah</span>
        </button>
      </div>
    </header>
  )
}
