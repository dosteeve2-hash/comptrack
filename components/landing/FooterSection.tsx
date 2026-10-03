import Link from 'next/link'
import { DollarSign } from 'lucide-react'

const PRODUCT_LINKS = ['Fonctionnalités', 'Tarifs', 'Sécurité', 'Mises à jour']
const LEGAL_LINKS   = ["Conditions d'utilisation", 'Politique de confidentialité', 'Mentions légales', 'RGPD']

export function FooterSection() {
  return (
    <footer className="border-t py-12 px-6" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs font-mono"
              style={{ background: 'var(--gold)', color: 'var(--navy)' }}>CT</div>
            <span className="font-bold">CompTrack</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>
            La comptabilité simple pour les PME africaines. Conforme OHADA.
          </p>
        </div>

        {/* Produit */}
        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--gold)' }}>Produit</p>
          {PRODUCT_LINKS.map((item) => (
            <p key={item} className="text-sm mb-2">
              <Link href="#" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text2)' }}>{item}</Link>
            </p>
          ))}
        </div>

        {/* Légal */}
        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--gold)' }}>Légal</p>
          {LEGAL_LINKS.map((item) => (
            <p key={item} className="text-sm mb-2">
              <Link href="#" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text2)' }}>{item}</Link>
            </p>
          ))}
        </div>

        {/* Contact */}
        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--gold)' }}>Contact</p>
          <p className="text-sm mb-2" style={{ color: 'var(--text2)' }}>contact@forgeafrika.com</p>
          <p className="text-sm mb-2" style={{ color: 'var(--text2)' }}>+226 XX XX XX XX</p>
          <div className="flex items-center gap-2 mt-3">
            <DollarSign className="w-4 h-4" style={{ color: 'var(--cyan)' }} />
            <span className="text-xs" style={{ color: 'var(--text2)' }}>FCFA · EUR · USD · XOF</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-2"
        style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs" style={{ color: 'var(--text3)' }}>© 2026 CompTrack — Un produit FORGE Afrika</p>
        <p className="text-xs font-mono" style={{ color: 'var(--text3)' }}>Fait avec ❤️ depuis Ouagadougou</p>
      </div>
    </footer>
  )
}
