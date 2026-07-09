create table if not exists depenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  libelle text not null,
  categorie text not null check (categorie in ('intrants','main_oeuvre','transport','equipement','certification','frais_admin','autre')),
  montant numeric not null,
  fournisseur_nom text,
  date_depense date not null,
  justificatif_url text,
  notes text,
  created_at timestamptz default now()
);
alter table depenses enable row level security;
create policy "user_depenses" on depenses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
