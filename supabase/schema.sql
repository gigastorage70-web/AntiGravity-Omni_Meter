-- =====================================================================
-- ANTIGRAVITY OMNI-METER: PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Paste this script into Supabase Dashboard -> SQL Editor -> Run
-- =====================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users / Profiles Table
create table if not exists public.users (
  id text primary key,
  email text unique not null,
  name text not null,
  tier text not null check (tier in ('free', 'google_one_premium', 'workspace_enterprise', 'vertex_cloud')),
  role text not null check (role in ('user', 'admin')) default 'user',
  storage_limit_gb numeric not null default 15,
  storage_used_gb numeric not null default 0,
  drive_gb numeric not null default 0,
  mail_gb numeric not null default 0,
  photos_gb numeric not null default 0,
  vault_gb numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_login_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Device Sessions Table
create table if not exists public.device_sessions (
  id text primary key,
  user_id text references public.users(id) on delete cascade not null,
  name text not null,
  type text not null check (type in ('desktop', 'laptop', 'mobile', 'server')),
  os text not null,
  ip text not null default '127.0.0.1',
  last_active text not null default 'Active Now',
  tokens_consumed bigint not null default 0,
  is_current boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Model Quotas Table (5h Sliding Window & Limits)
create table if not exists public.model_quotas (
  id text primary key,
  user_id text references public.users(id) on delete cascade not null,
  model_id text not null,
  model_name text not null,
  category text not null check (category in ('LLM', 'Image', 'Video')),
  code text not null,
  remaining_percentage integer not null check (remaining_percentage between 0 and 100),
  tokens_consumed_5h bigint not null default 0,
  token_limit_5h bigint not null,
  total_limit text not null,
  consumed text not null,
  rpm_limit integer not null default 60,
  current_rpm integer not null default 0,
  tpm_limit bigint not null,
  current_tpm bigint not null default 0,
  rolling_window_hours integer not null default 5,
  next_replenish_minutes integer not null default 45,
  status text not null check (status in ('critical', 'warning', 'optimal')) default 'optimal',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, model_id)
);

-- 4. Cross-Device Chat Vault Table
create table if not exists public.chats (
  id text primary key,
  user_id text references public.users(id) on delete cascade not null,
  device_id text,
  device_name text,
  title text not null,
  category text not null default 'coding',
  model_used text not null default 'Gemini 3 Flash Thinking',
  total_turns integer not null default 0,
  total_tokens bigint not null default 0,
  messages jsonb not null default '[]'::jsonb,
  is_synced boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Nano-Banana Generated Images Table
create table if not exists public.nano_images (
  id text primary key,
  user_id text references public.users(id) on delete cascade not null,
  device_id text,
  device_name text,
  prompt text not null,
  aspect_ratio text not null default '16:9',
  model text not null default 'Nano-Banana-v2',
  image_url text not null,
  credits_used integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Veo 2 / Flow Labs Videos Table
create table if not exists public.veo_videos (
  id text primary key,
  user_id text references public.users(id) on delete cascade not null,
  device_id text,
  device_name text,
  prompt text not null,
  engine text not null default 'Google Veo 2',
  status text not null check (status in ('completed', 'rendering', 'queued')) default 'completed',
  progress integer not null default 100,
  video_url text not null,
  duration_seconds integer not null default 5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Universal Admin Audit Logs Table
create table if not exists public.audit_logs (
  id text primary key default ('audit_' || gen_random_uuid()::text),
  admin_id text not null,
  admin_email text not null,
  action text not null,
  target_user_id text not null,
  details text not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Indexes for High-Performance Queries
create index if not exists idx_device_sessions_user on public.device_sessions(user_id);
create index if not exists idx_model_quotas_user on public.model_quotas(user_id);
create index if not exists idx_chats_user on public.chats(user_id);
create index if not exists idx_nano_images_user on public.nano_images(user_id);
create index if not exists idx_veo_videos_user on public.veo_videos(user_id);

-- Initial Bootstrap: Insert Default Accounts
insert into public.users (id, email, name, tier, role, storage_limit_gb, storage_used_gb, drive_gb, mail_gb, photos_gb, vault_gb)
values
  ('user_admin_master', 'admin@antigravity.internal', 'System Super Admin', 'workspace_enterprise', 'admin', 5120, 42.8, 28.4, 8.2, 4.2, 2.0),
  ('user_developer_power', 'developer.admin@gmail.com', 'Antigravity Power User', 'google_one_premium', 'user', 2048, 48.6, 32.1, 9.5, 5.0, 2.0),
  ('user_free_tester', 'free.user@gmail.com', 'Google Free Tier User', 'free', 'user', 15, 11.4, 7.2, 2.8, 1.0, 0.4)
on conflict (id) do nothing;
