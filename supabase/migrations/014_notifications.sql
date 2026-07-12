create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  titre text not null,
  message text not null,
  type text default 'info' check (type in ('info','succes','alerte','erreur')),
  categorie text default 'general' check (categorie in ('facture','depense','objectif','client','fournisseur','general')),
  lue boolean default false,
  lien text,
  created_at timestamptz default now()
);
alter table public.notifications enable row level security;
create policy "notifs_user" on public.notifications for all using (auth.uid() = user_id);
