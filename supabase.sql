-- BOUNDARY public research notebook: Supabase setup
-- Run once in the Supabase SQL Editor. Never put a service_role key in config.js.
-- Visitors may read published material and submit pending suggestions.
-- Only an administrator with dashboard / SQL Editor rights can approve or publish.

create extension if not exists pgcrypto;

create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  author text not null default 'Anonymous' check (char_length(author) between 1 and 60),
  title text not null check (char_length(title) between 8 and 120),
  body text not null check (char_length(body) between 40 and 6000),
  category text not null check (category in ('counterexample','proof','reference','experiment','question')),
  reference_url text check (reference_url is null or (char_length(reference_url) <= 500 and reference_url ~ '^https://')),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  published_at timestamptz
);

alter table public.suggestions enable row level security;

-- Start from known policy names for repeatable setup.
drop policy if exists "Public reads approved suggestions" on public.suggestions;
create policy "Public reads approved suggestions" on public.suggestions
  for select to anon, authenticated using (status = 'approved');

drop policy if exists "Visitors submit pending suggestions" on public.suggestions;
create policy "Visitors submit pending suggestions" on public.suggestions
  for insert to anon, authenticated with check (status = 'pending' and published_at is null);

-- A public visitor is NEVER allowed to update, delete, or approve a suggestion.
-- Administrator actions use the Supabase SQL Editor or protected dashboard.

create table if not exists public.research_updates (
  id text primary key check (char_length(id) between 4 and 120),
  date date not null default current_date,
  tag text not null check (char_length(tag) <= 40),
  category text not null check (category in ('open','barrier','conditional','milestone')),
  title text not null check (char_length(title) between 8 and 180),
  plain text not null,
  technical text not null,
  outcome text not null,
  detail text not null,
  track text not null check (track in ('proof-complexity','prime-modulus','pairing-slices','verification')),
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now()
);

alter table public.research_updates enable row level security;

drop policy if exists "Public reads published updates" on public.research_updates;
create policy "Public reads published updates" on public.research_updates
  for select to anon, authenticated using (status = 'published');

-- Grant table operations only as appropriate. RLS is still enforced.
grant select, insert on public.suggestions to anon, authenticated;
grant select on public.research_updates to anon, authenticated;
revoke update, delete on public.suggestions from anon, authenticated;
revoke insert, update, delete on public.research_updates from anon, authenticated;

create or replace function public.boundary_set_publication_time()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.status = 'approved' and old.status is distinct from 'approved' then
    new.published_at = coalesce(new.published_at, now());
  end if;
  return new;
end;
$$;

drop trigger if exists boundary_suggestion_approved on public.suggestions;
create trigger boundary_suggestion_approved
  before update on public.suggestions for each row
  execute function public.boundary_set_publication_time();

-- EXAMPLE: Approve a suggestion in Supabase SQL Editor ONLY after reviewing it:
-- update public.suggestions set status = 'approved' where id = 'UUID-FROM-DASHBOARD';

-- EXAMPLE: Add a new public research update in Supabase SQL Editor:
-- insert into public.research_updates
-- (id, date, tag, category, title, plain, technical, outcome, detail, track, status)
-- values
-- ('update-08', '2026-11-23', 'OPEN QUESTION', 'open',
--  'A precise description of the latest test',
--  'Plain-English summary without overstating the result.',
--  'Exact technical claims, assumptions, and notation.',
--  'Still unresolved', 'What the test does NOT establish.',
--  'pairing-slices', 'published');

-- Reviewed discussion threads for each published community suggestion.
-- Note: adding this table is an additive migration; it does not reset existing ideas.
create table if not exists public.suggestion_replies (
  id uuid primary key default gen_random_uuid(),
  suggestion_id uuid not null references public.suggestions(id) on delete cascade,
  author text not null default 'Anonymous' check (char_length(author) between 1 and 60),
  body text not null check (char_length(body) between 20 and 3000),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  published_at timestamptz
);
create index if not exists boundary_replies_by_suggestion on public.suggestion_replies(suggestion_id, published_at);
alter table public.suggestion_replies enable row level security;
drop policy if exists "Public reads approved replies to approved ideas" on public.suggestion_replies;
create policy "Public reads approved replies to approved ideas" on public.suggestion_replies
 for select to anon, authenticated using (
  status='approved' and exists (select 1 from public.suggestions s where s.id=suggestion_id and s.status='approved')
 );
drop policy if exists "Visitors submit pending replies to approved ideas" on public.suggestion_replies;
create policy "Visitors submit pending replies to approved ideas" on public.suggestion_replies
 for insert to anon, authenticated with check (
  status='pending' and published_at is null and
  exists (select 1 from public.suggestions s where s.id=suggestion_id and s.status='approved')
 );
grant select, insert on public.suggestion_replies to anon, authenticated;
revoke update, delete on public.suggestion_replies from anon, authenticated;
create or replace function public.boundary_set_reply_publication_time()
returns trigger language plpgsql set search_path=public as $$
begin
 if new.status='approved' and old.status is distinct from 'approved' then
   new.published_at=coalesce(new.published_at,now());
 end if;
 return new;
end;
$$;
drop trigger if exists boundary_reply_approved on public.suggestion_replies;
create trigger boundary_reply_approved before update on public.suggestion_replies
 for each row execute function public.boundary_set_reply_publication_time();
-- Approve a reply manually after reviewing it:
-- update public.suggestion_replies set status='approved' where id='REPLY-UUID';

-- Append-only PUBLIC RAW RESEARCH SESSIONS. Created by trusted GitHub Actions/API
-- secrets, never by an anonymous website visitor. These are FULL VISIBLE inputs
-- and outputs, NOT private model chain-of-thought or unrelated ChatGPT histories.
create table if not exists public.research_sessions (
  id uuid primary key default gen_random_uuid(),
  run_key text not null unique check (char_length(run_key) between 8 and 120),
  source text not null check (char_length(source) between 3 and 80),
  model text not null check (char_length(model) between 1 and 120),
  title text not null check (char_length(title) between 5 and 180),
  prompt text not null,
  response text not null,
  summary text not null,
  outcome text not null check (outcome in ('unverified', 'failed')),
  verification text not null default 'unverified' check (verification = 'unverified'),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists boundary_sessions_newest on public.research_sessions (created_at desc);
alter table public.research_sessions enable row level security;
drop policy if exists "Everyone reads complete public research sessions" on public.research_sessions;
create policy "Everyone reads complete public research sessions" on public.research_sessions
  for select to anon, authenticated using (true);
grant select on public.research_sessions to anon, authenticated;
revoke insert, update, delete on public.research_sessions from anon, authenticated;
-- Publish with the protected Supabase Secret Key from GitHub Actions.
-- Never place that key in config.js, client JavaScript, or a public repository.