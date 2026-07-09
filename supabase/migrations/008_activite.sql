create table if not exists activite (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  type text not null check (type in ('revenu','depense','objectif','export')),
  description text not null,
  montant numeric,
  created_at timestamptz default now()
);
alter table activite enable row level security;
create policy "user_activite" on activite for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
