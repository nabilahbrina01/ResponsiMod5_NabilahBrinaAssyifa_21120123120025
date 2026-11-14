import { useEffect, useState } from 'react'

export default function SplashScreen({ onFinish, duration = 1400 }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), duration)
    const t2 = setTimeout(() => onFinish?.(), duration + 350)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [duration, onFinish])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-indigo-600 text-white transition-opacity duration-300 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img src="/icons/pwa-192x192.png" alt="" className="h-24 w-24 rounded-3xl shadow-xl" />
      <h1 className="mt-5 text-3xl font-bold tracking-tight">TugasKu</h1>
      <p className="mt-1 text-sm text-indigo-100">Kelola tugas kuliah, jangan lewat deadline</p>
      <div className="mt-8 h-1 w-32 overflow-hidden rounded-full bg-indigo-400/50">
        <div className="h-full w-1/2 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-white" />
      </div>
    </div>
  )
}
