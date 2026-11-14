import { AlertTriangle, Loader } from 'lucide-react'

export default function ConfirmModal({
  open,
  title = 'Yakin?',
  message,
  confirmLabel = 'Hapus',
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div className="card w-full max-w-sm p-5 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-rose-100 p-2 text-rose-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            {message && <p className="mt-1 text-sm text-slate-600">{message}</p>}
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            Batal
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading && <Loader size={16} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
