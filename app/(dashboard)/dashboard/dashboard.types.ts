// app/(dashboard)/dashboard/dashboard.types.ts
import type { LucideIcon } from 'lucide-react'

export interface EntrepriseConfig {
  nom: string
  secteur: string
  pays: string
  devise: string
  type: string
}

export const defaultConfig: EntrepriseConfig = {
  nom: '',
  secteur: '',
  pays: 'Burkina Faso',
  devise: 'FCFA',
  type: 'SARL',
}

export const SECTEURS = [
  'Commerce général', 'Textile / Mode', 'Restauration / Alimentation',
  'BTP / Construction', 'Services / Conseil', 'Tech / Numérique',
  'Agriculture / Élevage', 'Transport / Logistique', 'Santé / Pharma', 'Autre',
]

export const PAYS = [
  'Burkina Faso', "Côte d'Ivoire", 'Sénégal', 'Mali', 'Niger',
  'Guinée', 'Togo', 'Bénin', 'Cameroun', 'Ghana', 'Nigeria', 'Autre',
]

export const DEVISES = ['FCFA', 'EUR', 'USD', 'GHS', 'NGN', 'KES']
export const TYPES_ENTREPRISE = ['Auto-entrepreneur', 'SARL', 'SAS', 'SA', 'GIE', 'Autre']

export interface KPIItem {
  label: string
  value: number
  icon: LucideIcon
  color: string
  change: number | null
  up?: boolean
}
