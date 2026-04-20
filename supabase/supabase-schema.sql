-- ==========================================
-- Joyful Hub Database Schema
-- Run this in Supabase SQL Editor
-- ==========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- LOCATIONS TABLE
-- ==========================================
create table locations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  image text not null default '',
  description text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for faster slug lookups
create index idx_locations_slug on locations(slug);

-- ==========================================
-- AREAS TABLE
-- ==========================================
create table areas (
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

-- Index for faster lookups
create index idx_areas_location_id on areas(location_id);
create index idx_areas_slug on areas(slug);

-- ==========================================
-- MODELS TABLE
-- ==========================================
create table models (
  id uuid primary key default uuid_generate_v4(),
  area_id uuid not null references areas(id) on delete cascade,
  name text not null,
  slug text not null,
  image text not null default '',
  images text[] default '{}',
  short_description text not null default '',
  description text not null default '',
  price text not null default '',
  features text[] default '{}',
  specifications jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(area_id, slug)
);

-- Index for faster lookups
create index idx_models_area_id on models(area_id);
create index idx_models_slug on models(slug);

-- ==========================================
-- ENQUIRIES TABLE
-- ==========================================
create table enquiries (
  id uuid primary key default uuid_generate_v4(),
  model_id uuid not null references models(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  message text not null default '',
  created_at timestamptz default now()
);

-- Index for faster lookups
create index idx_enquiries_model_id on enquiries(model_id);
create index idx_enquiries_created_at on enquiries(created_at desc);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
alter table locations enable row level security;
alter table areas enable row level security;
alter table models enable row level security;
alter table enquiries enable row level security;

-- Public can read all locations, areas, models
create policy "Public read access on locations"
  on locations for select
  using (true);

create policy "Public read access on areas"
  on areas for select
  using (true);

create policy "Public read access on models"
  on models for select
  using (true);

-- Only authenticated users (admin) can modify locations, areas, models
create policy "Authenticated users can manage locations"
  on locations for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage areas"
  on areas for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage models"
  on models for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Anyone can submit enquiries
create policy "Anyone can create enquiries"
  on enquiries for insert
  with check (true);

-- Only authenticated users can view enquiries
create policy "Authenticated users can view enquiries"
  on enquiries for select
  using (auth.role() = 'authenticated');

-- ==========================================
-- UPDATED_AT TRIGGER FUNCTION
-- ==========================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add triggers to update updated_at automatically
create trigger update_locations_updated_at
  before update on locations
  for each row
  execute function update_updated_at_column();

create trigger update_areas_updated_at
  before update on areas
  for each row
  execute function update_updated_at_column();

create trigger update_models_updated_at
  before update on models
  for each row
  execute function update_updated_at_column();
