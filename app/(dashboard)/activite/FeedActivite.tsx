"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { TrendingUp, TrendingDown, Target, Download } from "lucide-react";

export interface ActiviteItem {
  id: string;
  type: "revenu" | "depense" | "objectif" | "export";
  description: string;
  montant?: number | null;
  created_at: string;
}

function formatMontantFCFA(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

function formatDateRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffH < 1) return "il y a quelques minutes";
  if (diffH < 24) return `il y a ${diffH}h`;
  if (diffD === 1) return "hier";
  if (diffD < 7) return `il y a ${diffD} jours`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

const typeConfig = {
  revenu: {
    icon: TrendingUp,
    color: "var(--green)",
    bg: "rgba(34,197,94,0.12)",
  },
  depense: {
    icon: TrendingDown,
    color: "var(--red)",
    bg: "rgba(239,68,68,0.12)",
  },
  objectif: {
    icon: Target,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.12)",
  },
  export: {
    icon: Download,
    color: "var(--blue)",
    bg: "rgba(59,130,246,0.12)",
  },
} as const;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

interface Props {
  activites: ActiviteItem[];
}

export default function FeedActivite({ activites }: Props) {
  if (activites.length === 0) {
    return (
      <div
        className="py-10 text-center text-sm rounded-2xl border"
        style={{ color: "var(--text3)", borderColor: "var(--border)", background: "var(--bg2)" }}
      >
        Aucune activité récente
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {activites.map((item) => {
          const cfg = typeConfig[item.type];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="flex items-center gap-4 px-5 py-3.5 rounded-xl border transition-colors hover:bg-white/[0.02]"
              style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: cfg.bg }}
              >
                <Icon className="w-4 h-4" style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.description}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text3)" }}>
                  {formatDateRelative(item.created_at)}
                </p>
              </div>
              {item.montant != null && (
                <p
                  className="text-sm font-bold font-mono flex-shrink-0"
                  style={{
                    color:
                      item.type === "revenu"
                        ? "var(--green)"
                        : item.type === "depense"
                        ? "var(--red)"
                        : "var(--text)",
                  }}
                >
                  {item.type === "revenu" ? "+" : item.type === "depense" ? "-" : ""}
                  {formatMontantFCFA(item.montant)}
                </p>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
