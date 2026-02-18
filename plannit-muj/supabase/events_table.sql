-- Run this SQL in Supabase SQL editor to create the events table
create extension if not exists "pgcrypto";

create table if not exists public.events (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  description text not null,
  date timestamptz not null,
  start_time text not null,
  end_time text not null,
  venue_id text not null,
  category text not null,
  department text not null,
  tags text[] not null default '{}',
  max_capacity integer not null check (max_capacity > 0),
  registered_count integer not null default 0 check (registered_count >= 0),
  image text,
  is_approved boolean not null default true,
  organizer_id text not null,
  organizer_name text not null,
  organizer_email text not null,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

-- Basic permissive policies for development; tighten for production.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'events' and policyname = 'events_select_all'
  ) then
    create policy events_select_all on public.events for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'events' and policyname = 'events_insert_all'
  ) then
    create policy events_insert_all on public.events for insert with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'events' and policyname = 'events_update_all'
  ) then
    create policy events_update_all on public.events for update using (true) with check (true);
  end if;
end $$;
