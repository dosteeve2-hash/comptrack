create table if not exists public.objectifs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  titre text not null,
  description text,
  categorie text default 'revenu' check (categorie in ('revenu','epargne','investissement','remboursement','autre')),
  montant_cible numeric(15,2) not null,
  montant_actuel numeric(15,2) default 0,
  date_echeance date,
  statut text default 'en_cours' check (statut in ('en_cours','atteint','abandonne')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.objectifs enable row level security;
create policy "objectifs_user" on public.objectifs for all using (auth.uid() = user_id);
