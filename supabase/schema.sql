-- ============================================================
-- SLT SERVICES — Schéma Supabase (Postgres)
-- Architecture : serveur (server.ts, clé service_role) + RLS.
--   Le serveur Express est de confiance et contourne la RLS.
--   Les politiques RLS ci-dessous protègent l'accès direct (clé anon) :
--   lecture publique du contenu, écriture réservée aux comptes authentifiés.
-- À coller dans : Supabase Dashboard > SQL Editor > New query
-- Ce fichier est idempotent (ré-exécutable sans casse).
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABLES DE CONTENU (CMS léger — édition via Admin Dashboard)
--    Chaque objet métier est stocké en jsonb `data` (= type TS),
--    avec quelques colonnes "plates" pour le filtre/tri.
-- ------------------------------------------------------------

create table if not exists public.settings (
  id         int primary key default 1,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);

create table if not exists public.services (
  id         text primary key,
  slug       text,
  sort_order int not null default 0,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id         text primary key,
  slug       text,
  category   text,
  sort_order int not null default 0,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id         text primary key,
  slug       text,
  category   text,
  sort_order int not null default 0,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.maintenance_plans (
  id         text primary key,
  sort_order int not null default 0,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id           text primary key,
  slug         text,
  is_draft     boolean not null default false,
  published_at date,
  data         jsonb not null,
  updated_at   timestamptz not null default now()
);

create table if not exists public.faq (
  id         text primary key,
  category   text,
  sort_order int not null default 0,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id         text primary key,
  verified   boolean not null default false,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. TABLE CRM — PROSPECTS / DEMANDES DE DEVIS
-- ------------------------------------------------------------

create table if not exists public.leads (
  id            text primary key,
  ref           text unique not null,
  created_at    timestamptz not null default now(),
  name          text not null,
  phone         text not null,
  whatsapp      text,
  email         text,
  city          text,
  source        text,
  origin_page   text,
  service       text,
  description   text,
  urgency       text,
  details       jsonb not null default '{}'::jsonb,
  status        text not null default 'nouveau',
  priority      text not null default 'normal',
  assigned_to   text,
  internal_notes text default '',
  follow_up_date text,
  history       jsonb not null default '[]'::jsonb
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx     on public.leads (status);

-- ------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- ------------------------------------------------------------

alter table public.settings          enable row level security;
alter table public.services          enable row level security;
alter table public.products          enable row level security;
alter table public.projects          enable row level security;
alter table public.maintenance_plans enable row level security;
alter table public.blog_posts        enable row level security;
alter table public.faq               enable row level security;
alter table public.testimonials      enable row level security;
alter table public.leads             enable row level security;

-- Nettoyage (idempotence) ------------------------------------
drop policy if exists "read settings"           on public.settings;
drop policy if exists "write settings"          on public.settings;
drop policy if exists "read services"           on public.services;
drop policy if exists "write services"          on public.services;
drop policy if exists "read products"           on public.products;
drop policy if exists "write products"          on public.products;
drop policy if exists "read projects"           on public.projects;
drop policy if exists "write projects"          on public.projects;
drop policy if exists "read maintenance"        on public.maintenance_plans;
drop policy if exists "write maintenance"       on public.maintenance_plans;
drop policy if exists "read published posts"    on public.blog_posts;
drop policy if exists "read all posts auth"     on public.blog_posts;
drop policy if exists "write posts"             on public.blog_posts;
drop policy if exists "read faq"                on public.faq;
drop policy if exists "write faq"               on public.faq;
drop policy if exists "read verified testim"    on public.testimonials;
drop policy if exists "read all testim auth"    on public.testimonials;
drop policy if exists "write testimonials"      on public.testimonials;
drop policy if exists "insert leads public"     on public.leads;
drop policy if exists "read leads auth"         on public.leads;
drop policy if exists "update leads auth"       on public.leads;
drop policy if exists "delete leads auth"       on public.leads;

-- Lecture publique du contenu (tous rôles) -------------------
create policy "read settings"    on public.settings          for select using (true);
create policy "read services"    on public.services          for select using (true);
create policy "read products"    on public.products          for select using (true);
create policy "read projects"    on public.projects          for select using (true);
create policy "read maintenance" on public.maintenance_plans for select using (true);
create policy "read faq"         on public.faq               for select using (true);

-- Blog : public = publiés uniquement ; admin = tout ----------
create policy "read published posts" on public.blog_posts for select using (is_draft = false);
create policy "read all posts auth"  on public.blog_posts for select to authenticated using (true);

-- Témoignages : public = vérifiés ; admin = tout ------------
create policy "read verified testim" on public.testimonials for select using (verified = true);
create policy "read all testim auth" on public.testimonials for select to authenticated using (true);

-- Écriture du contenu : admin (authenticated) seulement ------
create policy "write settings"    on public.settings          for all to authenticated using (true) with check (true);
create policy "write services"    on public.services          for all to authenticated using (true) with check (true);
create policy "write products"    on public.products          for all to authenticated using (true) with check (true);
create policy "write projects"    on public.projects          for all to authenticated using (true) with check (true);
create policy "write maintenance" on public.maintenance_plans for all to authenticated using (true) with check (true);
create policy "write posts"       on public.blog_posts        for all to authenticated using (true) with check (true);
create policy "write faq"         on public.faq               for all to authenticated using (true) with check (true);
create policy "write testimonials" on public.testimonials     for all to authenticated using (true) with check (true);

-- Leads : INSERT public (formulaires) ; lecture/maj/suppr = admin
create policy "insert leads public" on public.leads for insert with check (true);
create policy "read leads auth"     on public.leads for select to authenticated using (true);
create policy "update leads auth"   on public.leads for update to authenticated using (true) with check (true);
create policy "delete leads auth"   on public.leads for delete to authenticated using (true);
