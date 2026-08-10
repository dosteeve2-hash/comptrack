'use client'

import { useState } from 'react'
import { Target, Plus, CheckCircle2, AlertTriangle, Clock, X, TrendingUp, Users, Wallet, Settings } from 'lucide-react'

type Categorie = 'Financier' | 'Commercial' | 'RH' | 'Operationnel'
type StatutObj = 'Atteint' | 'En cours' | 'En retard' | 'En pause'

interface Objectif {
  id: number; titre: string; description: string; categorie: Categorie
  cible: number; actuel: number; unite: string; echeance: string; statut: StatutObj
}

const MOCK: Objectif[] = [
  { id: 1, titre: "CA mensuel juillet 2026",        description: "Atteindre 4 millions FCFA de chiffre d'affaires en juillet", categorie: 'Financier',    cible: 4000000, actuel: 4035000, unite: 'FCFA',    echeance: '2026-07-31', statut: 'Atteint'   },
  { id: 2, titre: "Reduire charges fixes de 15%",   description: "Renogocier loyer, optimiser factures energie et telecom",     categorie: 'Financier',    cible: 15,      actuel: 6,       unite: '%',      echeance: '2026-12-31', statut: 'En cours'  },
  { id: 3, titre: "Fonds de roulement 3 mois",      description: "Maintenir en tresorerie l'equivalent de 3 mois de charges",  categorie: 'Financier',    cible: 3000000, actuel: 3200000, unite: 'FCFA',    echeance: '2026-06-30', statut: 'Atteint'   },
  { id: 4, titre: "20 clients actifs",               description: "Atteindre 20 clients avec contrat actif ou abonnement",      categorie: 'Commercial',   cible: 20,      actuel: 14,      unite: 'clients', echeance: '2026-09-30', statut: 'En cours'  },
  { id: 5, titre: "Marge brute superieure a 40%",   description: "Optimiser le mix produits/services pour ameliorer la marge",  categorie: 'Financier',    cible: 40,      actuel: 34,      unite: '%',      echeance: '2026-12-31', statut: 'En cours'  },
  { id: 6, titre: "Recruter 3 commerciaux",          description: "Renforcer l'equipe commerciale terrain sur Ouaga et Bobo",   categorie: 'RH',           cible: 3,       actuel: 1,       unite: 'employes', echeance: '2026-10-31', statut: 'En cours' },
  { id: 7, titre: "Taux recouvrement 90%",           description: "Reduire les creances impayees, relancer systematiquement",   categorie: 'Operationnel', cible: 90,      actuel: 82,      unite: '%',      echeance: '2026-09-30', statut: 'En cours'  },
  { id: 8, titre: "100 prospects contacts",          description: "Prospecter 100 nouvelles entreprises avant fin Q3 2026",     categorie: 'Commercial',   cible: 100,     actuel: 38,      unite: 'contacts', echeance: '2026-09-30', statut: 'En retard' },
  { id: 9, titre: "Certification ISO 9001",          description: "Engager le processus de certification qualite ISO 9001",     categorie: 'Operationnel', cible: 100,     actuel: 20,      unite: '%',      echeance: '2026-12-31', statut: 'En pause'  },
]

const CAT_ICON: Record<Categorie, typeof Target> = {
  'Financier': Wallet, 'Commercial': TrendingUp, 'RH': Users, 'Operationnel': Settings,
}
const CAT_COLOR: Record<Categorie, string> = {
  'Financier': '#D4AF37', 'Commercial': '#00D4FF', 'RH': '#818CF8', 'Operationnel': '#10b981',
}
const STATUT_CFG: Record<StatutObj, { color: string; bg: string; icon: typeof Target }> = {
  'Atteint':   { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: CheckCircle2   },
  'En cours':  { color: '#D4AF37', bg: 'rgba(212,175,55,0.12)',  icon: Target         },
  'En retard': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: AlertTriangle  },
  'En pause':  { color: '#64748b', bg: 'rgba(100,116,139,0.12)', icon: Clock          },
}

const fmtVal = (n: number, unite: string) =>
  unite === 'FCFA' ? n.toLocaleString('fr-FR') + ' FCFA' : `${n} ${unite}`

function Progress({ pct, statut }: { pct: number; statut: StatutObj }) {
  const color = statut === 'Atteint' ? '#10b981' : statut === 'En retard' ? '#ef4444' : statut === 'En pause' ? '#64748b' : undefined
  return (
    <div className="h-2 rounded-full" style={{ background: 'var(--bg3)' }}>
      <div className="h-full rounded-full transition-all duration-500" style={{
        width: `${Math.min(pct, 100)}%`,
        background: color || 'linear-gradient(90deg, #D4AF37, #00D4FF)',
      }} />
    </div>
  )
}

export default function ObjectifsPage() {
  const [filtreCat, setFiltreCat] = useState<Categorie | 'Toutes'>('Toutes')
  const [selected, setSelected] = useState<Objectif | null>(null)

  const filtered = MOCK.filter(o => filtreCat === 'Toutes' || o.categorie === filtreCat)

  const nbAtteints  = MOCK.filter(o => o.statut === 'Atteint').length
  const nbEnCours   = MOCK.filter(o => o.statut === 'En cours').length
  const nbEnRetard  = MOCK.filter(o => o.statut === 'En retard').length
  const avgProgress = Math.round(MOCK.reduce((s, o) => s + Math.min((o.actuel / o.cible) * 100, 100), 0) / MOCK.length)

  const CATS: Categorie[] = ['Financier', 'Commercial', 'RH', 'Operationnel']

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Objectifs</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
            {nbAtteints}/{MOCK.length} objectifs atteints — progression globale {avgProgress}%
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110"
          style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
          <Plus className="w-4 h-4" /> Nouvel objectif
        </button>
      </div>

      {nbEnRetard > 0 && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} />
          <p className="text-sm">
            <span className="font-semibold" style={{ color: '#ef4444' }}>{nbEnRetard} objectif{nbEnRetard > 1 ? 's' : ''} en retard</span>
            <span style={{ color: 'var(--text2)' }}> — action requise avant echeance</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Atteints',      value: String(nbAtteints),  sub: `sur ${MOCK.length} total`, color: '#10b981' },
          { label: 'En cours',      value: String(nbEnCours),   sub: 'progression active',       color: '#D4AF37' },
          { label: 'En retard',     value: String(nbEnRetard),  sub: 'action requise',           color: '#ef4444' },
          { label: 'Progression',   value: `${avgProgress}%`,   sub: 'moyenne tous objectifs',   color: 'var(--text)' },
        ].map((k, i) => (
          <div key={i} className="p-5 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
            <p className="text-xs mb-2" style={{ color: 'var(--text2)' }}>{k.label}</p>
            <p className="text-2xl font-bold font-mono" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {(['Toutes', ...CATS] as (Categorie | 'Toutes')[]).map(cat => {
          const active = filtreCat === cat
          return (
            <button key={cat} onClick={() => setFiltreCat(cat)}
              className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active ? (cat === 'Toutes' ? 'var(--gold)' : CAT_COLOR[cat as Categorie]) : 'var(--bg2)',
                color:      active ? (cat === 'Toutes' ? 'var(--navy)' : 'white') : 'var(--text2)',
                border:     active ? 'none' : '1px solid var(--border)',
              }}>
              {cat === 'Toutes' ? 'Tous' : cat}
              <span className="ml-1.5 text-xs opacity-70">
                {cat === 'Toutes' ? MOCK.length : MOCK.filter(o => o.categorie === cat).length}
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid gap-4">
        {filtered.map(obj => {
          const pct = Math.min(Math.round((obj.actuel / obj.cible) * 100), 100)
          const Icon = CAT_ICON[obj.categorie]
          const sCfg = STATUT_CFG[obj.statut]
          const SIcon = sCfg.icon
          return (
            <div key={obj.id} onClick={() => setSelected(obj)}
              className="p-5 rounded-2xl border cursor-pointer hover:brightness-110 transition-all"
              style={{ background: 'var(--bg2)', borderColor: obj.statut === 'Atteint' ? 'rgba(16,185,129,0.3)' : obj.statut === 'En retard' ? 'rgba(239,68,68,0.3)' : 'var(--border)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${CAT_COLOR[obj.categorie]}18` }}>
                    <Icon className="w-4 h-4" style={{ color: CAT_COLOR[obj.categorie] }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{obj.titre}</p>
                    <p className="text-xs" style={{ color: 'var(--text2)' }}>{obj.categorie} · {obj.echeance}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0"
                  style={{ background: sCfg.bg, color: sCfg.color }}>
                  <SIcon className="w-3 h-3" />{obj.statut}
                </span>
              </div>
              <Progress pct={pct} statut={obj.statut} />
              <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--text2)' }}>
                <span>{fmtVal(obj.actuel, obj.unite)} / {fmtVal(obj.cible, obj.unite)}</span>
                <span className="font-bold" style={{ color: sCfg.color }}>{pct}%</span>
              </div>
            </div>
          )
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelected(null)}>
          <div className="w-full max-w-md rounded-3xl p-6 space-y-4"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {(() => { const Icon = CAT_ICON[selected.categorie]; return (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${CAT_COLOR[selected.categorie]}18` }}>
                    <Icon className="w-5 h-5" style={{ color: CAT_COLOR[selected.categorie] }} />
                  </div>
                )})()}
                <div>
                  <h3 className="font-bold leading-snug">{selected.titre}</h3>
                  <p className="text-xs" style={{ color: 'var(--text2)' }}>{selected.categorie}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:brightness-110"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm" style={{ color: 'var(--text2)' }}>{selected.description}</p>
            <div className="space-y-2">
              <Progress pct={Math.min(Math.round((selected.actuel / selected.cible) * 100), 100)} statut={selected.statut} />
              <div className="flex justify-between text-xs" style={{ color: 'var(--text2)' }}>
                <span>Actuel : {fmtVal(selected.actuel, selected.unite)}</span>
                <span>Cible : {fmtVal(selected.cible, selected.unite)}</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {[
                ['Statut',    selected.statut],
                ['Echeance',  selected.echeance],
                ['Progression', `${Math.min(Math.round((selected.actuel / selected.cible) * 100), 100)}%`],
              ].map(([label, val], i) => (
                <div key={i} className="flex justify-between px-4 py-3"
                  style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg2)' : 'transparent' }}>
                  <span className="text-xs" style={{ color: 'var(--text2)' }}>{label}</span>
                  <span className="text-sm font-medium">{val}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium hover:opacity-80"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
                Fermer
              </button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110"
                style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
