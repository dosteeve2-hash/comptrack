"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Users,
  FileText,
  Settings,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Bell,
  GraduationCap,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/rapports", label: "Rapports", icon: BarChart3 },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/factures", label: "Factures", icon: FileText },
  { href: "/apprendre", label: "Apprendre", icon: GraduationCap },
  { href: "/parametres", label: "Paramètres", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono flex-shrink-0"
            style={{ background: "var(--green)", color: "#000" }}
          >
            CT
          </div>
          <div>
            <p className="font-bold text-sm leading-none">CompTrack</p>
            <p className="text-xs leading-none mt-0.5" style={{ color: "var(--text3)" }}>
              v1.0 MVP
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                background: isActive ? "rgba(34,197,94,0.12)" : "transparent",
                color: isActive ? "var(--green)" : "var(--text2)",
                border: isActive ? "1px solid rgba(34,197,94,0.2)" : "1px solid transparent",
              }}
            >
              <item.icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: 18, height: 18 }} />
              {item.label}
              {item.label === "Factures" && (
                <span
                  className="ml-auto text-xs font-mono px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(239,68,68,0.15)", color: "var(--red)" }}
                >
                  1
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
            background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(59,130,246,0.1))",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: "var(--green)" }} />
            <span className="text-xs font-semibold">Plan Gratuit</span>
          </div>
          <p className="text-xs mb-2" style={{ color: "var(--text2)" }}>
            Passez à Pro pour des rapports avancés et la synchronisation cloud.
          </p>
          <button
            className="w-full py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-110"
            style={{ background: "var(--green)", color: "#000" }}
          >
            Passer à Pro
          </button>
        </div>
      </div>

      {/* User */}
      <div
        className="px-4 py-4 border-t flex items-center gap-3"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
          style={{ background: "var(--blue)", color: "#fff" }}
        >
          SD
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">Steeve Donald</p>
          <p className="text-xs truncate" style={{ color: "var(--text3)" }}>
            Mon Commerce
          </p>
        </div>
        <Link
          href="/connexion"
          className="p-1.5 rounded-lg transition-all hover:opacity-70"
          style={{ color: "var(--text2)" }}
          title="Déconnexion"
        >
          <LogOut className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

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
            style={{ background: "rgba(0,0,0,0.6)" }}
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
            <h2 className="text-sm font-semibold">
              {navItems.find((n) => n.href === pathname)?.label ?? "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="relative p-2 rounded-lg transition-all hover:opacity-70"
              style={{ color: "var(--text2)" }}
            >
              <Bell className="w-4 h-4" />
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--red)" }}
              />
            </button>
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
