create table if not exists objectifs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  titre text not null,
  type text not null check (type in ('revenus','depenses','profit')),
  montant_cible numeric not null,
  operateur text not null check (operateur in ('gte','lte')),
  mois text not null,
  created_at timestamptz default now()
);
alter table objectifs enable row level security;
create policy "user_objectifs" on objectifs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
