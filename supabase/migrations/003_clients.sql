-- CompTrack — Migration 003 : Table clients
-- Exécuter dans le SQL Editor Supabase ou via : supabase db push

CREATE TABLE IF NOT EXISTS public.clients (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  nom         text          NOT NULL,
  email       text,
  telephone   text,
  adresse     text,
  ville       text,
  pays        text          NOT NULL DEFAULT 'Burkina Faso',
  created_at  timestamptz   NOT NULL DEFAULT now()
);

-- Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Politique : les utilisateurs authentifiés peuvent tout faire
CREATE POLICY "clients_authenticated_all"
  ON public.clients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Index de performance
CREATE INDEX IF NOT EXISTS idx_clients_nom        ON public.clients (nom);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients (created_at DESC);
