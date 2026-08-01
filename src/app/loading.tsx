export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080a0d] px-6 text-zinc-100">
      <section className="surface-card max-w-md p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl border border-cyan-300/25 bg-cyan-300/10">
          <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_28px_rgba(103,232,249,0.9)]" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-white">Chargement CompTrack</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Preparation du cockpit financier, des modules et des donnees operationnelles.
        </p>
      </section>
    </main>
  );
}
