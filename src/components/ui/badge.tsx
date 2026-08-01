export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const toneStyles: Record<BadgeTone, string> = {
  neutral: "bg-slate-800/90 text-slate-200 border border-white/10",
  success: "bg-emerald-500/15 text-emerald-300 border border-emerald-300/20",
  warning: "bg-amber-500/15 text-amber-300 border border-amber-300/20",
  danger: "bg-rose-500/15 text-rose-300 border border-rose-300/20",
  info: "bg-cyan-500/15 text-cyan-300 border border-cyan-300/20",
};

function inferTone(label: string): BadgeTone {
  const normalized = label.toLowerCase();
  if (normalized.includes("ok") || normalized.includes("paid") || normalized.includes("approved") || normalized.includes("vip") || normalized.includes("ready")) {
    return "success";
  }
  if (normalized.includes("late") || normalized.includes("danger") || normalized.includes("missing") || normalized.includes("needs")) {
    return "danger";
  }
  if (normalized.includes("pending") || normalized.includes("watch") || normalized.includes("planned") || normalized.includes("risk")) {
    return "warning";
  }
  if (normalized.includes("sent") || normalized.includes("scheduled") || normalized.includes("active")) {
    return "info";
  }
  return "neutral";
}

export function Badge({
  label,
  tone,
  outlined = false,
}: {
  label: string;
  tone?: BadgeTone;
  outlined?: boolean;
}) {
  const resolvedTone = tone ?? inferTone(label);
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] transition ${
        outlined ? "bg-transparent" : toneStyles[resolvedTone]
      } ${outlined ? toneStyles[resolvedTone] : ""}`}
    >
      {label}
    </span>
  );
}
