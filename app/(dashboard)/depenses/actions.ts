'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export interface DepenseFormData {
  libelle: string
  montant: string
  categorie: string
  date_depense: string
  notes: string
}

export interface ActionResult {
  success: boolean
  error?: string
}

export async function createDepenseAction(data: DepenseFormData): Promise<ActionResult> {
  if (!data.libelle.trim()) {
    return { success: false, error: 'Le libellé est obligatoire.' }
  }
  if (!data.montant || isNaN(parseFloat(data.montant)) || parseFloat(data.montant) < 0) {
    return { success: false, error: 'Le montant doit être un nombre positif.' }
  }
  if (!data.categorie.trim()) {
    return { success: false, error: 'La catégorie est obligatoire.' }
  }
  if (!data.date_depense) {
    return { success: false, error: 'La date est obligatoire.' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('depenses').insert({
      libelle:      data.libelle.trim(),
      montant:      parseFloat(data.montant),
      categorie:    data.categorie.trim(),
      date_depense: data.date_depense,
      notes:        data.notes.trim() || null,
    })

    if (error) return { success: false, error: error.message }

    revalidatePath('/depenses')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur de connexion à la base de données.' }
  }
}

export async function updateDepenseAction(
  id: string,
  data: DepenseFormData,
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
  if (!data.date_depense) {
    return { success: false, error: 'La date est obligatoire.' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('depenses')
      .update({
        libelle:      data.libelle.trim(),
        montant:      parseFloat(data.montant),
        categorie:    data.categorie.trim(),
        date_depense: data.date_depense,
        notes:        data.notes.trim() || null,
      })
      .eq('id', id)

    if (error) return { success: false, error: error.message }

    revalidatePath('/depenses')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur de connexion à la base de données.' }
  }
}
