CREATE TABLE IF NOT EXISTS revenus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  libelle TEXT NOT NULL,
  montant DECIMAL(15, 2) NOT NULL DEFAULT 0,
  categorie TEXT NOT NULL,
  date_revenu DATE NOT NULL DEFAULT CURRENT_DATE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE revenus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users only" ON revenus
  FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS revenus_date_idx ON revenus(date_revenu DESC);
CREATE INDEX IF NOT EXISTS revenus_categorie_idx ON revenus(categorie);
