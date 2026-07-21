'use client'

// app/(dashboard)/rapports/RapportsFiscal.tsx
import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { ChevronDown, AlertCircle } from 'lucide-react'
import { donneesMensuelles } from '@/lib/data'
import { formatMontant } from '@/lib/utils'
import { TVA_RATE, TVA_DEDUC_FACTOR, donneesTVAMensuelles } from './rapports.data'

/* ─── Types ──────────────────────────────────────────────────────────────────── */
type Trimestre = 'T1' | 'T2' | 'T3' | 'T4'

const QUARTER_IDX: Record<Trimestre, number[]> = {
  T1: [0, 1, 2],
  T2: [3, 4, 5],
  T3: [],
  T4: [],
}
const QUARTER_LABEL: Record<Trimestre, string> = {
  T1: 'Janvier – Mars',
  T2: 'Avril – Juin',
  T3: 'Juillet – Septembre',
  T4: 'Octobre – Décembre',
}

/* ─── Constantes fiscales BF ─────────────────────────────────────────────────── */
const IBICA_RATE       = 0.275   // IS Burkina Faso
const PATENTE_ANNUAL   = 150_000 // forfait annuel patente
const SALAIRE_MENSUEL  = 250_000 // salaire de référence (données transactions)
const CNSS_PATRON_RATE = 0.16    // cotisation patronale

/* ─── Tooltip Recharts ───────────────────────────────────────────────────────── */
interface TipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}
function ChartTip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="p-3 rounded-xl text-xs shadow-lg"
      style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }}>
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((e, i) => (
        <p key={i} style={{ color: e.color }}>{e.name} : {formatMontant(e.value)}</p>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════════
   COMPOSANT
   ════════════════════════════════════════════════════════════════════════════ */
export function RapportsFiscal() {
  const [trimestre, setTrimestre] = useState<Trimestre>('T2')
  const [mounted, setMounted]     = useState(false)
  useEffect(() => setMounted(true), [])

  /* ── Calculs trimestriels ─────────────────────────────────────────────────── */
  const idx         = QUARTER_IDX[trimestre]
  const quarterData = idx.map((i) => donneesMensuelles[i]).filter(Boolean)
  const tvaData     = idx.map((i) => donneesTVAMensuelles[i]).filter(Boolean)
  const hasData     = quarterData.length > 0

  const caHT          = quarterData.reduce((s, m) => s + m.revenus,  0)
  const totalDep      = quarterData.reduce((s, m) => s + m.depenses, 0)
  const tvaCollectee  = Math.round(caHT     * TVA_RATE)
  const tvaDeductible = Math.round(totalDep * TVA_RATE * TVA_DEDUC_FACTOR)
  const tvaAReverser  = tvaCollectee - tvaDeductible
  const resultatNetQ  = quarterData.reduce((s, m) => s + m.benefice, 0)

  /* ── Impôts BF ────────────────────────────────────────────────────────────── */
  const ibica    = Math.max(
    Math.round(resultatNetQ * IBICA_RATE),
    Math.round(caHT * 0.005),           // minimum fiscal 0,5 % CA
    Math.round(PATENTE_ANNUAL * 0.25),  // plancher absolu
  )
  const patente  = Math.round(PATENTE_ANNUAL / 4)
  const cnss     = Math.round(SALAIRE_MENSUEL * quarterData.length * CNSS_PATRON_RATE)
  const totalImp = ibica + patente + cnss

  /* ─────────────────────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">

      {/* ── Sélecteur trimestre + année ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 p-1 rounded-xl"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
          {(['T1', 'T2', 'T3', 'T4'] as Trimestre[]).map((t) => (
            <button key={t} onClick={() => setTrimestre(t)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: trimestre === t ? 'var(--bg3)' : 'transparent',
                color:      trimestre === t ? 'var(--text)' : 'var(--text2)',
                border:     trimestre === t ? '1px solid var(--border2)' : '1px solid transparent',
              }}>
              {t}
            </button>
          ))}
        </div>

        <div className="relative flex items-center">
          <select defaultValue="2026" className="pl-4 pr-8 py-2 rounded-xl text-sm font-medium outline-none appearance-none"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
          <ChevronDown className="absolute right-2.5 w-4 h-4 pointer-events-none" style={{ color: 'var(--text2)' }} />
        </div>

        <span className="text-sm" style={{ color: 'var(--text2)' }}>
          {QUARTER_LABEL[trimestre]} 2026
        </span>
      </div>

      {/* ── Pas de données ── */}
      {!hasData && (
        <div className="flex items-center gap-3 p-5 rounded-2xl"
          style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--amber)' }} />
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--amber)' }}>
              Données non disponibles pour {trimestre} 2026
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>
              Sélectionnez T1 ou T2 pour voir les données disponibles.
            </p>
          </div>
        </div>
      )}

      {hasData && (
        <>
          {/* ── KPIs fiscaux ── */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'CA brut HT',          value: caHT,          color: 'var(--text)'  },
              { label: 'TVA collectée',        value: tvaCollectee,  color: 'var(--blue)'  },
              { label: 'TVA déductible',       value: tvaDeductible, color: 'var(--green)' },
              { label: 'TVA nette à reverser', value: tvaAReverser,  color: tvaAReverser > 0 ? 'var(--amber)' : 'var(--green)' },
              { label: 'Résultat net',         value: resultatNetQ,  color: resultatNetQ >= 0 ? 'var(--green)' : 'var(--red)'  },
            ].map((kpi) => (
              <div key={kpi.label} className="p-4 rounded-xl border"
                style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text2)' }}>{kpi.label}</p>
                <p className="font-bold font-mono" style={{ color: kpi.color }}>
                  {formatMontant(kpi.value)}
                </p>
              </div>
            ))}
          </div>

          {/* ── AreaChart CA mensuel (toute l'année) ── */}
          <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold">Évolution CA mensuel — 2026</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>
                  Chiffre d&apos;affaires HT par mois (TVA non incluse)
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                {[['#D4AF37', 'CA HT'], ['#ef4444', 'Dépenses HT']].map(([c, l]) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded" style={{ background: c }} /> {l}
                  </span>
                ))}
              </div>
            </div>
            {mounted ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={donneesMensuelles} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gradCA"  x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#D4AF37" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}    />
                    </linearGradient>
                    <linearGradient id="gradDep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="mois" tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text2)', fontSize: 10 }} axisLine={false} tickLine={false}
                    tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(1)}M`} />
                  <Tooltip content={<ChartTip />} />
                  <Area type="monotone" dataKey="revenus"  name="CA HT"       stroke="#D4AF37" strokeWidth={2} fill="url(#gradCA)"  />
                  <Area type="monotone" dataKey="depenses" name="Dépenses HT"  stroke="#ef4444" strokeWidth={2} fill="url(#gradDep)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 rounded-xl animate-pulse" style={{ background: 'var(--bg3)' }} />
            )}
          </div>

          {/* ── Tableau TVA mensuel ── */}
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold">Tableau TVA — {trimestre} 2026</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>
                Taux TVA Burkina Faso : 18% · Déductibilité estimée : 60% des achats
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs font-medium uppercase tracking-wider"
                    style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}>
                    {['Mois', 'CA HT', 'TVA collectée (18%)', 'TVA déductible', 'Net à reverser'].map((h, i) => (
                      <th key={h} className={`py-3 ${i === 0 ? 'text-left px-6' : 'text-right px-5'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {tvaData.map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium">{row.mois}</td>
                      <td className="px-5 py-4 text-right font-mono text-xs" style={{ color: 'var(--text2)' }}>
                        {formatMontant(row.caHT)}
                      </td>
                      <td className="px-5 py-4 text-right font-mono" style={{ color: 'var(--blue)' }}>
                        {formatMontant(row.tvaCollectee)}
                      </td>
                      <td className="px-5 py-4 text-right font-mono" style={{ color: 'var(--green)' }}>
                        {formatMontant(row.tvaDeductible)}
                      </td>
                      <td className="px-5 py-4 text-right font-bold font-mono"
                        style={{ color: row.netAReverser > 0 ? 'var(--amber)' : 'var(--green)' }}>
                        {formatMontant(row.netAReverser)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t font-bold" style={{ borderColor: 'var(--border2)', background: 'var(--bg3)' }}>
                    <td className="px-6 py-4">Total {trimestre}</td>
                    <td className="px-5 py-4 text-right font-mono text-xs" style={{ color: 'var(--text2)' }}>
                      {formatMontant(caHT)}
                    </td>
                    <td className="px-5 py-4 text-right font-mono" style={{ color: 'var(--blue)' }}>
                      {formatMontant(tvaCollectee)}
                    </td>
                    <td className="px-5 py-4 text-right font-mono" style={{ color: 'var(--green)' }}>
                      {formatMontant(tvaDeductible)}
                    </td>
                    <td className="px-5 py-4 text-right font-mono"
                      style={{ color: tvaAReverser > 0 ? 'var(--amber)' : 'var(--green)' }}>
                      {formatMontant(tvaAReverser)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ── Section impôts BF ── */}
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
            <div className="px-6 py-4 border-b"
              style={{ borderColor: 'var(--border)', background: 'rgba(212,175,55,0.04)' }}>
              <h3 className="font-semibold">Estimation impôts &amp; charges sociales — {trimestre} 2026</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>
                Obligations fiscales BF · valeurs indicatives
              </p>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {[
                {
                  label:  'IBICA — Impôt sur Bénéfices Industriels, Commerciaux &amp; Artisanaux',
                  detail: `27,5 % du résultat net · minimum 0,5 % du CA HT`,
                  value:  ibica,
                  color:  'var(--amber)',
                  info:   'Taux IBICA BF : 27,5 %. Minimum fiscal = 0,5 % CA HT (plancher 37 500 FCFA/trimestre).',
                },
                {
                  label:  'Patente — contribution économique territoriale',
                  detail: `Forfait annuel ${formatMontant(PATENTE_ANNUAL)} ÷ 4`,
                  value:  patente,
                  color:  'var(--blue)',
                  info:   "Taxe professionnelle annuelle. Varie selon le secteur d'activité et le CA.",
                },
                {
                  label:  'CNSS — cotisation patronale sécurité sociale',
                  detail: `16 % × ${formatMontant(SALAIRE_MENSUEL)}/mois × ${quarterData.length} mois`,
                  value:  cnss,
                  color:  'var(--red)',
                  info:   'Cotisation patronale CNSS : 16 % du salaire brut. Part salarié : 5,5 % (déjà retenu).',
                },
              ].map((imp, i) => (
                <div key={i} className="px-6 py-5 flex items-center justify-between">
                  <div className="flex-1 pr-6">
                    <p className="text-sm font-semibold" dangerouslySetInnerHTML={{ __html: imp.label }} />
                    <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>{imp.detail}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>💡 {imp.info}</p>
                  </div>
                  <p className="font-bold font-mono text-base flex-shrink-0" style={{ color: imp.color }}>
                    {formatMontant(imp.value)}
                  </p>
                </div>
              ))}
              <div className="px-6 py-4 flex items-center justify-between"
                style={{ background: 'var(--bg3)' }}>
                <span className="font-bold">Total obligations fiscales &amp; sociales — {trimestre}</span>
                <span className="font-bold font-mono text-lg" style={{ color: 'var(--amber)' }}>
                  {formatMontant(totalImp)}
                </span>
              </div>
            </div>
          </div>

          {/* Avertissement */}
          <div className="flex items-start gap-3 p-4 rounded-xl text-xs"
            style={{ background: 'rgba(75,85,99,0.08)', border: '1px solid var(--border)' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--text3)' }} />
            <p style={{ color: 'var(--text2)' }}>
              Ces estimations sont indicatives. Consultez votre expert-comptable ou l&apos;OGA
              pour vos déclarations officielles auprès de la DGI Burkina Faso.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
