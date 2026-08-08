// app/(dashboard)/layout.config.ts
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard, ArrowLeftRight, BarChart3, Users, FileText,
  Settings, TrendingUp, TrendingDown, Bell,
  GraduationCap, Target, ShoppingCart, Truck, Scale, Wallet,
  UserCheck, FileSignature, Banknote,
} from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  badge?: number | null
}

export const navItems: NavItem[] = [
  { href: '/dashboard',     label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/transactions',  label: 'Transactions',    icon: ArrowLeftRight  },
  { href: '/factures',      label: 'Factures',        icon: FileText,       badge: 1 },
  { href: '/depenses',      label: 'Dépenses',        icon: TrendingDown    },
  { href: '/revenus',       label: 'Revenus',         icon: TrendingUp      },
  { href: '/clients',       label: 'Clients',         icon: Users           },
  { href: '/employes',      label: 'Employés',        icon: UserCheck       },
  { href: '/contrats',      label: 'Contrats',        icon: FileSignature   },
  { href: '/paie',          label: 'Paie',            icon: Banknote        },
  { href: '/fournisseurs',  label: 'Fournisseurs',    icon: Truck           },
  { href: '/budgets',       label: 'Budgets',         icon: ShoppingCart    },
  { href: '/objectifs',     label: 'Objectifs',       icon: Target          },
  { href: '/previsions',    label: 'Prévisions',      icon: TrendingUp      },
  { href: '/rapports',      label: 'Rapports',        icon: BarChart3       },
  { href: '/bilan',         label: 'Bilan',           icon: Scale           },
  { href: '/tresorerie',    label: 'Trésorerie',      icon: Wallet          },
  { href: '/notifications', label: 'Notifications',   icon: Bell,           badge: 3 },
  { href: '/parametres',    label: 'Paramètres',      icon: Settings        },
  { href: '/apprendre',     label: 'Apprendre',       icon: GraduationCap   },
]

export const bottomNavItems: NavItem[] = [
  { href: '/dashboard',    label: 'Accueil',      icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight  },
  { href: '/factures',     label: 'Factures',     icon: FileText        },
  { href: '/rapports',     label: 'Rapports',     icon: BarChart3       },
]
