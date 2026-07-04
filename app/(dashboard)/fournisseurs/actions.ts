'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export interface FournisseurFormData {
  nom: string
  email: string
  telephone: string
  adresse: string
  ville: string
  pays: string
  categorie: string
}

export interface ActionResult {
  success: boolean
  error?: string
}

export async function createFournisseurAction(data: FournisseurFormData): Promise<ActionResult> {
  if (!data.nom.trim()) {
    return { success: false, error: 'Le nom est obligatoire.' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('fournisseurs').insert({
      nom:       data.nom.trim(),
      email:     data.email.trim()     || null,
      telephone: data.telephone.trim() || null,
      adresse:   data.adresse.trim()   || null,
      ville:     data.ville.trim()     || null,
      pays:      data.pays.trim()      || 'Burkina Faso',
      categorie: data.categorie.trim() || null,
    })

    if (error) return { success: false, error: error.message }

    revalidatePath('/fournisseurs')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur de connexion à la base de données.' }
  }
}

export async function updateFournisseurAction(
  id: string,
  data: FournisseurFormData,
): Promise<ActionResult> {
  if (!data.nom.trim()) {
    return { success: false, error: 'Le nom est obligatoire.' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('fournisseurs')
      .update({
        nom:       data.nom.trim(),
        email:     data.email.trim()     || null,
        telephone: data.telephone.trim() || null,
        adresse:   data.adresse.trim()   || null,
        ville:     data.ville.trim()     || null,
        pays:      data.pays.trim()      || 'Burkina Faso',
        categorie: data.categorie.trim() || null,
      })
      .eq('id', id)

    if (error) return { success: false, error: error.message }

    revalidatePath('/fournisseurs')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur de connexion à la base de données.' }
  }
}
