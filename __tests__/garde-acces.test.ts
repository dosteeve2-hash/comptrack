import { describe, it, expect } from 'vitest'

import { decisionAcces, estPublic, suiteSure, APRES_CONNEXION } from '@/lib/garde-acces'

const CONFIGURE = { configure: true }
const SANS_SUPABASE = { configure: false }

describe('estPublic', () => {
  it('ouvre la vitrine et les pages de connexion', () => {
    for (const c of ['/', '/tarifs', '/connexion', '/inscription', '/auth/callback'])
      expect(estPublic(c), c).toBe(true)
  })

  it('ferme tout le reste', () => {
    for (const c of ['/dashboard', '/paie', '/declarations', '/tresorerie', '/bilan'])
      expect(estPublic(c), c).toBe(false)
  })

  it("ne confond pas un préfixe public avec un chemin qui commence pareil", () => {
    // '/auth/' est public ; '/authentification-interne' ne doit pas l'être par accident.
    expect(estPublic('/authentification-interne')).toBe(false)
    expect(estPublic('/tarifs-internes')).toBe(false)
  })

  it('traite /dashboard/ comme /dashboard, et garde / public', () => {
    expect(estPublic('/dashboard/')).toBe(false)
    expect(estPublic('/tarifs/')).toBe(true)
    expect(estPublic('/')).toBe(true)
  })
})

describe('decisionAcces — Supabase configuré, personne connecté', () => {
  it('renvoie vers la connexion en gardant la page demandée', () => {
    expect(decisionAcces({ chemin: '/paie', connecte: false, ...CONFIGURE })).toEqual({
      action: 'rediriger',
      vers: '/connexion?suite=%2Fpaie',
    })
  })

  it('laisse passer la vitrine et les pages de connexion', () => {
    for (const chemin of ['/', '/tarifs', '/connexion', '/inscription', '/auth/callback'])
      expect(decisionAcces({ chemin, connecte: false, ...CONFIGURE }), chemin)
        .toEqual({ action: 'laisser' })
  })
})

describe('decisionAcces — Supabase configuré, utilisateur connecté', () => {
  it('ouvre le tableau de bord', () => {
    for (const chemin of ['/dashboard', '/paie', '/declarations'])
      expect(decisionAcces({ chemin, connecte: true, ...CONFIGURE }), chemin)
        .toEqual({ action: 'laisser' })
  })

  it("ne laisse pas se reconnecter quelqu'un de déjà connecté", () => {
    for (const chemin of ['/connexion', '/inscription'])
      expect(decisionAcces({ chemin, connecte: true, ...CONFIGURE }), chemin)
        .toEqual({ action: 'rediriger', vers: APRES_CONNEXION })
  })
})

describe('decisionAcces — Supabase absent du déploiement', () => {
  it('ferme quand même le tableau de bord, et dit pourquoi', () => {
    expect(decisionAcces({ chemin: '/dashboard', connecte: false, ...SANS_SUPABASE })).toEqual({
      action: 'rediriger',
      vers: '/connexion?raison=non-configure',
    })
  })

  it("laisse la page de connexion s'afficher pour porter le message", () => {
    expect(decisionAcces({ chemin: '/connexion', connecte: false, ...SANS_SUPABASE }))
      .toEqual({ action: 'laisser' })
  })

  it("ne rouvre rien même si un cookie prétend que quelqu'un est connecté", () => {
    // Sans Supabase, rien ne peut vérifier un cookie : « connecté » n'y veut rien dire.
    expect(decisionAcces({ chemin: '/paie', connecte: true, ...SANS_SUPABASE }))
      .toEqual({ action: 'rediriger', vers: '/connexion?raison=non-configure' })
  })
})

describe('une page ajoutee demain', () => {
  it("est protégée sans que personne ait pensé à l'inscrire quelque part", () => {
    // C'est la raison d'être de la liste blanche : l'oubli va vers le fermé.
    expect(decisionAcces({ chemin: '/nouvelle-page', connecte: false, ...CONFIGURE }))
      .toEqual({ action: 'rediriger', vers: '/connexion?suite=%2Fnouvelle-page' })
  })
})

describe('suiteSure', () => {
  it('accepte un chemin interne', () => {
    expect(suiteSure('/paie')).toBe('/paie')
    expect(suiteSure('/declarations/2026')).toBe('/declarations/2026')
  })

  it("refuse tout ce qu'un navigateur lirait comme une autre origine", () => {
    for (const brut of ['//exemple.test', 'https://exemple.test', '/\\exemple.test', 'exemple.test'])
      expect(suiteSure(brut), brut).toBeNull()
  })

  it('refuse le vide', () => {
    expect(suiteSure(null)).toBeNull()
    expect(suiteSure('')).toBeNull()
    expect(suiteSure(undefined)).toBeNull()
  })
})
