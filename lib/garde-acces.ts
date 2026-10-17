// La décision du garde d'accès, isolée de Next.js pour être testable telle quelle.
//
// Le principe : TOUT est protégé sauf ce qui est explicitement public. L'inverse —
// lister les 21 pages du tableau de bord — serait plus court mais se dégraderait à
// chaque page ajoutée : une page oubliée dans la liste serait ouverte à tous, et
// personne ne s'en apercevrait. Ici une page oubliée est simplement protégée.

/** Chemins publics exacts. */
const PUBLICS_EXACTS = new Set(['/', '/tarifs', '/connexion', '/inscription'])

/** Préfixes publics : tout ce qui commence par là, séparateur compris. */
const PUBLICS_PREFIXES = ['/auth/']

/** Les deux pages où l'on se connecte : publiques, mais inutiles une fois connecté. */
const PAGES_AUTH = new Set(['/connexion', '/inscription'])

export const APRES_CONNEXION = '/dashboard'

export type Decision =
  | { action: 'laisser' }
  | { action: 'rediriger'; vers: string }

export function estPublic(chemin: string): boolean {
  const c = normaliser(chemin)
  return PUBLICS_EXACTS.has(c) || PUBLICS_PREFIXES.some((p) => c.startsWith(p))
}

export function estPageAuth(chemin: string): boolean {
  return PAGES_AUTH.has(normaliser(chemin))
}

/** '/dashboard/' et '/dashboard' sont la même page ; '/' reste '/'. */
function normaliser(chemin: string): string {
  if (chemin.length > 1 && chemin.endsWith('/')) return chemin.slice(0, -1)
  return chemin
}

/**
 * Là où l'on renvoie l'utilisateur après connexion. Seuls les chemins internes sont
 * acceptés : '//exemple.test' et 'https://exemple.test' sont des URL absolues pour un
 * navigateur ; les laisser passer ferait de la page de connexion une redirection ouverte.
 */
export function suiteSure(brut: string | null | undefined): string | null {
  if (!brut) return null
  if (!brut.startsWith('/') || brut.startsWith('//') || brut.startsWith('/\\')) return null
  return brut
}

export function decisionAcces(contexte: {
  chemin: string
  connecte: boolean
  configure: boolean
}): Decision {
  const { chemin, connecte, configure } = contexte

  // Supabase absent : personne ne peut se connecter, donc il n'y a aucun compte à protéger.
  // Le tableau de bord s'ouvre en mode démo : les données restent dans le navigateur de
  // la personne (localStorage), jamais sur un serveur, et l'interface le dit. Dès que
  // Supabase est configuré, cette branche disparaît et tout le reste est fermé.
  if (!configure) return { action: 'laisser' }

  if (connecte) {
    if (estPageAuth(chemin)) return { action: 'rediriger', vers: APRES_CONNEXION }
    return { action: 'laisser' }
  }

  if (estPublic(chemin)) return { action: 'laisser' }
  return { action: 'rediriger', vers: `/connexion?suite=${encodeURIComponent(chemin)}` }
}
