import { useEffect, useState } from 'react'
import { Download, WifiOff, X, Wifi } from 'lucide-react'

export default function PWABadge() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [backOnline, setBackOnline] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    const handleAppInstalled = () => setInstallPrompt(null)
    const handleOnline = () => {
      setIsOffline(false)
      setBackOnline(true)
      setTimeout(() => setBackOnline(false), 2500)
    }
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  const wrapper =
    'fixed inset-x-3 bottom-20 z-40 mx-auto flex max-w-md items-center gap-3 rounded-2xl px-4 py-3 text-sm shadow-lg sm:bottom-6 animate-fade-in'

  if (isOffline) {
    return (
      <aside className={`${wrapper} bg-slate-900 text-white`} role="status" aria-live="polite">
        <WifiOff size={18} className="shrink-0 text-amber-300" />
        <span>Kamu sedang offline. Perubahan tetap disimpan di perangkat ini.</span>
      </aside>
    )
  }

  if (backOnline) {
    return (
      <aside className={`${wrapper} bg-emerald-600 text-white`} role="status" aria-live="polite">
        <Wifi size={18} className="shrink-0" />
        <span>Kembali online — data disinkronkan.</span>
      </aside>
    )
  }

  if (installPrompt && !dismissed) {
    return (
      <aside className={`${wrapper} border border-indigo-100 bg-white text-slate-700`}>
        <Download size={18} className="shrink-0 text-indigo-600" />
        <span className="flex-1">Pasang TugasKu di perangkatmu agar bisa dibuka seperti aplikasi.</span>
        <button onClick={handleInstallClick} className="btn btn-primary px-3! py-1.5!">
          Install
        </button>
        <button onClick={() => setDismissed(true)} aria-label="Tutup" className="text-slate-400">
          <X size={18} />
        </button>
      </aside>
    )
  }

  return null
}
