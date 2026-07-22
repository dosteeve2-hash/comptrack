'use client'

// app/(dashboard)/transactions/page.tsx
import { useState, useMemo } from 'react'
import { Plus, Search, Filter, List, BookOpen, Download, ChevronDown } from 'lucide-react'
import { exportTransactions } from '@/lib/export'
import { transactions as initialTransactions, categories } from '@/lib/data'
import type { Transaction } from '@/lib/data'
import { formatMontant } from '@/lib/utils'
import type { NewTransactionForm, VueTx } from './transactions.types'
import { defaultForm } from './transactions.types'
import { TransactionModal } from './TransactionModal'
import { TransactionTable } from './TransactionTable'
import { TransactionJournal } from './TransactionJournal'

export default function TransactionsPage() {
  const [txList, setTxList]         = useState<Transaction[]>(initialTransactions)
  const [search, setSearch]         = useState('')
  const [filterType, setFilterType] = useState<'all' | 'revenu' | 'depense'>('all')
  const [filterCat, setFilterCat]   = useState('all')
  const [modalOpen, setModalOpen]   = useState(false)
  const [form, setForm]             = useState<NewTransactionForm>(defaultForm)
  const [formError, setFormError]   = useState('')
  const [vue, setVue]               = useState<VueTx>('simple')

  const filtered = useMemo(() => {
    return txList.filter((tx) => {
      const matchSearch =
        search === '' ||
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        tx.categorie.toLowerCase().includes(search.toLowerCase()) ||
        (tx.client ?? '').toLowerCase().includes(search.toLowerCase())
      const matchType = filterType === 'all' || tx.type === filterType
      const matchCat  = filterCat === 'all' || tx.categorie === filterCat
      return matchSearch && matchType && matchCat
    })
  }, [txList, search, filterType, filterCat])

  const totalRevenus  = filtered.filter((t) => t.type === 'revenu').reduce((s, t) => s + t.montant, 0)
  const totalDepenses = filtered.filter((t) => t.type === 'depense').reduce((s, t) => s + t.montant, 0)

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    if (name === 'type') {
      setForm((prev) => ({ ...prev, type: value as 'revenu' | 'depense', categorie: '' }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!form.montant || !form.categorie || !form.description || !form.date) {
      setFormError('Veuillez remplir tous les champs obligatoires.')
      return
    }
    const montant = parseFloat(form.montant.replace(/\s/g, ''))
    if (isNaN(montant) || montant <= 0) {
      setFormError('Le montant doit être un nombre positif.')
      return
    }
    const newTx: Transaction = {
      id: `t${Date.now()}`,
      type: form.type,
      montant,
      categorie: form.categorie,
      description: form.description,
      date: form.date,
      client: form.client || undefined,
      statut: 'validee',
    }
    setTxList((prev) => [newTx, ...prev])
    setForm(defaultForm)
    setModalOpen(false)
  }

  const SUMMARY = [
    { label: 'Total revenus',  value: totalRevenus,                  color: 'var(--green)' },
    { label: 'Total dépenses', value: totalDepenses,                  color: 'var(--red)'   },
    { label: 'Solde filtré',   value: totalRevenus - totalDepenses,   color: 'var(--blue)'  },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} affichée{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Vue toggle */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
            {([{ id: 'simple', label: 'Vue simple', icon: List }, { id: 'journal', label: 'Journal comptable', icon: BookOpen }] as const).map((v) => (
              <button key={v.id} onClick={() => setVue(v.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: vue === v.id ? 'var(--bg3)' : 'transparent',
                  color:      vue === v.id ? 'var(--text)' : 'var(--text2)',
                  border:     vue === v.id ? '1px solid var(--border2)' : '1px solid transparent',
                }}>
                <v.icon className="w-3.5 h-3.5" /> {v.label}
              </button>
            ))}
          </div>
          <button onClick={() => exportTransactions(filtered)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110"
            style={{ border: '1px solid var(--border2)', color: 'var(--text2)', background: 'var(--bg2)' }}>
            <Download className="w-4 h-4" /> Exporter CSV
          </button>
          <button onClick={() => { setForm(defaultForm); setFormError(''); setModalOpen(true) }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110"
            style={{ background: 'var(--green)', color: '#000' }}>
            <Plus className="w-4 h-4" /> Nouvelle transaction
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {SUMMARY.map((s) => (
          <div key={s.label} className="p-4 rounded-xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--text2)' }}>{s.label}</p>
            <p className="font-bold font-mono" style={{ color: s.color }}>{formatMontant(Math.abs(s.value))}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl border"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text2)' }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une transaction..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }} />
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg3)' }}>
          {(['all', 'revenu', 'depense'] as const).map((t) => (
            <button key={t} onClick={() => setFilterType(t)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: filterType === t ? 'var(--bg2)' : 'transparent',
                color:      filterType === t ? 'var(--text)' : 'var(--text2)',
                border:     filterType === t ? '1px solid var(--border2)' : '1px solid transparent',
              }}>
              {t === 'all' ? 'Tout' : t === 'revenu' ? 'Revenus' : 'Dépenses'}
            </button>
          ))}
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text2)' }} />
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
            className="pl-8 pr-8 py-2.5 rounded-xl text-sm outline-none appearance-none"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }}>
            <option value="all">Toutes catégories</option>
            {categories.map((c) => <option key={c.id} value={c.nom}>{c.nom}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
            style={{ color: 'var(--text2)' }} />
        </div>
      </div>

      {/* Table views */}
      {vue === 'journal' && <TransactionJournal transactions={filtered} />}
      {vue === 'simple' && (
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <TransactionTable transactions={filtered} />
        </div>
      )}

      {/* Modal */}
      <TransactionModal
        open={modalOpen}
        form={form}
        formError={formError}
        onChange={handleFormChange}
        onSubmit={handleAddTransaction}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
