import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import PWABadge from './components/PWABadge.jsx'
import SplashScreen from './components/common/SplashScreen.jsx'
import ConfirmModal from './components/modals/ConfirmModal.jsx'
import HomePage from './pages/HomePage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import SchedulePage from './pages/SchedulePage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import CreateTaskPage from './pages/CreateTaskPage.jsx'
import EditTaskPage from './pages/EditTaskPage.jsx'
import TaskDetail from './pages/TaskDetail.jsx'
import { TasksProvider, useTasks } from './hooks/useTasks.jsx'

const VALID_TABS = ['Beranda', 'Tugas', 'Jadwal', 'Profil']
const tabFromHash = () => {
  const h = decodeURIComponent(window.location.hash.replace('#', ''))
  return VALID_TABS.includes(h) ? h : 'Beranda'
}

function AppShell() {
  const { deleteTask } = useTasks()
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('tugasku_splash'))
  const [tab, setTab] = useState(tabFromHash)
  const [mode, setMode] = useState('list') // 'list' | 'create' | 'edit' | 'detail'
  const [selectedId, setSelectedId] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }, [])

  // Sinkronkan tab dengan URL hash (#Tugas, #Jadwal, ...) agar tombol back browser bekerja
  useEffect(() => {
    const onHash = () => {
      setTab(tabFromHash())
      setMode('list')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const finishSplash = useCallback(() => {
    sessionStorage.setItem('tugasku_splash', '1')
    setShowSplash(false)
  }, [])

  // Unified navigation handler
  const handleNavigate = (target, payload) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (target === 'Create') {
      setMode('create')
    } else if (target === 'Edit') {
      setEditingTask(payload)
      setMode('edit')
    } else if (target === 'Detail') {
      setSelectedId(payload.id)
      setMode('detail')
    } else {
      setMode('list')
      setSelectedId(null)
      setEditingTask(null)
      if (window.location.hash !== `#${target}`) window.location.hash = target
      setTab(target)
    }
  }

  const handleBackToList = () => {
    setMode('list')
    setSelectedId(null)
    setEditingTask(null)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteTask(deleteTarget.id)
      if (mode === 'detail') handleBackToList()
      showToast('Tugas dihapus')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="min-h-screen pb-24 sm:pb-8">
      {showSplash && <SplashScreen onFinish={finishSplash} />}

      <Header tab={mode === 'list' ? tab : ''} onTab={handleNavigate} onNavigateCreate={() => handleNavigate('Create')} />

      <main className="mx-auto max-w-4xl px-4 py-5">
        {mode === 'create' && (
          <CreateTaskPage
            onBack={handleBackToList}
            onSuccess={() => {
              showToast('Tugas berhasil ditambahkan')
              handleNavigate('Tugas')
            }}
          />
        )}

        {mode === 'edit' && editingTask && (
          <EditTaskPage
            task={editingTask}
            onBack={handleBackToList}
            onSuccess={(t) => {
              showToast('Perubahan disimpan')
              setSelectedId(t.id)
              setMode('detail')
            }}
          />
        )}

        {mode === 'detail' && (
          <TaskDetail
            taskId={selectedId}
            onBack={handleBackToList}
            onEdit={(t) => handleNavigate('Edit', t)}
            onDelete={setDeleteTarget}
          />
        )}

        {mode === 'list' && (
          <>
            {tab === 'Beranda' && <HomePage onNavigate={handleNavigate} />}
            {tab === 'Tugas' && <TasksPage onNavigate={handleNavigate} onDelete={setDeleteTarget} />}
            {tab === 'Jadwal' && <SchedulePage onNavigate={handleNavigate} />}
            {tab === 'Profil' && <ProfilePage />}
          </>
        )}
      </main>

      <BottomNav tab={mode === 'list' ? tab : ''} onTab={handleNavigate} />
      <PWABadge />

      {toast && (
        <div className="fixed inset-x-0 top-16 z-50 flex justify-center px-4" role="status">
          <div className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg animate-fade-in">
            <CheckCircle2 size={16} className="text-emerald-400" />
            {toast}
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus tugas?"
        message={deleteTarget ? `"${deleteTarget.title}" akan dihapus permanen.` : ''}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </div>
  )
}

export default function App() {
  return (
    <TasksProvider>
      <AppShell />
    </TasksProvider>
  )
}
