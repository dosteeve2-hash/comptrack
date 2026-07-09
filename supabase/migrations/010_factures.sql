create table if not exists factures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  numero text not null,
  client_nom text not null,
  client_email text,
  montant_ht numeric not null,
  tva_percent numeric default 18,
  statut text not null check (statut in ('brouillon','envoyee','payee','en_retard','annulee')),
  date_emission date not null,
  date_echeance date,
  notes text,
  created_at timestamptz default now()
);
alter table factures enable row level security;
create policy "user_factures" on factures for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
