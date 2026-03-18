-- Run this in your Supabase project → SQL Editor

-- Table to store per-user progress, saved opportunities, and preferences
create table if not exists public.user_progress (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  saved       text[]    default '{}',
  statuses    jsonb     default '{}',
  location    text      default '',
  first_gen_mode boolean default false,
  language    text      default 'en',
  updated_at  timestamptz default now()
);

-- Only the owner can read/write their own row
alter table public.user_progress enable row level security;

create policy "Users can read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can upsert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);
