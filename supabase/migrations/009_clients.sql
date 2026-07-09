create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  nom text not null,
  email text,
  telephone text,
  ville text,
  secteur text,
  notes text,
  created_at timestamptz default now()
);
alter table clients enable row level security;
create policy "user_clients" on clients for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
