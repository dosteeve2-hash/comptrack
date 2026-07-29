import Link from "next/link";
import {
  TrendingUp, FileText, BarChart3, Users, Shield, Zap,
  ArrowRight, CheckCircle2, Globe, DollarSign, Star,
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
              { label: "Témoignages", href: "#temoignages" },
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
            FORGE Afrika — 100% OHADA conforme
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            La comptabilité simple
            <br />
            <span style={{ color: "var(--gold)" }}>pour les PME africaines</span>
          </h1>

          <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text2)" }}>
            CompTrack remplace les cahiers et les Excel complexes. Factures, dépenses,
            rapports OHADA — en français, pour les réalités africaines.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:brightness-110"
              style={{ background: "var(--gold)", color: "var(--navy)" }}
            >
              Essayer gratuitement
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
                { label: "Solde total", value: "4 250 000", change: "+12%", up: true },
                { label: "Revenus juin", value: "1 395 000", change: "+21%", up: true },
                { label: "Dépenses juin", value: "693 000", change: "+14%", up: false },
                { label: "Bénéfice net", value: "702 000", change: "+30%", up: true },
              ].map((kpi, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}>
                  <p className="text-xs mb-2" style={{ color: "var(--text2)" }}>{kpi.label}</p>
                  <p className="text-lg font-bold font-mono">{kpi.value}</p>
                  <p className="text-xs font-mono mb-1" style={{ color: "var(--text2)" }}>FCFA</p>
                  <span className="text-xs font-mono font-semibold" style={{ color: kpi.up ? "var(--green)" : "var(--red)" }}>
                    {kpi.change}
                  </span>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4 flex items-end gap-2" style={{ background: "var(--bg3)", border: "1px solid var(--border)", height: "120px" }}>
              {[55, 62, 71, 68, 80, 100].map((h, i) => (
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
            { value: "500+", label: "PME actives" },
            { value: "+40%", label: "de temps économisé" },
            { value: "100%", label: "OHADA conforme" },
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tout ce dont votre PME a besoin</h2>
            <p className="text-lg" style={{ color: "var(--text2)" }}>Conçu pour les réalités des entreprises africaines</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: BarChart3,  title: "Tableau de bord temps réel", desc: "Vue d'ensemble de votre santé financière avec KPIs, graphiques interactifs et alertes intelligentes.", color: "var(--gold)" },
              { icon: FileText,   title: "Factures automatiques",       desc: "Créez des factures PDF professionnelles en 30 secondes. Suivi des paiements et relances automatiques.", color: "var(--cyan)" },
              { icon: TrendingUp, title: "Suivi des dépenses",          desc: "Catégorisez et analysez chaque dépense. Identifiez les fuites financières et optimisez vos coûts.", color: "var(--gold)" },
              { icon: Zap,        title: "Objectifs financiers",        desc: "Fixez des objectifs mensuels et annuels. Suivez votre progression et ajustez votre stratégie en temps réel.", color: "var(--cyan)" },
              { icon: Shield,     title: "Rapports OHADA",              desc: "Génération automatique des états financiers conformes aux normes OHADA. Exportables en PDF et Excel.", color: "var(--gold)" },
              { icon: Globe,      title: "Multi-devises FCFA/EUR/USD",  desc: "Gérez vos finances en FCFA, EUR, USD, XOF et plus. Conversion automatique aux taux du marché.", color: "var(--cyan)" },
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

      {/* ── Témoignages ──────────────────────────────────────────────────── */}
      <section id="temoignages" className="py-24 px-6" style={{ background: "var(--bg2)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce que disent nos clients</h2>
            <p className="text-lg" style={{ color: "var(--text2)" }}>500+ PME africaines font confiance à CompTrack</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Avant CompTrack, je gérais mes 200+ transactions dans un cahier. Maintenant mes rapports OHADA sont prêts en 1 clic. C'est révolutionnaire pour mon cabinet.",
                name: "Fatoumata Koné",
                role: "Expert-comptable",
                city: "Abidjan, Côte d'Ivoire",
                initials: "FK",
                stars: 5,
              },
              {
                quote: "Grâce à CompTrack, j'ai enfin une vision claire de ma trésorerie. J'ai économisé 15 000 FCFA par mois en identifiant des dépenses inutiles. Le ROI est immédiat.",
                name: "Moussa Traoré",
                role: "Gérant, Traoré BTP",
                city: "Ouagadougou, Burkina Faso",
                initials: "MT",
                stars: 5,
              },
              {
                quote: "La fonctionnalité de facturation en FCFA est parfaite. Mes clients reçoivent des factures professionnelles et les retards de paiement ont diminué de 60%.",
                name: "Aminata Diallo",
                role: "Directrice, Fashion Dakar",
                city: "Dakar, Sénégal",
                initials: "AD",
                stars: 5,
              },
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-2xl" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" style={{ color: "var(--gold)" }} />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed mb-6 italic" style={{ color: "var(--text2)" }}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0" style={{ background: "var(--gold)", color: "var(--navy)" }}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs" style={{ color: "var(--text2)" }}>{t.role} · {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Preview ──────────────────────────────────────────────── */}
      <section id="tarifs" className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Des tarifs adaptés à votre croissance</h2>
          <p className="text-lg mb-12" style={{ color: "var(--text2)" }}>Commencez gratuitement, évoluez sans contrainte</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Solo",
                price: "0",
                desc: "Pour démarrer",
                features: ["1 utilisateur", "50 transactions/mois", "Tableau de bord basique", "Export PDF limité"],
                cta: "Commencer gratuitement",
                highlighted: false,
              },
              {
                name: "PME",
                price: "15 000",
                desc: "Le plus populaire",
                features: ["5 utilisateurs", "Transactions illimitées", "Factures + Rapports OHADA", "Export Excel/PDF", "Support email 48h"],
                cta: "Essayer 30 jours gratuit",
                highlighted: true,
              },
              {
                name: "Entreprise",
                price: "45 000",
                desc: "Multi-entités",
                features: ["Utilisateurs illimités", "Multi-entreprises", "API accès", "Support prioritaire 4h", "Formation en ligne"],
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
                      ⭐ Populaire
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
            Rejoignez 500 PME qui font confiance à CompTrack
          </h2>
          <p className="mb-8 text-lg" style={{ color: "var(--text2)" }}>
            Démarrez gratuitement. Aucune carte bancaire requise.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:brightness-110"
            style={{ background: "var(--gold)", color: "var(--navy)" }}
          >
            Commencer gratuitement
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-xs" style={{ color: "var(--text3)" }}>
            Gratuit 30 jours · Sans carte bancaire · Annulable à tout moment
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
              La comptabilité simple pour les PME africaines. Conforme OHADA.
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
