-- ==========================================
-- STEP 1: Create Database Schema
-- Run this FIRST in Supabase SQL Editor
-- ==========================================
-- URL: https://supabase.com/dashboard/project/sjmmvksyesuidgxkumbr/sql
-- ==========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. LOCATIONS TABLE
-- ==========================================
create table if not exists locations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  image text not null default '',
  description text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_locations_slug on locations(slug);

-- ==========================================
-- 2. AREAS TABLE
-- ==========================================
create table if not exists areas (
  id uuid primary key default uuid_generate_v4(),
  location_id uuid not null references locations(id) on delete cascade,
  name text not null,
  slug text not null,
  image text not null default '',
  description text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(location_id, slug)
);

create index if not exists idx_areas_location_id on areas(location_id);
create index if not exists idx_areas_slug on areas(slug);

-- ==========================================
-- 3. MODELS TABLE
-- ==========================================
create table if not exists models (
  id uuid primary key default uuid_generate_v4(),
  area_id uuid not null references areas(id) on delete cascade,
  name text not null,
  slug text not null,
  image text not null default '',
  images text[] default '{}',
  short_description text not null default '',
  description text not null default '',
  phone_number text not null default '',
  features text[] default '{}',
  specifications jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(area_id, slug)
);

create index if not exists idx_models_area_id on models(area_id);
create index if not exists idx_models_slug on models(slug);

-- ==========================================
-- 4. ENQUIRIES TABLE
-- ==========================================
create table if not exists enquiries (
  id uuid primary key default uuid_generate_v4(),
  model_id uuid not null references models(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  message text not null default '',
  created_at timestamptz default now()
);

create index if not exists idx_enquiries_model_id on enquiries(model_id);
create index if not exists idx_enquiries_created_at on enquiries(created_at desc);

-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ==========================================

alter table locations enable row level security;
alter table areas enable row level security;
alter table models enable row level security;
alter table enquiries enable row level security;

-- Public read access
create policy "Public read: locations" on locations for select using (true);
create policy "Public read: areas" on areas for select using (true);
create policy "Public read: models" on models for select using (true);

-- Authenticated users can manage data
create policy "Auth manage: locations" on locations for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth manage: areas" on areas for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth manage: models" on models for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Enquiries: anyone can submit, only auth can view
create policy "Anyone create: enquiries" on enquiries for insert with check (true);
create policy "Auth read: enquiries" on enquiries for select using (auth.role() = 'authenticated');

-- ==========================================
-- 6. AUTO-UPDATE TRIGGERS
-- ==========================================

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_locations_updated_at before update on locations for each row execute function update_updated_at_column();
create trigger update_areas_updated_at before update on areas for each row execute function update_updated_at_column();
create trigger update_models_updated_at before update on models for each row execute function update_updated_at_column();

-- ==========================================
-- ✅ Schema creation complete!
-- ==========================================
