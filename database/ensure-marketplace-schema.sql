-- Repair: remote has partial schema (e.g. enums/profiles exist, but marketplace tables do not)
-- Safe to run multiple times for the current known failure mode.
--
-- CLI (linked remote):
--   npx supabase db query --linked --agent=no -f database/ensure-marketplace-schema.sql

do $$
begin
  if not exists (select 1 from pg_type where typname = 'beat_genre') then
    create type beat_genre as enum ('hiphop', 'trap', 'rnb', 'drill');
  end if;

  if not exists (select 1 from pg_type where typname = 'beat_status') then
    create type beat_status as enum ('draft', 'published', 'sold_exclusive');
  end if;

  if not exists (select 1 from pg_type where typname = 'license_tier') then
    create type license_tier as enum ('basic', 'premium', 'trackout', 'exclusive');
  end if;

  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum ('pending', 'paid', 'failed', 'refunded');
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_method') then
    create type payment_method as enum ('promptpay', 'card', 'mock');
  end if;
end $$;

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.beats (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  bpm integer not null check (bpm between 40 and 240),
  key text not null,
  genre beat_genre not null,
  mood text[] not null default '{}',
  tags text[] not null default '{}',
  duration_sec integer not null default 0,
  preview_url text not null,
  wav_path text not null,
  stems_path text,
  waveform_data jsonb,
  status beat_status not null default 'draft',
  cover_url text,
  is_featured boolean not null default false,
  sale_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.beat_licenses (
  id uuid primary key default gen_random_uuid(),
  beat_id uuid not null references public.beats(id) on delete cascade,
  tier license_tier not null,
  price_thb integer not null check (price_thb >= 0),
  terms jsonb not null default '{}',
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  unique (beat_id, tier)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  customer_name text,
  total_thb integer not null check (total_thb >= 0),
  status order_status not null default 'pending',
  payment_method payment_method not null default 'mock',
  omise_charge_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  beat_id uuid references public.beats(id) on delete set null,
  license_id uuid references public.beat_licenses(id) on delete set null,
  beat_title text not null,
  beat_slug text not null,
  license_tier license_tier not null,
  license_terms jsonb not null,
  price_thb integer not null check (price_thb >= 0),
  license_pdf_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.download_tokens (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references public.order_items(id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  file_path text not null,
  expires_at timestamptz not null default (now() + interval '48 hours'),
  max_downloads integer not null default 5,
  download_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'newsletter',
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create table if not exists public.beat_plays (
  id uuid primary key default gen_random_uuid(),
  beat_id uuid not null references public.beats(id) on delete cascade,
  session_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists beats_status_published_at_idx on public.beats(status, published_at desc);
create index if not exists beats_genre_idx on public.beats(genre);
create index if not exists beats_mood_gin_idx on public.beats using gin(mood);
create index if not exists beats_tags_gin_idx on public.beats using gin(tags);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user_profile();

drop trigger if exists update_beats_updated_at on public.beats;
create trigger update_beats_updated_at
before update on public.beats
for each row execute function public.update_updated_at_column();

create or replace function public.generate_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null then
    new.order_number := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('public.order_number_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

create sequence if not exists public.order_number_seq;

drop trigger if exists set_order_number on public.orders;
create trigger set_order_number
before insert on public.orders
for each row execute function public.generate_order_number();

create or replace function public.increment_beat_sale_count(beat_id_input uuid)
returns void
language sql
security definer
as $$
  update public.beats
  set sale_count = sale_count + 1
  where id = beat_id_input;
$$;

create or replace view public.beats_for_browse as
select
  b.*,
  min(bl.price_thb) filter (where bl.is_available) as min_price_thb
from public.beats b
left join public.beat_licenses bl on bl.beat_id = b.id
where b.status = 'published'
group by b.id;

create or replace view public.beat_sales_summary as
select
  b.id,
  b.title,
  coalesce(sum(oi.price_thb), 0)::integer as total_revenue_thb,
  count(oi.id)::integer as total_sales
from public.beats b
left join public.order_items oi on oi.beat_id = b.id
left join public.orders o on o.id = oi.order_id and o.status = 'paid'
group by b.id, b.title;

insert into public.profiles (id, email, display_name)
select
  u.id,
  coalesce(u.email, ''),
  coalesce(u.raw_user_meta_data ->> 'display_name', '')
from auth.users u
where not exists (
  select 1
  from public.profiles p
  where p.id = u.id
)
on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.beats enable row level security;
alter table public.beat_licenses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.download_tokens enable row level security;
alter table public.email_subscribers enable row level security;
alter table public.beat_plays enable row level security;

drop policy if exists "Published beats are public" on public.beats;
create policy "Published beats are public" on public.beats
for select using (status = 'published');

drop policy if exists "Available licenses are public" on public.beat_licenses;
create policy "Available licenses are public" on public.beat_licenses
for select using (is_available = true);

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
for select using (auth.uid() = id);

drop policy if exists "Users can read own orders" on public.orders;
create policy "Users can read own orders" on public.orders
for select using (auth.uid() = user_id);

drop policy if exists "Users can read own order items" on public.order_items;
create policy "Users can read own order items" on public.order_items
for select using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
  )
);

drop policy if exists "Users can read own download tokens" on public.download_tokens;
create policy "Users can read own download tokens" on public.download_tokens
for select using (
  exists (
    select 1
    from public.order_items
    join public.orders on orders.id = order_items.order_id
    where order_items.id = download_tokens.order_item_id
      and orders.user_id = auth.uid()
  )
);

drop policy if exists "Newsletter public insert" on public.email_subscribers;
create policy "Newsletter public insert" on public.email_subscribers
for insert with check (true);

drop policy if exists "Beat plays public insert" on public.beat_plays;
create policy "Beat plays public insert" on public.beat_plays
for insert with check (true);
