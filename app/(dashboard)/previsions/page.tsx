import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PrevisionsClient from './PrevisionsClient'

const MOCK_DATA = {
  previsions: [
    { mois: 'Jan', revenus: 2800000, depenses: 1900000, benefice: 900000 },
    { mois: 'Fév', revenus: 3200000, depenses: 2100000, benefice: 1100000 },
    { mois: 'Mar', revenus: 2900000, depenses: 1800000, benefice: 1100000 },
    { mois: 'Avr', revenus: 3500000, depenses: 2300000, benefice: 1200000 },
    { mois: 'Mai', revenus: 3800000, depenses: 2400000, benefice: 1400000 },
    { mois: 'Jun', revenus: 4100000, depenses: 2600000, benefice: 1500000 },
    { mois: 'Jul', revenus: 4400000, depenses: 2700000, benefice: 1700000 },
    { mois: 'Aoû', revenus: 4200000, depenses: 2500000, benefice: 1700000 },
    { mois: 'Sep', revenus: 4600000, depenses: 2800000, benefice: 1800000 },
    { mois: 'Oct', revenus: 5000000, depenses: 3000000, benefice: 2000000 },
    { mois: 'Nov', revenus: 5400000, depenses: 3200000, benefice: 2200000 },
    { mois: 'Déc', revenus: 6000000, depenses: 3500000, benefice: 2500000 },
  ],
  stats: { croissance: '+18%', margeNette: '38%', objectif: '72%' },
}

export default async function PrevisionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <PrevisionsClient data={MOCK_DATA} />
}
