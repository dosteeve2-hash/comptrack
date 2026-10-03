// Une seule source de vérité pour « Supabase est-il configuré sur ce déploiement ? ».
//
// lib/supabase/client.ts et lib/supabase/server.ts retombent sur une URL factice
// quand les variables d'environnement manquent, pour que `next build` passe sans
// secrets. Utile, mais à l'exécution cela rend deux situations indistinguables :
//   - personne n'est connecté
//   - ce déploiement n'a aucun Supabase derrière lui
// Les deux donnent un utilisateur nul. Le garde du tableau de bord doit les séparer,
// sinon il affiche « connectez-vous » sur un déploiement où se connecter est impossible.

export const URL_PLACEHOLDER = 'http://placeholder.supabase.co'
export const CLE_PLACEHOLDER = 'placeholder'

// `||` et non `??` : une variable définie mais vide est le moyen le plus courant de
// « désactiver » une variable dans un tableau de bord d'hébergeur. `??` la laisserait
// passer, et createBrowserClient('') lèverait une exception au premier rendu.
export function urlSupabase(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || URL_PLACEHOLDER
}

export function cleSupabase(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || CLE_PLACEHOLDER
}

export function supabaseConfigure(): boolean {
  return urlSupabase() !== URL_PLACEHOLDER && cleSupabase() !== CLE_PLACEHOLDER
}
