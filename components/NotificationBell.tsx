"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, CheckCircle, AlertTriangle, XCircle, Info, CheckCheck, X,
} from "lucide-react";
import { useNotifications } from "@/lib/store";
import type { Notification } from "@/lib/data";

// ─── 5 notifications mock réalistes PME africaine ────────────────────────────

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_001",
    titre: "Facture FAC-2024-045 en retard",
    message:
      "Cette facture est en retard de 12 jours. Client : Société Tan Naaba SARL. Montant : 850 000 FCFA.",
    type: "erreur",
    categorie: "facture",
    lue: false,
    lien: "/factures",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif_002",
    titre: "Budget Marketing à 94%",
    message:
      "Votre enveloppe Marketing est consommée à 94%. Restant : 24 000 FCFA sur 400 000 FCFA alloués.",
    type: "alerte",
    categorie: "depense",
    lue: false,
    lien: "/budget",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif_003",
    titre: "Objectif CA atteint à 87%",
    message:
      "Votre objectif mensuel est atteint à 87%. Il reste 130 000 FCFA pour atteindre la cible.",
    type: "info",
    categorie: "objectif",
    lue: false,
    lien: "/objectifs",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif_004",
    titre: "Nouveau client enregistré",
    message:
      "Société Zabrê Commerce a été ajoutée à votre base client. Premier contact : Ouagadougou.",
    type: "succes",
    categorie: "client",
    lue: true,
    lien: "/clients",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif_005",
    titre: "Fournisseur : mise à jour tarifaire",
    message:
      "Burkina Fournitures Pro a mis à jour ses grilles tarifaires. Vos prochaines commandes seront impactées.",
    type: "info",
    categorie: "fournisseur",
    lue: true,
    lien: "/fournisseurs",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function tempsRelatif(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min  = Math.floor(diff / 60_000);
  if (min < 1)  return "À l'instant";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24)  return `${h}h`;
  return `${Math.floor(h / 24)}j`;
}

const TYPE_CFG = {
  succes: { icon: CheckCircle,  color: "#22c55e", bg: "rgba(34,197,94,0.12)"   },
  alerte: { icon: AlertTriangle,color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
  erreur: { icon: XCircle,      color: "#ef4444", bg: "rgba(239,68,68,0.12)"   },
  info:   { icon: Info,         color: "#00BCD4", bg: "rgba(0,188,212,0.12)"   },
} as const;

// ─── Composant ────────────────────────────────────────────────────────────────

export default function NotificationBell() {
  const [notifications, setNotifications, loaded] = useNotifications();
  const [open, setOpen]   = useState(false);
  const [seeded, setSeeded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Seed données mock si localStorage vide
  useEffect(() => {
    if (loaded && !seeded) {
      setSeeded(true);
      if (notifications.length === 0) {
        setNotifications(MOCK_NOTIFICATIONS);
      }
    }
  }, [loaded, seeded, notifications.length, setNotifications]);

  // Fermer le dropdown sur clic extérieur
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  const nonLues = notifications.filter((n) => !n.lue).length;

  const marquerLue = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, lue: true } : n)));

  const toutLire = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, lue: true })));

  return (
    <div ref={containerRef} className="relative">

      {/* ── Bouton cloche ─────────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl transition-all hover:opacity-80"
        style={{ color: "var(--text2)", border: "1px solid var(--border)" }}
        aria-label={nonLues > 0 ? `${nonLues} notification(s) non lue(s)` : "Notifications"}
      >
        <Bell className="w-4 h-4" />
        {nonLues > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-bold px-1 leading-none"
            style={{ background: "var(--red)", color: "#fff" }}
          >
            {nonLues > 9 ? "9+" : nonLues}
          </span>
        )}
      </button>

      {/* ── Dropdown ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-[360px] rounded-2xl border shadow-2xl overflow-hidden z-50"
            style={{ background: "var(--bg2)", borderColor: "var(--border2)" }}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,   scale: 1    }}
            exit={{   opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" style={{ color: "var(--gold)" }} />
                <span className="text-sm font-semibold">Notifications</span>
                {nonLues > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: "var(--red)", color: "#fff" }}
                  >
                    {nonLues}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {nonLues > 0 && (
                  <button
                    onClick={toutLire}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg transition-all hover:opacity-70"
                    style={{ color: "var(--gold)" }}
                    title="Tout marquer comme lu"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Tout lire
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-lg transition-all hover:opacity-70"
                  style={{ color: "var(--text3)" }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Liste */}
            <div className="overflow-y-auto" style={{ maxHeight: 340 }}>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <CheckCircle className="w-8 h-8" style={{ color: "var(--text3)" }} />
                  <p className="text-sm" style={{ color: "var(--text3)" }}>
                    Aucune notification
                  </p>
                </div>
              ) : (
                notifications.map((notif, idx) => {
                  const cfg  = TYPE_CFG[notif.type];
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex items-start gap-3 px-4 py-3 border-b last:border-b-0 transition-colors hover:bg-white/[0.015]"
                      style={{
                        borderColor: "var(--border)",
                        background:    !notif.lue ? "rgba(212,175,55,0.04)" : "transparent",
                        borderLeft:    !notif.lue ? "3px solid rgba(212,175,55,0.4)" : "3px solid transparent",
                      }}
                    >
                      {/* Icône type */}
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: cfg.bg }}
                      >
                        <Icon style={{ width: 13, height: 13, color: cfg.color }} />
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p
                            className="text-xs font-semibold leading-snug"
                            style={{ color: "var(--text)" }}
                          >
                            {notif.titre}
                            {!notif.lue && (
                              <span
                                className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full align-middle"
                                style={{ background: "var(--gold)" }}
                              />
                            )}
                          </p>
                          <span
                            className="text-[10px] font-mono flex-shrink-0 mt-0.5"
                            style={{ color: "var(--text3)" }}
                          >
                            {tempsRelatif(notif.createdAt)}
                          </span>
                        </div>
                        <p
                          className="text-[11px] leading-relaxed line-clamp-2 mb-1"
                          style={{ color: "var(--text2)" }}
                        >
                          {notif.message}
                        </p>
                        {!notif.lue && (
                          <button
                            onClick={() => marquerLue(notif.id)}
                            className="text-[10px] font-medium transition-all hover:opacity-70"
                            style={{ color: "var(--gold)" }}
                          >
                            Marquer lue
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div
              className="px-4 py-2.5 text-center"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <a
                href="/notifications"
                className="text-xs font-medium transition-all hover:opacity-70"
                style={{ color: "var(--gold)" }}
                onClick={() => setOpen(false)}
              >
                Voir toutes les notifications →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
