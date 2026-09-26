"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  CheckCheck,
  Bell,
} from "lucide-react";
import type { Notification } from "@/lib/data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function tempsRelatif(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const heures = Math.floor(minutes / 60);
  if (heures < 24) return `Il y a ${heures}h`;
  const jours = Math.floor(heures / 24);
  return `Il y a ${jours}j`;
}

const TYPE_CONFIG = {
  succes: {
    icon: CheckCircle,
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
  },
  alerte: {
    icon: AlertTriangle,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
  },
  erreur: {
    icon: XCircle,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
  },
  info: {
    icon: Info,
    color: "#00BCD4",
    bg: "rgba(0,188,212,0.12)",
  },
} as const;

const CATEGORIE_LABELS: Record<Notification["categorie"], string> = {
  facture: "Facture",
  depense: "Dépense",
  objectif: "Objectif",
  client: "Client",
  fournisseur: "Fournisseur",
  general: "Général",
};

type Filtre = "toutes" | "non-lues" | "alertes";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  notifications: Notification[];
  setNotifications: (updater: Notification[] | ((prev: Notification[]) => Notification[])) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationsClient({ notifications, setNotifications }: Props) {
  const [filtre, setFiltre] = useState<Filtre>("toutes");

  const nonLues = notifications.filter((n) => !n.lue).length;

  // Filtrage
  const visible = notifications.filter((n) => {
    if (filtre === "non-lues") return !n.lue;
    if (filtre === "alertes") return n.type === "alerte" || n.type === "erreur";
    return true;
  });

  // Marquer une notif comme lue
  const marquerLue = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, lue: true } : n)));
  };

  // Tout marquer comme lu
  const toutMarquerLu = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, lue: true })));
  };

  const filtres: { key: Filtre; label: string; count?: number }[] = [
    { key: "toutes", label: "Toutes", count: notifications.length },
    { key: "non-lues", label: "Non lues", count: nonLues },
    { key: "alertes", label: "Alertes", count: notifications.filter((n) => n.type === "alerte" || n.type === "erreur").length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)" }}
          >
            <Bell className="w-5 h-5" style={{ color: "#D4AF37" }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Notifications</h1>
              {nonLues > 0 && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "#D4AF37", color: "#0A1628" }}
                >
                  {nonLues} non lues
                </span>
              )}
            </div>
            <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
              Activité et alertes de votre compte
            </p>
          </div>
        </div>

        {nonLues > 0 && (
          <button
            onClick={toutMarquerLu}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: "rgba(212,175,55,0.1)",
              border: "1px solid rgba(212,175,55,0.3)",
              color: "#D4AF37",
            }}
          >
            <CheckCheck className="w-4 h-4" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* ─── Pills filtre ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {filtres.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltre(f.key)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: filtre === f.key ? "#D4AF37" : "var(--bg2)",
              color: filtre === f.key ? "#0A1628" : "var(--text2)",
              border: filtre === f.key ? "1px solid #D4AF37" : "1px solid var(--border)",
            }}
          >
            {f.label}
            {f.count !== undefined && f.count > 0 && (
              <span
                className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: filtre === f.key ? "rgba(10,22,40,0.2)" : "var(--bg3)",
                  color: filtre === f.key ? "#0A1628" : "var(--text2)",
                }}
              >
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── Feed ────────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <AnimatePresence mode="popLayout">
          {visible.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
              className="flex flex-col items-center justify-center py-20 px-6 text-center"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ background: "rgba(212,175,55,0.1)", border: "2px solid rgba(212,175,55,0.3)" }}
              >
                <CheckCircle className="w-10 h-10" style={{ color: "#D4AF37" }} />
              </div>
              <h3 className="text-lg font-semibold mb-1">Tout est à jour !</h3>
              <p className="text-sm" style={{ color: "var(--text2)" }}>
                Aucune notification à afficher dans cette catégorie.
              </p>
            </motion.div>
          ) : (
            visible.map((notif, index) => {
              const cfg = TYPE_CONFIG[notif.type];
              const IconComponent = cfg.icon;
              return (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 28,
                    delay: index * 0.04,
                  }}
                  className="flex items-start gap-4 px-5 py-4 border-b transition-colors hover:bg-white/[0.02] last:border-b-0"
                  style={{
                    borderColor: "var(--border)",
                    background: !notif.lue ? "rgba(212,175,55,0.03)" : "transparent",
                    borderLeft: !notif.lue ? "3px solid rgba(212,175,55,0.4)" : "3px solid transparent",
                  }}
                >
                  {/* Icône type */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: cfg.bg }}
                  >
                    <IconComponent className="w-4.5 h-4.5" style={{ color: cfg.color, width: 18, height: 18 }} />
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-semibold ${!notif.lue ? "" : "opacity-80"}`}>
                          {notif.titre}
                        </p>
                        {!notif.lue && (
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: "#D4AF37" }}
                          />
                        )}
                      </div>
                      <span
                        className="text-xs flex-shrink-0 font-mono"
                        style={{ color: "var(--text3)" }}
                      >
                        {tempsRelatif(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm mb-2" style={{ color: "var(--text2)" }}>
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Badge catégorie */}
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background: "var(--bg3)",
                          color: "var(--text2)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {CATEGORIE_LABELS[notif.categorie]}
                      </span>

                      {/* Bouton marquer lue */}
                      {!notif.lue && (
                        <button
                          onClick={() => marquerLue(notif.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium transition-all hover:opacity-70"
                          style={{ color: "#D4AF37" }}
                        >
                          <CheckCircle className="w-3 h-3" />
                          Marquer lue
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
