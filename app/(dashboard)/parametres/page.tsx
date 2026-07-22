import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PersonnalisationCard from './PersonnalisationCard'

export default async function ParametresPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  return (
    <div className="p-6 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        <p className="text-white/60 mt-1">Gérez votre compte et vos préférences</p>
      </div>

      {/* Infos compte */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Compte</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Email</span>
            <span className="text-white text-sm">{user.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Membre depuis</span>
            <span className="text-white text-sm">
              {new Date(user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Plan</span>
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">Gratuit</span>
          </div>
        </div>
      </div>

      {/* Personnalisation — stockée en local sur l'appareil */}
      <PersonnalisationCard />

      {/* Devise */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Préférences</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white text-sm">Devise</p>
            <p className="text-white/50 text-xs mt-0.5">Utilisée dans tous les calculs</p>
          </div>
          <span className="text-white/80 text-sm font-medium">FCFA (XOF)</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white text-sm">Langue</p>
            <p className="text-white/50 text-xs mt-0.5">Langue de l&apos;interface</p>
          </div>
          <span className="text-white/80 text-sm font-medium">Français</span>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 space-y-3">
        <h2 className="text-red-400 font-semibold">Zone de danger</h2>
        <p className="text-white/60 text-sm">Ces actions sont irréversibles.</p>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition text-sm"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  )
}
