'use client'

// app/(dashboard)/clients/ClientModal.tsx
import { X } from 'lucide-react'
import type { NewClientForm } from './clients.types'
import { FORM_FIELDS } from './clients.types'

const INP = 'w-full px-4 py-2.5 rounded-xl text-sm outline-none'
const INP_STYLE = { background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }

export function ClientModal({
  form,
  formError,
  onClose,
  onSubmit,
  onChange,
}: {
  form: NewClientForm
  formError: string
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 animate-slide-up"
        style={{ background: 'var(--bg2)', border: '1px solid var(--border2)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Nouveau contact</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'var(--text2)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Type selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Type *</label>
            <div className="flex gap-2">
              {(['client', 'fournisseur'] as const).map((t) => {
                const active = form.type === t
                return (
                  <button key={t} type="button"
                    onClick={() => onChange({ target: { name: 'type', value: t } } as React.ChangeEvent<HTMLInputElement>)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all capitalize"
                    style={{
                      background: active ? (t === 'client' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)') : 'var(--bg3)',
                      border: `1px solid ${active ? (t === 'client' ? 'var(--green)' : 'var(--blue)') : 'var(--border2)'}`,
                      color: active ? (t === 'client' ? 'var(--green)' : 'var(--blue)') : 'var(--text2)',
                    }}>
                    {t}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Fields */}
          {FORM_FIELDS.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-2" htmlFor={field.name}>{field.label}</label>
              <input
                id={field.name} name={field.name}
                type={field.inputType ?? 'text'}
                value={form[field.name]}
                onChange={onChange}
                placeholder={field.placeholder}
                required={field.required}
                className={INP} style={INP_STYLE} />
            </div>
          ))}

          {formError && (
            <p className="text-xs px-4 py-2 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)' }}>
              {formError}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium hover:opacity-70"
              style={{ border: '1px solid var(--border2)', color: 'var(--text2)' }}>
              Annuler
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110"
              style={{ background: 'var(--green)', color: '#000' }}>
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
