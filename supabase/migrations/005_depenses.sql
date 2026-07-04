CREATE TABLE IF NOT EXISTS depenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  libelle TEXT NOT NULL,
  montant DECIMAL(15, 2) NOT NULL DEFAULT 0,
  categorie TEXT NOT NULL, -- ex: "Salaires", "Loyer", "Fournitures", "Services", "Autres"
  date_depense DATE NOT NULL DEFAULT CURRENT_DATE,
  fournisseur_id UUID REFERENCES fournisseurs(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE depenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users only" ON depenses
  FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS depenses_date_idx ON depenses(date_depense DESC);
CREATE INDEX IF NOT EXISTS depenses_categorie_idx ON depenses(categorie);
