"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, ArrowLeftRight, BarChart3, Users, FileText,
  Settings, TrendingUp, TrendingDown, LogOut, Menu, X, Bell,
  GraduationCap, Target, ShoppingCart, Truck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number | null;
}

const navItems: NavItem[] = [
  { href: "/dashboard",      label: "Tableau de bord",  icon: LayoutDashboard },
  { href: "/transactions",   label: "Transactions",     icon: ArrowLeftRight  },
  { href: "/factures",       label: "Factures",         icon: FileText,       badge: 1 },
  { href: "/depenses",       label: "Dépenses",         icon: TrendingDown    },
  { href: "/revenus",        label: "Revenus",          icon: TrendingUp      },
  { href: "/clients",        label: "Clients",          icon: Users           },
  { href: "/fournisseurs",   label: "Fournisseurs",     icon: Truck           },
  { href: "/budgets",        label: "Budgets",          icon: ShoppingCart    },
  { href: "/objectifs",      label: "Objectifs",        icon: Target          },
  { href: "/rapports",       label: "Rapports",         icon: BarChart3       },
  { href: "/notifications",  label: "Notifications",    icon: Bell,           badge: 3 },
  { href: "/parametres",     label: "Paramètres",       icon: Settings        },
  { href: "/apprendre",      label: "Apprendre",        icon: GraduationCap   },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/connexion");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-4 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono flex-shrink-0"
            style={{ background: "var(--gold)", color: "var(--navy)" }}
          >
            CT
          </div>
          <div>
            <p className="font-bold text-sm leading-none">CompTrack</p>
            <p className="text-xs leading-none mt-0.5" style={{ color: "var(--text3)" }}>v2.0 · OHADA</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                background: isActive ? "rgba(212,175,55,0.12)" : "transparent",
                color: isActive ? "var(--gold)" : "var(--text2)",
                border: isActive ? "1px solid rgba(212,175,55,0.2)" : "1px solid transparent",
              }}
            >
              <item.icon className="flex-shrink-0" style={{ width: 17, height: 17 }} />
              {item.label}
              {item.badge != null && item.badge > 0 && (
                <span
                  className="ml-auto text-xs font-mono px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background: "var(--gold)", color: "var(--navy)" }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade banner */}
      <div className="px-3 py-3">
        <div
          className="p-3 rounded-xl"
          style={{
            background: "linear-gradient(135deg, rgba(212,175,55,0.1), rgba(0,188,212,0.08))",
            border: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <TrendingUp className="w-4 h-4" style={{ color: "var(--gold)" }} />
            <span className="text-xs font-semibold">Plan Gratuit</span>
          </div>
          <p className="text-xs mb-2" style={{ color: "var(--text2)" }}>
            Passez à PME pour rapports OHADA et transactions illimitées.
          </p>
          <Link
            href="/tarifs"
            className="block w-full py-1.5 rounded-lg text-xs font-semibold text-center transition-all hover:brightness-110"
            style={{ background: "var(--gold)", color: "var(--navy)" }}
          >
            Voir les plans
          </Link>
        </div>
      </div>

      {/* User + déconnexion */}
      <div
        className="px-4 py-4 border-t flex items-center gap-3"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
          style={{ background: "var(--cyan)", color: "var(--navy)" }}
        >
          U
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">Mon Compte</p>
          <p className="text-xs truncate" style={{ color: "var(--text3)" }}>CompTrack PME</p>
        </div>
        <button
          onClick={handleSignOut}
          className="p-1.5 rounded-lg transition-all hover:opacity-70"
          style={{ color: "var(--text2)" }}
          title="Déconnexion"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const currentLabel = navItems.find((n) => pathname.startsWith(n.href))?.label ?? "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>

      {/* Sidebar desktop */}
      <aside
        className="hidden md:flex flex-col w-60 flex-shrink-0 border-r"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="relative z-10 flex flex-col w-64 border-r"
            style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top header */}
        <header
          className="flex items-center gap-4 px-6 h-14 border-b flex-shrink-0"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <button
            className="md:hidden p-1.5 rounded-lg transition-all hover:opacity-70"
            style={{ color: "var(--text2)" }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h2 className="text-sm font-semibold">{currentLabel}</h2>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/notifications"
              className="relative p-2 rounded-lg transition-all hover:opacity-70"
              style={{ color: "var(--text2)" }}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span
                className="absolute top-1 right-1 min-w-[14px] h-3.5 flex items-center justify-center rounded-full text-[9px] font-bold px-1"
                style={{ background: "var(--gold)", color: "var(--navy)" }}
              >
                3
              </span>
            </Link>

            <button
              className="md:hidden p-1.5 rounded-lg"
              style={{ color: "var(--text2)" }}
              onClick={() => setSidebarOpen(false)}
            >
              {sidebarOpen && <X className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
