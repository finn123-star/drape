-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  created_at timestamptz not null default now(),
  base_photo_url text,
  archetypes text[] default '{}',
  detected_archetype text,
  subscription_tier text not null default 'free',
  stripe_customer_id text,
  daily_try_on_count int not null default 0,
  daily_count_reset_at timestamptz
);

-- Try-ons table
create table public.try_ons (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  source_url text,
  product_image_url text,
  product_meta jsonb,
  result_image_url text,
  verdict text,
  verdict_tags text[] default '{}',
  affiliate_url text,
  buy_clicked boolean not null default false,
  share_count int not null default 0
);

-- Friend verdicts table
create table public.friend_verdicts (
  id uuid primary key default uuid_generate_v4(),
  try_on_id uuid not null references public.try_ons(id) on delete cascade,
  reaction text not null check (reaction in ('fire', 'pass')),
  created_at timestamptz not null default now()
);

-- Shops table
create table public.shops (
  id text primary key,
  name text not null,
  affiliate_network text not null,
  base_url text not null,
  parser_version int not null default 1
);

-- Seed shops
insert into public.shops (id, name, affiliate_network, base_url, parser_version) values
  ('zalando', 'Zalando', 'awin', 'https://www.zalando.de', 1),
  ('aboutyou', 'About You', 'awin', 'https://www.aboutyou.de', 1),
  ('asos', 'ASOS', 'awin', 'https://www.asos.com', 1),
  ('asket', 'Asket', 'direct', 'https://www.asket.com', 1);

-- Row Level Security
alter table public.users enable row level security;
alter table public.try_ons enable row level security;
alter table public.friend_verdicts enable row level security;
alter table public.shops enable row level security;

-- RLS Policies: users
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- RLS Policies: try_ons
create policy "Users can view own try-ons"
  on public.try_ons for select
  using (auth.uid() = user_id);

create policy "Users can insert own try-ons"
  on public.try_ons for insert
  with check (auth.uid() = user_id);

create policy "Users can update own try-ons"
  on public.try_ons for update
  using (auth.uid() = user_id);

create policy "Users can delete own try-ons"
  on public.try_ons for delete
  using (auth.uid() = user_id);

-- RLS Policies: friend_verdicts (public read for sharing, insert for anyone with the link)
create policy "Anyone can insert friend verdicts"
  on public.friend_verdicts for insert
  with check (true);

create policy "Try-on owners can view verdicts"
  on public.friend_verdicts for select
  using (
    exists (
      select 1 from public.try_ons
      where try_ons.id = friend_verdicts.try_on_id
      and try_ons.user_id = auth.uid()
    )
  );

-- RLS Policies: shops (public read)
create policy "Anyone can read shops"
  on public.shops for select
  using (true);

-- Function to auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Index for common queries
create index try_ons_user_id_idx on public.try_ons(user_id);
create index try_ons_created_at_idx on public.try_ons(created_at desc);
