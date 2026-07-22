'use client'

// app/(dashboard)/factures/page.tsx
import { useState } from 'react'
import { Plus, Printer, Eye, CheckCircle2, ArrowRight, Send } from 'lucide-react'
import { factures as initialFactures } from '@/lib/data'
import type { Facture, FactureArticle, Transaction } from '@/lib/data'
import { formatMontant, formatDate } from '@/lib/utils'
import type { NewFactureForm } from './factures.types'
import { statutConfig, statutSuivant, defaultArticle } from './factures.types'
import { FactureDetail } from './FactureDetail'
import { FactureCreateModal } from './FactureCreateModal'

export default function FacturesPage() {
  const [factureList, setFactureList]     = useState<Facture[]>(initialFactures)
  const [txCreees, setTxCreees]           = useState<Transaction[]>([])
  const [selectedFacture, setSelected]    = useState<Facture | null>(null)
  const [createOpen, setCreateOpen]       = useState(false)
  const [filterStatut, setFilter]         = useState<'all' | Facture['statut']>('all')
  const [form, setForm]                   = useState<NewFactureForm>({ client: '', dateEcheance: '', articles: [defaultArticle()] })
  const [formError, setFormError]         = useState('')
  const [toastMsg, setToastMsg]           = useState<string | null>(null)

  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3000) }

  const handleAvancerStatut = (id: string) => {
    setFactureList((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f
        const next = statutSuivant[f.statut]
        if (!next) return f
        const updated = { ...f, statut: next }
        if (next === 'payee') {
          const newTx: Transaction = {
            id: `tx-fac-${Date.now()}`,
            type: 'revenu',
            montant: f.montant,
            categorie: 'Prestations services',
            description: `Paiement ${f.numero} — ${f.client}`,
            date: new Date().toISOString().split('T')[0],
            client: f.client,
            statut: 'validee',
          }
          setTxCreees((prev) => [newTx, ...prev])
          setSelected((sel) => sel?.id === id ? updated : sel)
          showToast('✓ Facture marquée payée · Transaction revenu créée automatiquement')
        }
        return updated
      })
    )
  }

  const filtered = factureList.filter((f) => filterStatut === 'all' || f.statut === filterStatut)

  const totalPayee   = factureList.filter(f => f.statut === 'payee').reduce((s, f) => s + f.montant, 0)
  const totalEnCours = factureList.filter(f => ['envoyee','en_attente'].includes(f.statut)).reduce((s, f) => s + f.montant, 0)
  const totalRetard  = factureList.filter(f => f.statut === 'retard').reduce((s, f) => s + f.montant, 0)

  const updateArticle = (idx: number, field: keyof FactureArticle, value: string | number) => {
    setForm((prev) => {
      const arts = [...prev.articles]
      arts[idx] = { ...arts[idx], [field]: value } as FactureArticle
      if (field === 'quantite' || field === 'prixUnitaire') arts[idx].total = arts[idx].quantite * arts[idx].prixUnitaire
      return { ...prev, articles: arts }
    })
  }

  const handleCreateFacture = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!form.client || !form.dateEcheance) { setFormError("Client et date d'échéance obligatoires."); return }
    if (form.articles.some(a => !a.description || a.prixUnitaire <= 0)) {
      setFormError('Tous les articles doivent avoir une description et un prix.'); return
    }
    const newFacture: Facture = {
      id: `f${Date.now()}`,
      numero: `FAC-2026-${String(factureList.length + 1).padStart(3, '0')}`,
      client: form.client,
      montant: form.articles.reduce((s, a) => s + a.total, 0),
      dateCreation: new Date().toISOString().split('T')[0],
      dateEcheance: form.dateEcheance,
      statut: 'brouillon',
      articles: form.articles,
    }
    setFactureList((prev) => [newFacture, ...prev])
    setForm({ client: '', dateEcheance: '', articles: [defaultArticle()] })
    setCreateOpen(false)
  }

  const handlePrint = (f: Facture) => { setSelected(f); setTimeout(() => window.print(), 300) }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Factures</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>{filtered.length} facture{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setForm({ client: '', dateEcheance: '', articles: [defaultArticle()] }); setFormError(''); setCreateOpen(true) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110"
          style={{ background: 'var(--green)', color: '#000' }}>
          <Plus className="w-4 h-4" /> Nouvelle facture
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Encaissé', value: totalPayee, color: 'var(--green)' }, { label: 'En cours', value: totalEnCours, color: 'var(--amber)' }, { label: 'En retard', value: totalRetard, color: 'var(--red)' }].map((s) => (
          <div key={s.label} className="p-4 rounded-xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--text2)' }}>{s.label}</p>
            <p className="font-bold font-mono" style={{ color: s.color }}>{formatMontant(s.value)}</p>
          </div>
        ))}
      </div>

      {/* Flux info */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs"
        style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--text2)' }}>
        <span style={{ color: 'var(--blue)' }}>Flux :</span>
        {(['brouillon','envoyee','en_attente','payee'] as const).map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span style={{ color: statutConfig[s].color }}>{statutConfig[s].label}</span>
            {i < 3 && <ArrowRight className="w-3 h-3" />}
          </span>
        ))}
        <span className="ml-2">· Utilisez le bouton ▶ pour avancer le statut</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
        {(['all','brouillon','envoyee','en_attente','payee','retard'] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: filterStatut === s ? 'var(--bg3)' : 'transparent',
              color:      filterStatut === s ? 'var(--text)' : 'var(--text2)',
              border:     filterStatut === s ? '1px solid var(--border2)' : '1px solid transparent',
            }}>
            {s === 'all' ? 'Toutes' : statutConfig[s].label}
          </button>
        ))}
      </div>

      {/* Transactions auto */}
      {txCreees.length > 0 && (
        <div className="p-4 rounded-xl text-sm"
          style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--green)' }}>
            ✓ {txCreees.length} transaction{txCreees.length > 1 ? 's' : ''} revenu créée{txCreees.length > 1 ? 's' : ''} automatiquement
          </p>
          <p className="text-xs" style={{ color: 'var(--text2)' }}>Disponibles dans l&apos;onglet Transactions.</p>
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg animate-slide-up"
          style={{ background: 'var(--green)', color: '#000' }}>
          {toastMsg}
        </div>
      )}

      {/* Liste factures */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs font-medium uppercase tracking-wider"
                style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}>
                {['N° Facture','Client','Émise le','Échéance','Statut','Montant','Actions'].map((h, i) => (
                  <th key={h} className={`py-3 ${i === 0 ? 'text-left px-6' : i === 5 ? 'text-right px-4' : i === 6 ? 'text-center px-6' : 'text-left px-4'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {filtered.map((f) => {
                const s = statutConfig[f.statut]
                return (
                  <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4"><span className="font-mono text-xs font-semibold">{f.numero}</span></td>
                    <td className="px-4 py-4 font-medium">{f.client}</td>
                    <td className="px-4 py-4 text-xs font-mono" style={{ color: 'var(--text2)' }}>{formatDate(f.dateCreation)}</td>
                    <td className="px-4 py-4 text-xs font-mono" style={{ color: 'var(--text2)' }}>{formatDate(f.dateEcheance)}</td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    </td>
                    <td className="px-4 py-4 text-right font-bold font-mono">{formatMontant(f.montant)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setSelected(f)} className="p-1.5 rounded-lg hover:opacity-70" title="Voir" style={{ color: 'var(--blue)' }}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handlePrint(f)} className="p-1.5 rounded-lg hover:opacity-70" title="Imprimer" style={{ color: 'var(--text2)' }}>
                          <Printer className="w-4 h-4" />
                        </button>
                        {statutSuivant[f.statut] && (
                          <button onClick={() => handleAvancerStatut(f.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:brightness-110"
                            style={{
                              background: statutSuivant[f.statut] === 'payee' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.1)',
                              color:      statutSuivant[f.statut] === 'payee' ? 'var(--green)' : 'var(--blue)',
                              border: `1px solid ${statutSuivant[f.statut] === 'payee' ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.3)'}`,
                            }}>
                            {statutSuivant[f.statut] === 'payee' ? <><CheckCircle2 className="w-3.5 h-3.5" />&nbsp;Payée</>
                              : statutSuivant[f.statut] === 'en_attente' ? <><Send className="w-3.5 h-3.5" />&nbsp;Envoyer</>
                              : <><ArrowRight className="w-3.5 h-3.5" />&nbsp;{statutConfig[statutSuivant[f.statut]!].label}</>}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <FactureDetail facture={selectedFacture} onClose={() => setSelected(null)} onPrint={handlePrint} />
      <FactureCreateModal
        open={createOpen} form={form} formError={formError}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateFacture}
        onFormChange={(field, value) => setForm(p => ({ ...p, [field]: value }))}
        onArticleChange={updateArticle}
        onAddArticle={() => setForm(p => ({ ...p, articles: [...p.articles, defaultArticle()] }))}
        onRemoveArticle={(i) => setForm(p => ({ ...p, articles: p.articles.filter((_, j) => j !== i) }))}
      />
    </div>
  )
}
