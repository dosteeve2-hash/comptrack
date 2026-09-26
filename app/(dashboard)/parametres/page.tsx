import PersonnalisationCard from './PersonnalisationCard'

export default function ParametresPage() {
  return (
    <div className="p-6 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        <p className="text-white/60 mt-1">Gérez votre entreprise et vos préférences</p>
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
    </div>
  )
}
