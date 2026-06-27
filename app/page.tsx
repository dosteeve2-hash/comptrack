import Link from "next/link";
import {
  TrendingUp,
  FileText,
  BarChart3,
  Users,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Navbar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          background: "rgba(13,17,23,0.85)",
          backdropFilter: "blur(12px)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono"
              style={{ background: "var(--green)", color: "#000" }}
            >
              CT
            </div>
            <span className="font-semibold text-lg tracking-tight">CompTrack</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {["Fonctionnalités", "Tarifs", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm hover:opacity-80 transition-opacity"
                style={{ color: "var(--text2)" }}
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/connexion"
              className="px-4 py-2 text-sm rounded-lg transition-colors hover:opacity-80"
              style={{ color: "var(--text2)" }}
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="px-4 py-2 text-sm rounded-lg font-semibold transition-all hover:brightness-110"
              style={{ background: "var(--green)", color: "#000" }}
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-8"
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.25)",
              color: "var(--green)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--green)" }}
            />
            FORGE Afrika — La comptabilité africaine réinventée
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Gérez vos finances.
            <br />
            <span style={{ color: "var(--green)" }}>Focalisez sur votre</span>
            <br />
            croissance.
          </h1>

          <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text2)" }}>
            CompTrack remplace les cahiers et les Excel complexes. Suivi des revenus, dépenses,
            factures et rapports — en français, pour les réalités africaines.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-black transition-all hover:brightness-110"
              style={{ background: "var(--green)" }}
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium transition-all hover:opacity-80"
              style={{ border: "1px solid var(--border2)", color: "var(--text)" }}
            >
              Voir la démo live
            </Link>
          </div>
        </div>

        {/* Mock Dashboard Preview */}
        <div
          className="max-w-5xl mx-auto mt-16 rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--border2)", background: "var(--bg2)" }}
        >
          {/* Window chrome */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-b"
            style={{ borderColor: "var(--border)", background: "var(--bg3)" }}
          >
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full" style={{ background: "var(--amber)" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "var(--green)" }} />
            <div
              className="flex-1 mx-4 h-6 rounded px-3 flex items-center text-xs font-mono"
              style={{ background: "var(--bg)", color: "var(--text2)" }}
            >
              comptrack.app/dashboard
            </div>
          </div>

          {/* KPIs mockup */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Solde total", value: "4 250 000", change: "+12%", up: true },
                { label: "Revenus juin", value: "1 395 000", change: "+21%", up: true },
                { label: "Dépenses juin", value: "693 000", change: "+14%", up: false },
                { label: "Bénéfice net", value: "702 000", change: "+30%", up: true },
              ].map((kpi, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4"
                  style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}
                >
                  <p className="text-xs mb-2" style={{ color: "var(--text2)" }}>
                    {kpi.label}
                  </p>
                  <p className="text-lg font-bold font-mono">{kpi.value}</p>
                  <p className="text-xs font-mono mb-1" style={{ color: "var(--text2)" }}>FCFA</p>
                  <span
                    className="text-xs font-mono font-semibold"
                    style={{ color: kpi.up ? "var(--green)" : "var(--red)" }}
                  >
                    {kpi.change}
                  </span>
                </div>
              ))}
            </div>

            {/* Fake bar chart */}
            <div
              className="rounded-xl p-4 flex items-end gap-2 overflow-hidden"
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                height: "160px",
              }}
            >
              {[
                { h: 60, d: 40 },
                { h: 66, d: 45 },
                { h: 75, d: 48 },
                { h: 70, d: 53 },
                { h: 82, d: 56 },
                { h: 100, d: 64 },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col gap-1 items-center justify-end h-full">
                  <div
                    className="w-full rounded-t-sm"
                    style={{ height: `${bar.h}%`, background: "var(--green)", opacity: 0.7 }}
                  />
                  <div
                    className="w-full rounded-t-sm"
                    style={{
                      height: `${bar.d}%`,
                      background: "var(--red)",
                      opacity: 0.5,
                      marginTop: "-100%",
                      position: "relative",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fonctionnalités" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tout ce dont votre business a besoin
            </h2>
            <p className="text-lg" style={{ color: "var(--text2)" }}>
              Conçu pour les réalités des entreprises africaines
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Transactions en 1 clic",
                desc: "Enregistrez revenus et dépenses en quelques secondes. Catégories personnalisables adaptées à votre secteur d'activité.",
                color: "var(--green)",
              },
              {
                icon: BarChart3,
                title: "Rapports automatiques",
                desc: "Visualisez vos performances mensuelles, trimestrielles et annuelles avec des graphiques clairs et exportables.",
                color: "var(--blue)",
              },
              {
                icon: FileText,
                title: "Factures professionnelles",
                desc: "Créez des factures PDF en 30 secondes. Suivez les paiements et identifiez les retards en un coup d'œil.",
                color: "var(--amber)",
              },
              {
                icon: Users,
                title: "Carnet clients",
                desc: "Conservez l'historique complet de vos clients et fournisseurs. Accès rapide à toutes les transactions associées.",
                color: "var(--green)",
              },
              {
                icon: Shield,
                title: "Sécurisé & offline-first",
                desc: "Vos données sont sauvegardées localement et synchronisées dans le cloud. Fonctionne même sans connexion internet.",
                color: "var(--blue)",
              },
              {
                icon: TrendingUp,
                title: "Tableau de bord intelligent",
                desc: "Vue d'ensemble de votre santé financière en temps réel avec indicateurs clés et analyse de tendance.",
                color: "var(--amber)",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1"
                style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${feat.color}18` }}
                >
                  <feat.icon className="w-5 h-5" style={{ color: feat.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        className="py-20 px-6 border-t border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "500+", label: "Entreprises actives" },
            { value: "2M+", label: "Transactions traitées" },
            { value: "8", label: "Pays africains" },
            { value: "99.9%", label: "Disponibilité" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-4xl font-bold font-mono mb-2" style={{ color: "var(--green)" }}>
                {stat.value}
              </p>
              <p className="text-sm" style={{ color: "var(--text2)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Checklist + Testimonial */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Pourquoi CompTrack ?</h2>
            <div className="space-y-4">
              {[
                "100% en français, adapté aux réalités africaines",
                "Montants en FCFA, XOF, GHS, NGN et plus",
                "Aucune formation comptable requise",
                "Import depuis Excel et CSV supporté",
                "Gratuit pour commencer, sans carte bancaire",
                "Données hébergées en Afrique (conformité locale)",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--green)" }} />
                  <span style={{ color: "var(--text2)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex-1 rounded-2xl p-8"
            style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-mono mb-4" style={{ color: "var(--green)" }}>
              ★★★★★ TÉMOIGNAGE
            </p>
            <blockquote className="text-lg font-medium mb-6 leading-relaxed italic">
              &ldquo;Avant CompTrack, je gérais mes 200+ transactions mensuelles dans un cahier.
              Maintenant mes rapports mensuels sont prêts en 1 clic.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                style={{ background: "var(--green)", color: "#000" }}
              >
                FK
              </div>
              <div>
                <p className="font-semibold text-sm">Fatoumata Koné</p>
                <p className="text-xs" style={{ color: "var(--text2)" }}>
                  Commerçante textile, Abidjan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6">
        <div
          className="max-w-2xl mx-auto text-center rounded-2xl p-12"
          style={{
            background: "linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(59,130,246,0.08) 100%)",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à reprendre le contrôle ?
          </h2>
          <p className="mb-8 text-lg" style={{ color: "var(--text2)" }}>
            Rejoignez 500+ entrepreneurs africains qui font confiance à CompTrack.
          </p>
          <Link
            href="/inscription"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-black text-lg transition-all hover:brightness-110"
            style={{ background: "var(--green)" }}
          >
            Commencer gratuitement
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-xs" style={{ color: "var(--text3)" }}>
            Gratuit · Sans carte bancaire · Annulable à tout moment
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-6" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono"
              style={{ background: "var(--green)", color: "#000" }}
            >
              CT
            </div>
            <span className="font-semibold">CompTrack</span>
          </div>
          <p className="text-sm" style={{ color: "var(--text2)" }}>
            © 2026 CompTrack — Fait avec ❤️ depuis Ouagadougou &amp; Istanbul
          </p>
          <p className="text-xs font-mono" style={{ color: "var(--text3)" }}>
            Un produit FORGE Afrika
          </p>
        </div>
      </footer>
    </div>
  );
}
