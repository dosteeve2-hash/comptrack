import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

import { decisionAcces } from '@/lib/garde-acces'
import { cleSupabase, supabaseConfigure, urlSupabase } from '@/lib/supabase/config'

// ---------------------------------------------------------------------------
// 1. Limitation de débit — inchangée, mais désormais bornée à /api explicitement.
// Le matcher de ce fichier couvre maintenant tout le site pour le garde d'accès ;
// sans ce test de chemin, chaque chargement de page consommerait des jetons et le
// tableau de bord tomberait en 429 au bout de quelques clics.
// ---------------------------------------------------------------------------
const rateMap = new Map<string, { count: number; reset: number }>()
const LIMIT = 60
const WINDOW = 60_000

function tropDeRequetes(req: NextRequest): boolean {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  const now = Date.now()
  const entry = rateMap.get(ip) ?? { count: 0, reset: now + WINDOW }
  if (now > entry.reset) {
    entry.count = 0
    entry.reset = now + WINDOW
  }
  entry.count++
  rateMap.set(ip, entry)
  return entry.count > LIMIT
}

// ---------------------------------------------------------------------------
// 2. Garde d'accès.
// ---------------------------------------------------------------------------
export async function middleware(req: NextRequest) {
  const chemin = req.nextUrl.pathname

  // Les routes /api ne passent pas par le garde : renvoyer une page HTML de connexion
  // à un appel JSON ne rendrait service à personne. Il n'en existe aucune aujourd'hui ;
  // celle qui sera ajoutée devra valider l'utilisateur elle-même, côté serveur.
  if (chemin.startsWith('/api/')) {
    if (tropDeRequetes(req)) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: { 'Retry-After': '60' },
      })
    }
    return NextResponse.next()
  }

  // Cette réponse porte les cookies rafraîchis par Supabase. Il faut la construire
  // avant l'appel à getUser() et la renvoyer telle quelle : en fabriquer une autre
  // après coup perdrait la session rafraîchie et déconnecterait l'utilisateur au
  // bout d'une heure, silencieusement.
  let reponse = NextResponse.next({ request: req })

  let connecte = false
  const configure = supabaseConfigure()

  if (configure) {
    const supabase = createServerClient(urlSupabase(), cleSupabase(), {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          reponse = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) =>
            reponse.cookies.set(name, value, options)
          )
        },
      },
    })

    // getUser() et jamais getSession() : getSession() se contente de lire le cookie,
    // qu'un client peut fabriquer. getUser() le fait vérifier par Supabase.
    // Si Supabase est injoignable, l'appel lève : on reste déconnecté, donc fermé.
    try {
      const { data } = await supabase.auth.getUser()
      connecte = data.user !== null
    } catch {
      connecte = false
    }
  }

  const decision = decisionAcces({ chemin, connecte, configure })
  if (decision.action === 'rediriger') {
    const redirection = NextResponse.redirect(new URL(decision.vers, req.url))
    // getUser() a pu rafraîchir le jeton juste avant : sans ce report, la redirection
    // repartirait avec l'ancien cookie et le rafraîchissement serait à refaire à chaque
    // navigation. Invisible, mais c'est une requête de plus sur un réseau où elles coûtent.
    reponse.cookies.getAll().forEach((c) => redirection.cookies.set(c))
    return redirection
  }

  return reponse
}

export const config = {
  matcher: [
    // Tout, sauf les fichiers servis tels quels : les exclure ici évite un appel
    // réseau à Supabase pour chaque image du tableau de bord.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest|txt|xml)$).*)',
  ],
}
