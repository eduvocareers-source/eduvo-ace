
-- Roles
create type public.app_role as enum ('admin', 'student');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users see own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid());
create policy "admins manage roles" on public.user_roles
  for all to authenticated using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "users read own profile" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "users update own profile" on public.profiles
  for update to authenticated using (id = auth.uid());
create policy "admins read all profiles" on public.profiles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Expo registrations
create table public.expo_registrations (
  id uuid primary key default gen_random_uuid(),
  ticket_id text not null unique,
  name text not null,
  phone text not null,
  email text,
  district text not null,
  course text not null,
  checked_in boolean not null default false,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.expo_registrations enable row level security;

-- Public can register (guest-friendly form)
create policy "anyone can register" on public.expo_registrations
  for insert to anon, authenticated with check (true);

-- Anyone can look up their own ticket by ticket_id (used by confirmation page)
create policy "lookup by ticket id" on public.expo_registrations
  for select to anon, authenticated using (true);

create policy "admins update registrations" on public.expo_registrations
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admins delete registrations" on public.expo_registrations
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create index expo_registrations_created_at_idx on public.expo_registrations (created_at desc);
create index expo_registrations_ticket_id_idx on public.expo_registrations (ticket_id);
