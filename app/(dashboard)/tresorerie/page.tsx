'use client'

// app/(dashboard)/tresorerie/page.tsx
import { useState, useEffect, useMemo } from 'react'
import { Wallet, AlertTriangle, Settings2, Plus, X } from 'lucide-react'
import { usePersistedList, useTransactions, useFactures } from '@/lib/store'
import {
  COMPTES_KEY, SEUIL_KEY, COULEURS_COMPTES,
  construireMouvements, soldeQuotidien, previsionsEntrees, previsionsSorties, fmt,
  type CompteBancaire, type DepenseAPayer,
} from './tresorerie.data'
import { ComptesBancairesRow, TresorerieAreaChart } from './TresorerieChart'
import { MouvementsTable, PrevisionnelSection } from './TresoreriePrevisionnel'

function lireSeuil(): number {
  try {
    const v = Number(localStorage.getItem(SEUIL_KEY))
    return Number.isFinite(v) && v > 0 ? v : 0
  } catch {
    return 0
  }
}

export default function TresoreriePage() {
  const [mounted, setMounted]         = useState(false)
  const [seuilAlerte, setSeuilAlerte] = useState(0)
  const [editSeuil, setEditSeuil]     = useState(false)
  const [seuilInput, setSeuilInput]   = useState('')
  const [comptes, setComptes]         = usePersistedList<CompteBancaire>(COMPTES_KEY)
  const [transactions]                = useTransactions()
  const [factures]                    = useFactures()
  const [depenses]                    = usePersistedList<DepenseAPayer>('comptrack_depenses')
  const [compteModal, setCompteModal] = useState(false)
  const [compteForm, setCompteForm]   = useState({ banque: '', numero: '', solde: '' })
  const [compteErreur, setCompteErreur] = useState('')

  useEffect(() => {
    setMounted(true)
    const s = lireSeuil()
    setSeuilAlerte(s)
    setSeuilInput(s > 0 ? String(s) : '')
  }, [])

  const soldesQuotidiens = useMemo(() => (mounted ? soldeQuotidien(transactions) : []), [mounted, transactions])
  const mouvements = useMemo(() => construireMouvements(transactions), [transactions])
  const entrees = useMemo(() => previsionsEntrees(factures), [factures])
  const sorties = useMemo(() => previsionsSorties(depenses), [depenses])

  const soldeTotal   = comptes.reduce((a, c) => a + c.solde, 0)
  const alerteActive = seuilAlerte > 0 && comptes.length > 0 && soldeTotal < seuilAlerte
  const vide = comptes.length === 0 && transactions.length === 0

  const handleSeuil = () => {
    const v = parseInt(seuilInput.replace(/\D/g, ''), 10)
    const valeur = !isNaN(v) && v > 0 ? v : 0
    setSeuilAlerte(valeur)
    try {
      if (valeur > 0) localStorage.setItem(SEUIL_KEY, String(valeur))
      else localStorage.removeItem(SEUIL_KEY)
    } catch {
      // stockage indisponible : le seuil vaut pour cette session seulement
    }
    setEditSeuil(false)
  }

  const ouvrirCompte = () => {
    setCompteForm({ banque: '', numero: '', solde: '' })
    setCompteErreur('')
    setCompteModal(true)
  }

  const ajouterCompte = (e: React.FormEvent) => {
    e.preventDefault()
    const solde = compteForm.solde.trim() === '' ? 0 : Number(compteForm.solde)
    if (!compteForm.banque.trim() || isNaN(solde)) {
      setCompteErreur('Indiquez le nom du compte et un solde valide.')
      return
    }
    setComptes((prev) => [...prev, {
      id: `cpt_${Date.now()}`,
      banque: compteForm.banque.trim(),
      numero: compteForm.numero.trim(),
      solde,
      couleur: COULEURS_COMPTES[prev.length % COULEURS_COMPTES.length],
    }])
    setCompteModal(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-5 h-5" style={{ color: 'var(--cyan)' }} />
            <h1 className="text-2xl font-bold">Trésorerie</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--text2)' }}>
            {comptes.length} compte{comptes.length > 1 ? 's' : ''} suivi{comptes.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={ouvrirCompte}
            className="inline-flex items-center gap-2 px-4 min-h-10 rounded-xl text-sm font-semibold hover:brightness-110"
            style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
            <Plus className="w-4 h-4" /> Ajouter un compte
          </button>
          <button onClick={() => setEditSeuil(true)}
            className="inline-flex items-center gap-2 px-4 min-h-10 rounded-xl text-sm font-medium border transition-all hover:opacity-80"
            style={{ borderColor: 'var(--border2)', color: 'var(--text2)', background: 'var(--bg2)' }}>
            <Settings2 className="w-4 h-4" />
            {seuilAlerte > 0 ? `Seuil d'alerte : ${fmt(seuilAlerte)}` : "Définir un seuil d'alerte"}
          </button>
        </div>
      </div>

      {vide && (
        <div className="p-8 rounded-2xl border text-center" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <p className="text-base font-semibold mb-1">Aucune donnée de trésorerie pour le moment</p>
          <p className="text-sm mb-5 mx-auto max-w-md" style={{ color: 'var(--text2)' }}>
            Ajoutez vos comptes (banque, mobile money, caisse) avec leur solde actuel. Les mouvements et le
            graphique se construisent à partir de vos transactions.
          </p>
          <button onClick={ouvrirCompte}
            className="inline-flex items-center gap-2 px-4 min-h-10 rounded-xl text-sm font-semibold hover:brightness-110"
            style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
            <Plus className="w-4 h-4" /> Ajouter un compte
          </button>
        </div>
      )}

      {/* Alerte solde bas */}
      {alerteActive && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold"
          style={{ background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.35)', color: 'var(--amber)' }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          Attention : solde global ({fmt(soldeTotal)}) est en dessous du seuil d&apos;alerte ({fmt(seuilAlerte)})
        </div>
      )}

      {/* Modal seuil */}
      {editSeuil && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6 space-y-4"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border2)' }}>
            <h3 className="font-bold">Seuil d&apos;alerte</h3>
            <input type="number" value={seuilInput} placeholder="Montant en FCFA (vide = pas d'alerte)"
              onChange={(e) => setSeuilInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none font-mono"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }} />
            <div className="flex gap-3">
              <button onClick={() => setEditSeuil(false)}
                className="flex-1 min-h-10 rounded-xl text-sm border"
                style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}>
                Annuler
              </button>
              <button onClick={handleSeuil}
                className="flex-1 min-h-10 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal compte */}
      {compteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setCompteModal(false)}>
          <form onSubmit={ajouterCompte} onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl p-6 space-y-3"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border2)' }}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Nouveau compte</h3>
              <button type="button" onClick={() => setCompteModal(false)} aria-label="Fermer"
                className="p-2 rounded-xl" style={{ color: 'var(--text2)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            {[
              { label: 'Nom du compte *', key: 'banque', type: 'text', placeholder: 'Banque, mobile money, caisse…' },
              { label: 'Numéro (facultatif)', key: 'numero', type: 'text', placeholder: 'Référence du compte' },
              { label: 'Solde actuel (FCFA)', key: 'solde', type: 'number', placeholder: 'Solde actuel' },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs mb-1" style={{ color: 'var(--text2)' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  value={compteForm[f.key as 'banque' | 'numero' | 'solde']}
                  onChange={(e) => setCompteForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }} />
              </div>
            ))}
            {compteErreur && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)' }}>
                {compteErreur}
              </p>
            )}
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setCompteModal(false)}
                className="flex-1 min-h-10 rounded-xl text-sm border"
                style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}>
                Annuler
              </button>
              <button type="submit"
                className="flex-1 min-h-10 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comptes */}
      {comptes.length > 0 && <ComptesBancairesRow soldeTotal={soldeTotal} comptes={comptes} />}

      {/* Graphe 90 jours */}
      {soldesQuotidiens.length > 0 && <TresorerieAreaChart mounted={mounted} data={soldesQuotidiens} />}

      {/* Mouvements */}
      {mouvements.length > 0 && <MouvementsTable mouvements={mouvements} />}

      {/* Prévisionnel */}
      {(entrees.length > 0 || sorties.length > 0) && (
        <PrevisionnelSection entrees={entrees} sorties={sorties} soldeTotal={soldeTotal} />
      )}
    </div>
  )
}
