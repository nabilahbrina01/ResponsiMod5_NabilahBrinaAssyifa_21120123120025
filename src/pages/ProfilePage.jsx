import { useEffect, useState } from 'react'
import { BadgeCheck, Cloud, HardDrive, Hash, Smartphone, User, Users, Wifi, WifiOff } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { IS_SUPABASE } from '../config/api'

const PROFILE = {
  nama: 'Nabilah Brina Assyifa',
  nim: '21120123120025',
  kelompok: '33',
}

const initials = (name) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')

export default function ProfilePage() {
  const { tasks, pending } = useTasks()
  const [online, setOnline] = useState(navigator.onLine)
  const [standalone, setStandalone] = useState(false)

  useEffect(() => {
    setStandalone(
      window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true,
    )
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  const done = tasks.filter((t) => t.status === 'selesai').length

  return (
    <div className="space-y-4 animate-fade-in">
      <section className="card overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-indigo-600 to-violet-600" />
        <div className="-mt-12 flex flex-col items-center px-5 pb-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-indigo-100 text-3xl font-bold text-indigo-700 shadow">
            {initials(PROFILE.nama)}
          </div>
          <h1 className="mt-3 flex items-center gap-1.5 text-xl font-bold text-slate-900">
            {PROFILE.nama}
            <BadgeCheck size={18} className="text-indigo-600" />
          </h1>
          <p className="text-sm text-slate-500">Mahasiswa · Praktikum Pemrograman Perangkat Bergerak</p>
        </div>
      </section>

      <section className="card divide-y divide-slate-100">
        <InfoRow icon={User} label="Nama" value={PROFILE.nama} />
        <InfoRow icon={Hash} label="NIM" value={PROFILE.nim} />
        <InfoRow icon={Users} label="Kelompok" value={PROFILE.kelompok} />
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{tasks.length}</p>
          <p className="text-xs text-slate-500">Tugas tercatat</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{done}</p>
          <p className="text-xs text-slate-500">Tugas selesai</p>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="mb-3 font-semibold text-slate-900">Status aplikasi</h2>
        <ul className="space-y-2.5 text-sm">
          <StatusItem
            icon={online ? Wifi : WifiOff}
            ok={online}
            label={online ? 'Online' : 'Offline — data dari cache perangkat'}
          />
          <StatusItem
            icon={Smartphone}
            ok={standalone}
            label={standalone ? 'Berjalan sebagai aplikasi terpasang' : 'Berjalan di browser (bisa di-install)'}
          />
          <StatusItem
            icon={IS_SUPABASE ? Cloud : HardDrive}
            ok
            label={IS_SUPABASE ? 'Penyimpanan: Supabase + cache lokal' : 'Penyimpanan: localStorage perangkat'}
          />
          {IS_SUPABASE && (
            <StatusItem icon={Cloud} ok={pending === 0} label={pending === 0 ? 'Semua data tersinkron' : `${pending} perubahan menunggu sinkron`} />
          )}
        </ul>
      </section>

      <p className="pb-2 text-center text-xs text-slate-400">TugasKu v1.0 · React + Vite PWA</p>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  )
}

function StatusItem({ icon: Icon, ok, label }) {
  return (
    <li className="flex items-center gap-2.5">
      <Icon size={16} className={ok ? 'text-emerald-600' : 'text-amber-600'} />
      <span className="text-slate-700">{label}</span>
    </li>
  )
}
