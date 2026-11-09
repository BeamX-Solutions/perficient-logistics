-- Events shown in the "What's on" section of the home page, managed by staff at /admin/events.
-- Run once in the Supabase SQL editor.
--
-- Setup after running this file:
--   1. Auth → Providers → Email: turn OFF "Allow new users to sign up", so only accounts you create exist.
--   2. Auth → Users → "Add user" → "Create new user": give each employee an email and password
--      (tick "Auto confirm user").
--   3. Copy the new user's UID and make them staff:
--        insert into public.staff (user_id) values ('<uuid>');
--   To remove someone's access: delete from public.staff where user_id = '<uuid>';

-- ── Staff ──

create table if not exists public.staff (
  user_id uuid primary key references auth.users on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.staff enable row level security;

-- Staff can check their own membership (the admin page does this after sign-in).
drop policy if exists "staff read own row" on public.staff;
create policy "staff read own row" on public.staff
  for select to authenticated
  using (user_id = auth.uid());

create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.staff where user_id = auth.uid());
$$;

-- ── Events ──

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  city text not null check (city in ('Abuja', 'Lagos')),
  title text not null,
  category text,
  description text,
  venue_name text not null,
  address text not null,
  lat double precision,
  lon double precision,
  starts_at timestamptz not null,
  ends_at timestamptz,
  image_path text,
  ticket_url text,
  published boolean not null default true,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_end_after_start check (ends_at is null or ends_at > starts_at)
);

create index if not exists events_published_starts_at_idx on public.events (published, starts_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

alter table public.events enable row level security;

-- Everyone sees published events that haven't finished; staff see everything.
drop policy if exists "read upcoming published events" on public.events;
create policy "read upcoming published events" on public.events
  for select to anon, authenticated
  using ((published and coalesce(ends_at, starts_at) > now()) or public.is_staff());

drop policy if exists "staff insert events" on public.events;
create policy "staff insert events" on public.events
  for insert to authenticated
  with check (public.is_staff());

drop policy if exists "staff update events" on public.events;
create policy "staff update events" on public.events
  for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "staff delete events" on public.events;
create policy "staff delete events" on public.events
  for delete to authenticated
  using (public.is_staff());

-- ── Event images ──

insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do update set public = true;

drop policy if exists "staff upload event images" on storage.objects;
create policy "staff upload event images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'event-images' and public.is_staff());

drop policy if exists "staff update event images" on storage.objects;
create policy "staff update event images" on storage.objects
  for update to authenticated
  using (bucket_id = 'event-images' and public.is_staff())
  with check (bucket_id = 'event-images' and public.is_staff());

drop policy if exists "staff delete event images" on storage.objects;
create policy "staff delete event images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'event-images' and public.is_staff());
