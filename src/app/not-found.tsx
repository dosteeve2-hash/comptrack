import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080a0d] px-6 text-zinc-100">
      <section className="surface-card max-w-lg p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Module introuvable</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Cette route n&apos;existe pas encore dans CompTrack. Retourne au cockpit pour
          continuer le pilotage financier.
        </p>
        <Link
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-cyan-300 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200"
          href="/"
        >
          Retour au cockpit
        </Link>
      </section>
    </main>
  );
}
