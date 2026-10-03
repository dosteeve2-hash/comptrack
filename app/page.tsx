import Link from "next/link";
import {
  TrendingUp, FileText, BarChart3, Shield, Zap,
  ArrowRight, CheckCircle2, Globe, DollarSign,
} from "lucide-react";
import CompTrackLogo from "@/components/CompTrackLogo";

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          background: "rgba(10,22,40,0.92)",
          backdropFilter: "blur(14px)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <CompTrackLogo size="sm" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Fonctionnalités", href: "#features" },
              { label: "Tarifs", href: "/tarifs" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm hover:opacity-80 transition-opacity"
                style={{ color: "var(--text2)" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm rounded-xl font-semibold transition-all hover:brightness-110"
              style={{ background: "var(--gold)", color: "var(--navy)" }}
            >
              Accéder au tableau de bord
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-8"
            style={{
              background: "rgba(212,175,55,0.1)",
              border: "1px solid rgba(212,175,55,0.3)",
              color: "var(--gold)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--gold)" }} />
            MVP — pilote recherché
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            La comptabilité simple
            <br />
            <span style={{ color: "var(--gold)" }}>pour les PME africaines</span>
          </h1>

          <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text2)" }}>
            CompTrack regroupe le suivi des factures, des dépenses et des rapports
            comptables — en français, pour les PME africaines.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:brightness-110"
              style={{ background: "var(--gold)", color: "var(--navy)" }}
            >
              Découvrir le MVP
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium transition-all hover:opacity-80"
              style={{ border: "1px solid var(--border2)", color: "var(--text)" }}
            >
              Voir la démo
            </Link>
          </div>
        </div>

        {/* Mock Dashboard Preview */}
        <div
          id="demo"
          className="max-w-5xl mx-auto mt-16 rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--border2)", background: "var(--bg2)" }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "var(--border)", background: "var(--bg3)" }}>
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full" style={{ background: "var(--amber)" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "var(--gold)" }} />
            <div className="flex-1 mx-4 h-6 rounded px-3 flex items-center text-xs font-mono" style={{ background: "var(--bg)", color: "var(--text2)" }}>
              comptrack.app/dashboard
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Devise", value: "FCFA", detail: "Comptabilité" },
                { label: "Factures", value: "PDF", detail: "Export" },
                { label: "Rapports", value: "OHADA", detail: "Format" },
                { label: "Produit", value: "MVP", detail: "Pilote recherché" },
              ].map((kpi, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}>
                  <p className="text-xs mb-2" style={{ color: "var(--text2)" }}>{kpi.label}</p>
                  <p className="text-lg font-bold font-mono">{kpi.value}</p>
                  <p className="text-xs font-mono mb-1" style={{ color: "var(--text2)" }}>{kpi.detail}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4 flex items-end gap-2" style={{ background: "var(--bg3)", border: "1px solid var(--border)", height: "120px" }}>
              {[60, 60, 60, 60, 60, 60].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 5 ? "var(--gold)" : "var(--cyan)", opacity: i === 5 ? 1 : 0.6 }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {[
            { value: "FCFA", label: "Monnaie" },
            { value: "Français", label: "Langue" },
            { value: "MVP", label: "Pilote recherché" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-4xl font-bold font-mono mb-2" style={{ color: "var(--gold)" }}>
                {stat.value}
              </p>
              <p className="text-sm" style={{ color: "var(--text2)" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fonctionnalités du MVP</h2>
            <p className="text-lg" style={{ color: "var(--text2)" }}>Conçu pour les réalités des entreprises africaines</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: BarChart3,  title: "Tableau de bord", desc: "Consultez les indicateurs et graphiques de suivi financier.", color: "var(--gold)" },
              { icon: FileText,   title: "Factures", desc: "Créez des factures et suivez les paiements.", color: "var(--cyan)" },
              { icon: TrendingUp, title: "Suivi des dépenses", desc: "Catégorisez et consultez les dépenses enregistrées.", color: "var(--gold)" },
              { icon: Zap,        title: "Objectifs financiers", desc: "Définissez des objectifs et suivez leur progression.", color: "var(--cyan)" },
              { icon: Shield,     title: "Rapports OHADA", desc: "Consultez et exportez les rapports au format OHADA.", color: "var(--gold)" },
              { icon: Globe,      title: "Devises", desc: "Suivez vos montants en FCFA, EUR et USD.", color: "var(--cyan)" },
            ].map((feat, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1"
                style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${feat.color}18` }}>
                  <feat.icon className="w-5 h-5" style={{ color: feat.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Preview ──────────────────────────────────────────────── */}
      <section id="tarifs" className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Offres CompTrack</h2>
          <p className="text-lg mb-12" style={{ color: "var(--text2)" }}>Tarifs affichés en FCFA par mois</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Solo",
                price: "0",
                desc: "Pour démarrer",
                features: ["Accès individuel", "50 transactions/mois", "Tableau de bord basique", "Export PDF limité"],
                cta: "Commencer gratuitement",
                highlighted: false,
              },
              {
                name: "PME",
                price: "15 000",
                desc: "Offre PME",
                features: ["Multi-utilisateurs", "Factures + Rapports OHADA", "Export Excel/PDF"],
                cta: "Découvrir le MVP",
                highlighted: true,
              },
              {
                name: "Entreprise",
                price: "45 000",
                desc: "Multi-entités",
                features: ["Multi-utilisateurs", "Multi-entreprises", "API accès", "Support prioritaire 4h", "Formation en ligne"],
                cta: "Contacter l'équipe",
                highlighted: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl relative"
                style={{
                  background: plan.highlighted ? "rgba(212,175,55,0.06)" : "var(--bg2)",
                  border: plan.highlighted ? "2px solid var(--gold)" : "1px solid var(--border)",
                }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "var(--gold)", color: "var(--navy)" }}>
                      Offre PME
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-xs mb-4" style={{ color: "var(--text2)" }}>{plan.desc}</p>
                <p className="text-3xl font-bold font-mono mb-1" style={{ color: plan.highlighted ? "var(--gold)" : "var(--text)" }}>
                  {plan.price}
                </p>
                <p className="text-xs mb-6" style={{ color: "var(--text2)" }}>FCFA / mois</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: plan.highlighted ? "var(--gold)" : "var(--cyan)" }} />
                      <span style={{ color: "var(--text2)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={i === 2 ? "mailto:docompaore2@gmail.com" : "/dashboard"}
                  className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                  style={plan.highlighted
                    ? { background: "var(--gold)", color: "var(--navy)" }
                    : { background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border2)" }
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/tarifs" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: "var(--cyan)" }}>
              Voir les tarifs détaillés avec FAQ →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Final ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "var(--bg2)" }}>
        <div
          className="max-w-2xl mx-auto text-center rounded-2xl p-12"
          style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(0,188,212,0.1) 100%)", border: "1px solid rgba(212,175,55,0.25)" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Conçu pour les PME africaines
          </h2>
          <p className="mb-8 text-lg" style={{ color: "var(--text2)" }}>
            CompTrack est un MVP — pilote recherché.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:brightness-110"
            style={{ background: "var(--gold)", color: "var(--navy)" }}
          >
            Découvrir le MVP
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-xs" style={{ color: "var(--text3)" }}>
            MVP — pilote recherché
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t py-12 px-6" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs font-mono" style={{ background: "var(--gold)", color: "var(--navy)" }}>CT</div>
              <span className="font-bold">CompTrack</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text2)" }}>
              La comptabilité simple pour les PME africaines. Rapports OHADA.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--gold)" }}>Produit</p>
            {["Fonctionnalités", "Tarifs", "Sécurité", "Mises à jour"].map((item) => (
              <p key={item} className="text-sm mb-2" style={{ color: "var(--text2)" }}>
                <Link href="#" className="hover:opacity-80 transition-opacity">{item}</Link>
              </p>
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--gold)" }}>Légal</p>
            {["Conditions d'utilisation", "Politique de confidentialité", "Mentions légales", "RGPD"].map((item) => (
              <p key={item} className="text-sm mb-2" style={{ color: "var(--text2)" }}>
                <Link href="#" className="hover:opacity-80 transition-opacity">{item}</Link>
              </p>
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--gold)" }}>Contact</p>
            <p className="text-sm mb-2" style={{ color: "var(--text2)" }}>docompaore2@gmail.com</p>
            <p className="text-sm mb-2" style={{ color: "var(--text2)" }}>+90 501 295 841</p>
            <div className="flex items-center gap-2 mt-3">
              <DollarSign className="w-4 h-4" style={{ color: "var(--cyan)" }} />
              <span className="text-xs" style={{ color: "var(--text2)" }}>FCFA · EUR · USD · XOF</span>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-2" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text3)" }}>
            © 2026 CompTrack — Un produit FORGE Afrika
          </p>
          <p className="text-xs font-mono" style={{ color: "var(--text3)" }}>
            Fait avec ❤️ depuis Ouagadougou
          </p>
        </div>
      </footer>
    </div>
  );
}
