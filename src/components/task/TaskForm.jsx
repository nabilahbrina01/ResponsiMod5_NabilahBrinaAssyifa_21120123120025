import { useState } from 'react'
import { Loader, Save } from 'lucide-react'
import { PRIORITIES, STATUSES, fromInputValue, toInputValue } from '../../utils/helpers'

const defaultDeadline = () => {
  const d = new Date()
  d.setDate(d.getDate() + 3)
  d.setHours(23, 59, 0, 0)
  return d.toISOString()
}

export default function TaskForm({ initial, submitLabel = 'Simpan', onSubmit, onCancel, courses = [] }) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    course: initial?.course ?? '',
    description: initial?.description ?? '',
    deadline: toInputValue(initial?.deadline ?? defaultDeadline()),
    priority: initial?.priority ?? 'sedang',
    status: initial?.status ?? 'belum',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Judul tugas wajib diisi'
    else if (form.title.trim().length < 3) e.title = 'Judul minimal 3 karakter'
    if (!form.course.trim()) e.course = 'Mata kuliah wajib diisi'
    if (!form.deadline) e.deadline = 'Deadline wajib diisi'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    setSubmitError(null)
    try {
      await onSubmit({
        title: form.title.trim(),
        course: form.course.trim(),
        description: form.description.trim(),
        deadline: fromInputValue(form.deadline),
        priority: form.priority,
        status: form.status,
      })
    } catch (err) {
      setSubmitError(err?.message || 'Gagal menyimpan tugas')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-5" noValidate>
      <div>
        <label className="label" htmlFor="title">Judul tugas</label>
        <input id="title" className="input" value={form.title} onChange={set('title')} placeholder="mis. Laporan Praktikum Modul 5" />
        {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
      </div>

      <div>
        <label className="label" htmlFor="course">Mata kuliah</label>
        <input id="course" className="input" list="course-list" value={form.course} onChange={set('course')} placeholder="mis. Praktikum PPB" />
        <datalist id="course-list">
          {courses.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {errors.course && <p className="mt-1 text-xs text-rose-600">{errors.course}</p>}
      </div>

      <div>
        <label className="label" htmlFor="deadline">Deadline</label>
        <input id="deadline" type="datetime-local" className="input" value={form.deadline} onChange={set('deadline')} />
        {errors.deadline && <p className="mt-1 text-xs text-rose-600">{errors.deadline}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="priority">Prioritas</label>
          <select id="priority" className="input" value={form.priority} onChange={set('priority')}>
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="status">Status</label>
          <select id="status" className="input" value={form.status} onChange={set('status')}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.short}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="description">Catatan <span className="font-normal text-slate-400">(opsional)</span></label>
        <textarea id="description" rows={4} className="input resize-none" value={form.description} onChange={set('description')} placeholder="Detail tugas, link materi, anggota kelompok…" />
      </div>

      {submitError && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{submitError}</p>}

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={saving}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
