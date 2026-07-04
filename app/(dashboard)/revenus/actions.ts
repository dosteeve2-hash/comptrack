'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export interface RevenuFormData {
  libelle: string
  montant: string
  categorie: string
  date_revenu: string
  notes: string
}

export interface ActionResult {
  success: boolean
  error?: string
}

export async function createRevenuAction(data: RevenuFormData): Promise<ActionResult> {
  if (!data.libelle.trim()) {
    return { success: false, error: 'Le libellé est obligatoire.' }
  }
  if (!data.montant || isNaN(parseFloat(data.montant)) || parseFloat(data.montant) < 0) {
    return { success: false, error: 'Le montant doit être un nombre positif.' }
  }
  if (!data.categorie.trim()) {
    return { success: false, error: 'La catégorie est obligatoire.' }
  }
  if (!data.date_revenu) {
    return { success: false, error: 'La date est obligatoire.' }
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Non authentifié.' }

    const { error } = await supabase.from('revenus').insert({
      libelle:     data.libelle.trim(),
      montant:     parseFloat(data.montant),
      categorie:   data.categorie.trim(),
      date_revenu: data.date_revenu,
      notes:       data.notes.trim() || null,
    })

    if (error) return { success: false, error: error.message }

    await new Promise(resolve => setTimeout(resolve, 300))
    revalidatePath('/revenus')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur de connexion à la base de données.' }
  }
}

export async function updateRevenuAction(
  id: string,
  data: RevenuFormData,
): Promise<ActionResult> {
  if (!data.libelle.trim()) {
    return { success: false, error: 'Le libellé est obligatoire.' }
  }
  if (!data.montant || isNaN(parseFloat(data.montant)) || parseFloat(data.montant) < 0) {
    return { success: false, error: 'Le montant doit être un nombre positif.' }
  }
  if (!data.categorie.trim()) {
    return { success: false, error: 'La catégorie est obligatoire.' }
  }
  if (!data.date_revenu) {
    return { success: false, error: 'La date est obligatoire.' }
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Non authentifié.' }

    const { error } = await supabase
      .from('revenus')
      .update({
        libelle:     data.libelle.trim(),
        montant:     parseFloat(data.montant),
        categorie:   data.categorie.trim(),
        date_revenu: data.date_revenu,
        notes:       data.notes.trim() || null,
      })
      .eq('id', id)

    if (error) return { success: false, error: error.message }

    await new Promise(resolve => setTimeout(resolve, 300))
    revalidatePath('/revenus')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur de connexion à la base de données.' }
  }
}
