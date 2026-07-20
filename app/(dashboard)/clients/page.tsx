'use client'

// app/(dashboard)/clients/page.tsx
import { useState, useMemo } from 'react'
import { Search, UserPlus, TrendingUp, Package } from 'lucide-react'
import { clients as initialClients } from '@/lib/data'
import type { Client } from '@/lib/data'
import { formatMontant } from '@/lib/utils'
import type { NewClientForm } from './clients.types'
import { defaultForm } from './clients.types'
import { ClientCard } from './ClientCard'
import { ClientModal } from './ClientModal'

export default function ClientsPage() {
  const [clientList, setClientList] = useState<Client[]>(initialClients)
  const [search, setSearch]         = useState('')
  const [filterType, setFilterType] = useState<'all' | 'client' | 'fournisseur'>('all')
  const [modalOpen, setModalOpen]   = useState(false)
  const [form, setForm]             = useState<NewClientForm>(defaultForm)
  const [formError, setFormError]   = useState('')

  const filtered = useMemo(() =>
    clientList.filter((c) => {
      const matchSearch = search === '' ||
        c.nom.toLowerCase().includes(search.toLowerCase()) ||
        c.ville.toLowerCase().includes(search.toLowerCase()) ||
        (c.email ?? '').toLowerCase().includes(search.toLowerCase())
      return matchSearch && (filterType === 'all' || c.type === filterType)
    }), [clientList, search, filterType])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value } as NewClientForm))
  }

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!form.nom || !form.ville) { setFormError('Le nom et la ville sont obligatoires.'); return }
    const newClient: Client = {
      id: `cl${Date.now()}`,
      nom: form.nom, type: form.type,
      email: form.email || undefined,
      telephone: form.telephone || undefined,
      ville: form.ville, pays: form.pays,
      totalTransactions: 0,
      dernierContact: new Date().toISOString().split('T')[0],
    }
    setClientList((prev) => [newClient, ...prev])
    setForm(defaultForm)
    setModalOpen(false)
  }

  const nbClients      = clientList.filter((c) => c.type === 'client').length
  const nbFournisseurs = clientList.filter((c) => c.type === 'fournisseur').length
  const volTotal       = clientList.reduce((s, c) => s + c.totalTransactions, 0)

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients &amp; Fournisseurs</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
            {filtered.length} contact{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => { setForm(defaultForm); setFormError(''); setModalOpen(true) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: 'var(--green)', color: '#000' }}>
          <UserPlus className="w-4 h-4" /> Nouveau contact
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Clients',      value: nbClients,              color: 'var(--green)', icon: TrendingUp },
          { label: 'Fournisseurs', value: nbFournisseurs,         color: 'var(--blue)',  icon: Package    },
          { label: 'Volume total', value: formatMontant(volTotal), color: 'var(--amber)', icon: TrendingUp },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--text2)' }}>{s.label}</p>
            <p className="font-bold font-mono text-xl" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl border"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text2)' }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un client ou fournisseur..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }} />
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg3)' }}>
          {(['all', 'client', 'fournisseur'] as const).map((t) => (
            <button key={t} onClick={() => setFilterType(t)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: filterType === t ? 'var(--bg2)' : 'transparent',
                color:      filterType === t ? 'var(--text)' : 'var(--text2)',
                border:     filterType === t ? '1px solid var(--border2)' : '1px solid transparent',
              }}>
              {t === 'all' ? 'Tous' : t === 'client' ? 'Clients' : 'Fournisseurs'}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text2)' }}>
          <p className="text-lg font-medium mb-1">Aucun contact trouvé</p>
          <p className="text-sm">Modifiez la recherche ou ajoutez un nouveau contact.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => <ClientCard key={client.id} client={client} />)}
        </div>
      )}

      {modalOpen && (
        <ClientModal
          form={form} formError={formError}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddClient}
          onChange={handleFormChange}
        />
      )}
    </div>
  )
}
