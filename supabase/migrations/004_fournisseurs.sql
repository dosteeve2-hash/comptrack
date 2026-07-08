CREATE TABLE IF NOT EXISTS fournisseurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  email TEXT,
  telephone TEXT,
  adresse TEXT,
  ville TEXT,
  pays TEXT DEFAULT 'Burkina Faso',
  categorie TEXT, -- ex: "Matières premières", "Services", "Équipements"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE fournisseurs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users only" ON fournisseurs
  FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS fournisseurs_nom_idx ON fournisseurs(nom);
CREATE INDEX IF NOT EXISTS fournisseurs_created_at_idx ON fournisseurs(created_at DESC);
