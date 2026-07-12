'use client';

import { useEffect, useState } from 'react';
import { Check, Palette } from 'lucide-react';
import {
  getPrefs, savePrefs, type UserPrefs,
  CURRENCIES, ACCENT_PRESETS,
} from '@/lib/prefs';

const COUNTRIES = [
  'Burkina Faso', 'Mali', 'Sénégal', "Côte d'Ivoire", 'Niger', 'Togo', 'Bénin',
  'Guinée', 'Cameroun', 'Gabon', 'Congo', 'Tchad', 'RCA', 'Maroc', 'Nigeria', 'Ghana', 'Autre',
];

export default function PersonnalisationCard() {
  const [prefs, setPrefs] = useState<UserPrefs | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPrefs(getPrefs());
  }, []);

  if (!prefs) return null;

  const update = (patch: Partial<UserPrefs>) => {
    setPrefs({ ...prefs, ...patch });
    setSaved(false);
  };

  const handleSave = () => {
    savePrefs(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4" style={{ color: 'var(--gold)' }} />
        <h2 className="text-white font-semibold">Personnalisation</h2>
      </div>
      <p className="text-white/50 text-xs -mt-3">
        Ces réglages sont enregistrés uniquement sur cet appareil — vos préférences restent privées.
      </p>

      {/* Nom de l'entreprise */}
      <div className="space-y-1.5">
        <label className="text-white text-sm">Nom de votre entreprise</label>
        <input
          type="text"
          value={prefs.companyName}
          onChange={(e) => update({ companyName: e.target.value })}
          placeholder="Ex. Boulangerie Wend-Kuni"
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:border-white/30 focus:outline-none transition"
        />
      </div>

      {/* Couleur d'accent */}
      <div className="space-y-2">
        <label className="text-white text-sm">Couleur principale</label>
        <div className="flex flex-wrap gap-2">
          {ACCENT_PRESETS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => update({ accentColor: c.value })}
              title={c.name}
              className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition"
              style={{
                background: c.value,
                borderColor: prefs.accentColor === c.value ? '#fff' : 'transparent',
              }}
            >
              {prefs.accentColor === c.value && <Check className="w-4 h-4 text-white" />}
            </button>
          ))}
          <input
            type="color"
            value={prefs.accentColor}
            onChange={(e) => update({ accentColor: e.target.value })}
            title="Couleur personnalisée"
            className="w-9 h-9 rounded-full cursor-pointer bg-transparent border border-white/20"
          />
        </div>
      </div>

      {/* Devise + pays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-white text-sm">Devise</label>
          <select
            value={prefs.currency}
            onChange={(e) => update({ currency: e.target.value as UserPrefs['currency'] })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-white/30 focus:outline-none transition [&>option]:bg-neutral-900"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-white text-sm">Pays</label>
          <select
            value={prefs.country}
            onChange={(e) => update({ country: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-white/30 focus:outline-none transition [&>option]:bg-neutral-900"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="px-4 py-2 rounded-lg text-sm font-semibold transition hover:brightness-110"
        style={{ background: 'var(--gold)', color: '#0b1220' }}
      >
        {saved ? 'Enregistré ✓' : 'Enregistrer'}
      </button>
    </div>
  );
}
