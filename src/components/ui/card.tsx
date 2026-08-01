import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[28px] border border-white/10 bg-slate-950/65 p-5 shadow-[0_26px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}
