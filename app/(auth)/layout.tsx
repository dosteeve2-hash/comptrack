import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      {/* Top bar */}
      <header className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono"
            style={{ background: "var(--green)", color: "#000" }}
          >
            CT
          </div>
          <span className="font-semibold">CompTrack</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs" style={{ color: "var(--text3)" }}>
        © 2026 CompTrack — Un produit FORGE Afrika
      </footer>
    </div>
  );
}
