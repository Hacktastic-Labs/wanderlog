create extension if not exists "uuid-ossp";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.visits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  latitude double precision not null,
  longitude double precision not null,
  place_name text not null,
  address text,
  category text not null,
  city text,
  state text,
  country text,
  arrived_at timestamptz not null,
  departed_at timestamptz not null,
  duration_minutes integer not null check (duration_minutes >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.location_points (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  latitude double precision not null,
  longitude double precision not null,
  recorded_at timestamptz not null
);

create index if not exists idx_visits_user_time on public.visits(user_id, arrived_at desc);
create index if not exists idx_visits_geo on public.visits(latitude, longitude);
create index if not exists idx_location_points_user_time on public.location_points(user_id, recorded_at desc);

alter table public.users enable row level security;
alter table public.visits enable row level security;
alter table public.location_points enable row level security;

drop policy if exists users_select_own on public.users;
create policy users_select_own on public.users
for select using (auth.uid() = id);

drop policy if exists users_insert_own on public.users;
create policy users_insert_own on public.users
for insert with check (auth.uid() = id);

drop policy if exists users_update_own on public.users;
create policy users_update_own on public.users
for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists visits_select_own on public.visits;
create policy visits_select_own on public.visits
for select using (auth.uid() = user_id);

drop policy if exists visits_insert_own on public.visits;
create policy visits_insert_own on public.visits
for insert with check (auth.uid() = user_id);

drop policy if exists visits_update_own on public.visits;
create policy visits_update_own on public.visits
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists visits_delete_own on public.visits;
create policy visits_delete_own on public.visits
for delete using (auth.uid() = user_id);

drop policy if exists points_select_own on public.location_points;
create policy points_select_own on public.location_points
for select using (auth.uid() = user_id);

drop policy if exists points_insert_own on public.location_points;
create policy points_insert_own on public.location_points
for insert with check (auth.uid() = user_id);

drop policy if exists points_delete_own on public.location_points;
create policy points_delete_own on public.location_points
for delete using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'name', 'Explorer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
