create table if not exists fournisseurs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  nom text not null,
  contact_nom text,
  email text,
  telephone text,
  ville text,
  pays text default 'Burkina Faso',
  categorie text not null check (categorie in ('intrants','equipements','services','transport','autre')),
  numero_ifu text,
  notes text,
  created_at timestamptz default now()
);
alter table fournisseurs enable row level security;
create policy "user_fournisseurs" on fournisseurs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
