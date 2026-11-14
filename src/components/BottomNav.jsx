import { TABS } from './Header'

export default function BottomNav({ tab, onTab }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] sm:hidden"
      aria-label="Navigasi bawah"
    >
      <div className="mx-auto grid max-w-md grid-cols-4">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = tab === key
          return (
            <button
              key={key}
              onClick={() => onTab(key)}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition ${
                active ? 'text-indigo-600' : 'text-slate-500'
              }`}
            >
              <span className={`rounded-full px-4 py-1 ${active ? 'bg-indigo-50' : ''}`}>
                <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              </span>
              {label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
