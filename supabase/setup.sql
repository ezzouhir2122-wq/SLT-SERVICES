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

-- ============================================================
-- SEED — données initiales (généré automatiquement)
-- ============================================================

insert into public.settings (id, data) values (1, $json${"companyName":"SLT SERVICES","slogan":"Votre piscine, notre expertise. Construction, aménagement, entretien et équipements de piscines au Maroc.","phone":"+212 661 586 841","phoneSecondary":"+212 663 116 200","whatsapp":"+212 661 586 841","email":"contact@slt-services.ma","address":"Bureau N°26, N°484, Quartier Industriel Sidi Ghanem, Marrakech","primaryCity":"Marrakech","citiesCovered":["Marrakech","Guéliz & Hivernage","Palmeraie & Environs","Targa","Route de l’Ourika","Route de Fès","Tamansourt","Autre ville au Maroc"],"openingHours":"Lundi au samedi : 08h30 – 18h30","heroImage":"/assets/pool-hero.png","allowEmergencyCalls":true,"gaMeasurementId":""}$json$::jsonb)
  on conflict (id) do update set data = excluded.data, updated_at = now();

insert into public.services (id, slug, sort_order, data) values ('serv_1', 'construction-piscines', 1, $json${"id":"serv_1","slug":"construction-piscines","title":"Construction de piscines","kicker":"Piscines résidentielles & professionnelles","shortDescription":"Piscines sur mesure, béton, skimmers, débordement.","fullDescription":"Piscines sur mesure, béton, skimmers, débordement. Nous étudions votre bassin, vos usages et les contraintes du site pour vous proposer une solution adaptée, avec un devis détaillé avant intervention.","iconName":"BrickWall","image":"https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1000&q=85","prestations":["Étude et conception du bassin","Terrassement et structure en béton","Étanchéité et revêtement","Piscines à skimmers ou à débordement"],"clientProblems":["Un projet à dimensionner selon vos besoins","Des équipements à choisir ou à remplacer","Un besoin de suivi technique et de conseil"],"solutions":["Visite et diagnostic de votre installation","Proposition technique adaptée à votre piscine","Installation et accompagnement à la prise en main"],"advantages":["Solutions sur mesure","Accompagnement professionnel","Équipements adaptés à vos besoins"],"faq":[{"question":"Comment obtenir un devis ?","answer":"Décrivez votre projet et indiquez votre ville. Notre équipe vous contacte pour préciser vos besoins et organiser une visite si nécessaire."}]}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.services (id, slug, sort_order, data) values ('serv_2', 'amenagement-exterieur', 2, $json${"id":"serv_2","slug":"amenagement-exterieur","title":"Aménagement extérieur","kicker":"Piscines résidentielles & professionnelles","shortDescription":"Terrasses, margelles, éclairage, espaces verts.","fullDescription":"Terrasses, margelles, éclairage, espaces verts. Nous étudions votre bassin, vos usages et les contraintes du site pour vous proposer une solution adaptée, avec un devis détaillé avant intervention.","iconName":"Leaf","image":"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85","prestations":["Plages et terrasses de piscine","Pose de margelles","Éclairage extérieur","Intégration paysagère"],"clientProblems":["Un projet à dimensionner selon vos besoins","Des équipements à choisir ou à remplacer","Un besoin de suivi technique et de conseil"],"solutions":["Visite et diagnostic de votre installation","Proposition technique adaptée à votre piscine","Installation et accompagnement à la prise en main"],"advantages":["Solutions sur mesure","Accompagnement professionnel","Équipements adaptés à vos besoins"],"faq":[{"question":"Comment obtenir un devis ?","answer":"Décrivez votre projet et indiquez votre ville. Notre équipe vous contacte pour préciser vos besoins et organiser une visite si nécessaire."}]}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.services (id, slug, sort_order, data) values ('serv_3', 'renovation-reparation', 3, $json${"id":"serv_3","slug":"renovation-reparation","title":"Rénovation et réparation","kicker":"Piscines résidentielles & professionnelles","shortDescription":"Réhabilitation, étanchéité, modernisation.","fullDescription":"Réhabilitation, étanchéité, modernisation. Nous étudions votre bassin, vos usages et les contraintes du site pour vous proposer une solution adaptée, avec un devis détaillé avant intervention.","iconName":"Wrench","image":"/assets/pool-hero.png","prestations":["Diagnostic du bassin","Reprise de l’étanchéité","Réfection des revêtements","Modernisation des équipements"],"clientProblems":["Un projet à dimensionner selon vos besoins","Des équipements à choisir ou à remplacer","Un besoin de suivi technique et de conseil"],"solutions":["Visite et diagnostic de votre installation","Proposition technique adaptée à votre piscine","Installation et accompagnement à la prise en main"],"advantages":["Solutions sur mesure","Accompagnement professionnel","Équipements adaptés à vos besoins"],"faq":[{"question":"Comment obtenir un devis ?","answer":"Décrivez votre projet et indiquez votre ville. Notre équipe vous contacte pour préciser vos besoins et organiser une visite si nécessaire."}]}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.services (id, slug, sort_order, data) values ('serv_4', 'installation-pompes', 4, $json${"id":"serv_4","slug":"installation-pompes","title":"Installation de pompes","kicker":"Piscines résidentielles & professionnelles","shortDescription":"Pompes, surpresseurs, remplacement.","fullDescription":"Pompes, surpresseurs, remplacement. Nous étudions votre bassin, vos usages et les contraintes du site pour vous proposer une solution adaptée, avec un devis détaillé avant intervention.","iconName":"Settings","image":"/assets/pool-equipment.png#pump","prestations":["Choix et dimensionnement de la pompe","Pose et raccordement hydraulique","Remplacement de pompes","Réglage et mise en service"],"clientProblems":["Un projet à dimensionner selon vos besoins","Des équipements à choisir ou à remplacer","Un besoin de suivi technique et de conseil"],"solutions":["Visite et diagnostic de votre installation","Proposition technique adaptée à votre piscine","Installation et accompagnement à la prise en main"],"advantages":["Solutions sur mesure","Accompagnement professionnel","Équipements adaptés à vos besoins"],"faq":[{"question":"Comment obtenir un devis ?","answer":"Décrivez votre projet et indiquez votre ville. Notre équipe vous contacte pour préciser vos besoins et organiser une visite si nécessaire."}]}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.services (id, slug, sort_order, data) values ('serv_5', 'filtration-equipements', 5, $json${"id":"serv_5","slug":"filtration-equipements","title":"Filtration et équipements","kicker":"Piscines résidentielles & professionnelles","shortDescription":"Filtres, vannes, coffrets, traitement de l’eau.","fullDescription":"Filtres, vannes, coffrets, traitement de l’eau. Nous étudions votre bassin, vos usages et les contraintes du site pour vous proposer une solution adaptée, avec un devis détaillé avant intervention.","iconName":"Filter","image":"/assets/pool-equipment.png#filter","prestations":["Installation de filtres","Vannes et coffrets de commande","Équipements de traitement de l’eau","Optimisation du local technique"],"clientProblems":["Un projet à dimensionner selon vos besoins","Des équipements à choisir ou à remplacer","Un besoin de suivi technique et de conseil"],"solutions":["Visite et diagnostic de votre installation","Proposition technique adaptée à votre piscine","Installation et accompagnement à la prise en main"],"advantages":["Solutions sur mesure","Accompagnement professionnel","Équipements adaptés à vos besoins"],"faq":[{"question":"Comment obtenir un devis ?","answer":"Décrivez votre projet et indiquez votre ville. Notre équipe vous contacte pour préciser vos besoins et organiser une visite si nécessaire."}]}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.services (id, slug, sort_order, data) values ('serv_6', 'entretien-maintenance', 6, $json${"id":"serv_6","slug":"entretien-maintenance","title":"Entretien et maintenance","kicker":"Piscines résidentielles & professionnelles","shortDescription":"Nettoyage, suivi, contrats d’entretien.","fullDescription":"Nettoyage, suivi, contrats d’entretien. Nous étudions votre bassin, vos usages et les contraintes du site pour vous proposer une solution adaptée, avec un devis détaillé avant intervention.","iconName":"Sparkles","image":"/assets/pool-equipment.png#robot","prestations":["Nettoyage du bassin","Contrôle de la filtration","Suivi de la qualité de l’eau","Contrats d’entretien adaptés"],"clientProblems":["Un projet à dimensionner selon vos besoins","Des équipements à choisir ou à remplacer","Un besoin de suivi technique et de conseil"],"solutions":["Visite et diagnostic de votre installation","Proposition technique adaptée à votre piscine","Installation et accompagnement à la prise en main"],"advantages":["Solutions sur mesure","Accompagnement professionnel","Équipements adaptés à vos besoins"],"faq":[{"question":"Comment obtenir un devis ?","answer":"Décrivez votre projet et indiquez votre ville. Notre équipe vous contacte pour préciser vos besoins et organiser une visite si nécessaire."}]}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.products (id, slug, category, sort_order, data) values ('1', 'pompes-piscine', 'Pompes', 1, $json${"id":"1","slug":"pompes-piscine","name":"Pompes de piscine","reference":"PISC-1","brand":"Sélection SLT SERVICES","category":"Pompes","isPriceOnDemand":true,"shortDescription":"Pompes de circulation et surpresseurs, sélectionnés selon votre bassin et votre réseau hydraulique.","image":"/assets/pool-equipment.png#pump","specs":[{"label":"Sélection","value":"Selon le volume et la configuration du bassin"},{"label":"Installation","value":"Sur devis après étude"}],"inStock":false,"featured":true}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, category=excluded.category, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.products (id, slug, category, sort_order, data) values ('2', 'filtres-sable', 'Filtration', 2, $json${"id":"2","slug":"filtres-sable","name":"Filtres à sable","reference":"PISC-2","brand":"Sélection SLT SERVICES","category":"Filtration","isPriceOnDemand":true,"shortDescription":"Filtres à sable et vannes multivoies pour une filtration adaptée au volume de votre piscine.","image":"/assets/pool-equipment.png#filter","specs":[{"label":"Sélection","value":"Selon le volume et la configuration du bassin"},{"label":"Installation","value":"Sur devis après étude"}],"inStock":false,"featured":true}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, category=excluded.category, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.products (id, slug, category, sort_order, data) values ('3', 'robots-nettoyeurs', 'Nettoyage', 3, $json${"id":"3","slug":"robots-nettoyeurs","name":"Robots nettoyeurs","reference":"PISC-3","brand":"Sélection SLT SERVICES","category":"Nettoyage","isPriceOnDemand":true,"shortDescription":"Robots pour le nettoyage du fond et, selon le modèle, des parois du bassin.","image":"/assets/pool-equipment.png#robot","specs":[{"label":"Sélection","value":"Selon le volume et la configuration du bassin"},{"label":"Installation","value":"Sur devis après étude"}],"inStock":false,"featured":true}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, category=excluded.category, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.products (id, slug, category, sort_order, data) values ('4', 'eclairage-led', 'Éclairage', 4, $json${"id":"4","slug":"eclairage-led","name":"Éclairage LED","reference":"PISC-4","brand":"Sélection SLT SERVICES","category":"Éclairage","isPriceOnDemand":true,"shortDescription":"Projecteurs immergés pour mettre en lumière votre piscine et créer une ambiance nocturne.","image":"/assets/pool-equipment.png#light","specs":[{"label":"Sélection","value":"Selon le volume et la configuration du bassin"},{"label":"Installation","value":"Sur devis après étude"}],"inStock":false,"featured":true}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, category=excluded.category, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.products (id, slug, category, sort_order, data) values ('5', 'skimmers-accessoires', 'Accessoires', 5, $json${"id":"5","slug":"skimmers-accessoires","name":"Skimmers et accessoires","reference":"PISC-5","brand":"Sélection SLT SERVICES","category":"Accessoires","isPriceOnDemand":true,"shortDescription":"Skimmers, paniers et accessoires pour l’aspiration de surface et l’entretien du bassin.","image":"/assets/pool-equipment.png#skimmer","specs":[{"label":"Sélection","value":"Selon le volume et la configuration du bassin"},{"label":"Installation","value":"Sur devis après étude"}],"inStock":false,"featured":true}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, category=excluded.category, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.products (id, slug, category, sort_order, data) values ('6', 'pieces-detachees', 'Pièces détachées', 6, $json${"id":"6","slug":"pieces-detachees","name":"Pièces détachées","reference":"PISC-6","brand":"Sélection SLT SERVICES","category":"Pièces détachées","isPriceOnDemand":true,"shortDescription":"Raccords, unions et pièces de remplacement à vérifier selon votre installation.","image":"/assets/pool-equipment.png#fittings","specs":[{"label":"Sélection","value":"Selon le volume et la configuration du bassin"},{"label":"Installation","value":"Sur devis après étude"}],"inStock":false,"featured":true}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, category=excluded.category, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.projects (id, slug, category, sort_order, data) values ('proj_1', 'piscine-villa-contemporaine', 'construction', 1, $json${"id":"proj_1","slug":"piscine-villa-contemporaine","title":"Piscine de villa contemporaine","category":"construction","categoryLabel":"Construction de piscine","location":"Marrakech","description":"Inspiration pour un bassin résidentiel intégré à une villa et à ses espaces de détente.","keyPoints":["Bassin sur mesure","Intégration à la terrasse","Filtration adaptée"],"image":"/assets/pool-hero.png","isDemonstration":true}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, category=excluded.category, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.projects (id, slug, category, sort_order, data) values ('proj_2', 'renovation-bassin', 'renovation', 2, $json${"id":"proj_2","slug":"renovation-bassin","title":"Une piscine remise en valeur","category":"renovation","categoryLabel":"Rénovation","location":"Marrakech","description":"Exemple illustratif de modernisation d’un bassin et de ses abords.","keyPoints":["Étanchéité","Revêtement","Modernisation"],"image":"https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1000&q=85","beforeImage":"/assets/pool-before.png","afterImage":"https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1000&q=85","hasBeforeAfter":true,"isDemonstration":true}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, category=excluded.category, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.projects (id, slug, category, sort_order, data) values ('proj_3', 'piscine-eclairage', 'amenagement', 3, $json${"id":"proj_3","slug":"piscine-eclairage","title":"Ambiance autour du bassin","category":"amenagement","categoryLabel":"Aménagement extérieur","location":"Marrakech","description":"Inspiration pour une piscine et des espaces de vie extérieurs harmonieux.","keyPoints":["Terrasses","Margelles","Éclairage"],"image":"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=85","isDemonstration":true}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, category=excluded.category, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.projects (id, slug, category, sort_order, data) values ('proj_4', 'piscine-jardin', 'amenagement', 4, $json${"id":"proj_4","slug":"piscine-jardin","title":"Un espace de détente au jardin","category":"amenagement","categoryLabel":"Piscine & jardin","location":"Marrakech","description":"Exemple d’intégration paysagère d’un bassin dans un jardin résidentiel.","keyPoints":["Espaces verts","Plages de piscine","Confort d’utilisation"],"image":"https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1000&q=85","isDemonstration":true}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, category=excluded.category, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.maintenance_plans (id, sort_order, data) values ('maint_1', 1, $json${"id":"maint_1","name":"Essentiel","targetAudience":"Piscines privées","idealFor":"Un contrôle régulier de votre piscine","visitsPerMonth":"Fréquence à définir","features":["Nettoyage du bassin","Contrôle visuel des équipements","Conseils d’entretien"]}$json$::jsonb)
  on conflict (id) do update set sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.maintenance_plans (id, sort_order, data) values ('maint_2', 2, $json${"id":"maint_2","name":"Sérénité","targetAudience":"Résidences et villas","idealFor":"Un accompagnement pendant la saison","visitsPerMonth":"Selon les usages du bassin","features":["Nettoyage et contrôle de la filtration","Suivi de la qualité de l’eau","Réglage des équipements","Compte rendu des interventions"],"isPopular":true}$json$::jsonb)
  on conflict (id) do update set sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.maintenance_plans (id, sort_order, data) values ('maint_3', 3, $json${"id":"maint_3","name":"Professionnel","targetAudience":"Hôtels, riads et résidences","idealFor":"Un suivi adapté aux piscines professionnelles","visitsPerMonth":"Planning personnalisé","features":["Programme d’entretien sur mesure","Suivi du local technique","Maintenance préventive","Interlocuteur dédié"]}$json$::jsonb)
  on conflict (id) do update set sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.blog_posts (id, slug, is_draft, published_at, data) values ('blog_1', 'concevoir-piscine', false, '2026-10-29', $json${"id":"blog_1","slug":"concevoir-piscine","title":"Bien préparer son projet de piscine","category":"Construction","readTime":"4 min","publishedAt":"2026-10-29","excerpt":"Les questions à se poser avant de concevoir votre bassin.","content":["La conception commence par vos usages : détente, nage ou accueil de visiteurs. Le terrain et les accès guident ensuite l’implantation.","Définissez la forme, le revêtement et les abords avec votre professionnel. Demandez un devis détaillé qui inclut le bassin, la filtration et la mise en service."],"isDraft":false}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, is_draft=excluded.is_draft, published_at=excluded.published_at, data=excluded.data, updated_at=now();
insert into public.blog_posts (id, slug, is_draft, published_at, data) values ('blog_2', 'entretenir-piscine', false, '2026-10-29', $json${"id":"blog_2","slug":"entretenir-piscine","title":"Les bons réflexes pour entretenir votre piscine","category":"Entretien","readTime":"3 min","publishedAt":"2026-10-29","excerpt":"Nettoyage, filtration et suivi de l’eau : les bases d’un entretien régulier.","content":["Retirez les débris et nettoyez régulièrement les paniers et le bassin. Adaptez la filtration à l’utilisation de votre piscine et aux recommandations du fabricant.","Contrôlez l’eau avec un dispositif adapté. Pour tout produit de traitement, suivez la notice et les conseils de votre professionnel."],"isDraft":false}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, is_draft=excluded.is_draft, published_at=excluded.published_at, data=excluded.data, updated_at=now();
insert into public.blog_posts (id, slug, is_draft, published_at, data) values ('blog_3', 'choisir-equipements', false, '2026-10-29', $json${"id":"blog_3","slug":"choisir-equipements","title":"Quels équipements pour votre piscine ?","category":"Équipements","readTime":"4 min","publishedAt":"2026-10-29","excerpt":"Pompe, filtre, robot et éclairage : une sélection adaptée au bassin.","content":["Le choix de la pompe et du filtre dépend du volume du bassin, du réseau hydraulique et des usages.","Un robot compatible avec le revêtement facilite le nettoyage. L’éclairage et les accessoires se sélectionnent en tenant compte de l’installation existante."],"isDraft":false}$json$::jsonb)
  on conflict (id) do update set slug=excluded.slug, is_draft=excluded.is_draft, published_at=excluded.published_at, data=excluded.data, updated_at=now();
insert into public.faq (id, category, sort_order, data) values ('faq_1', 'devis', 1, $json${"id":"faq_1","category":"devis","question":"Comment obtenir un devis pour ma piscine ?","answer":"Indiquez votre type de projet, vos coordonnées et votre ville. Nous vous contactons pour préciser vos besoins et organiser une étude du site si nécessaire."}$json$::jsonb)
  on conflict (id) do update set category=excluded.category, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.faq (id, category, sort_order, data) values ('faq_2', 'construction', 2, $json${"id":"faq_2","category":"construction","question":"Réalisez-vous des piscines sur mesure ?","answer":"Oui, la forme, les dimensions, le revêtement et les équipements sont étudiés selon votre terrain et vos attentes."}$json$::jsonb)
  on conflict (id) do update set category=excluded.category, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.faq (id, category, sort_order, data) values ('faq_3', 'entretien', 3, $json${"id":"faq_3","category":"entretien","question":"Proposez-vous des contrats d’entretien ?","answer":"Nous proposons un suivi du nettoyage, de la filtration et des équipements. La fréquence des visites est définie selon votre bassin et son utilisation."}$json$::jsonb)
  on conflict (id) do update set category=excluded.category, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
insert into public.faq (id, category, sort_order, data) values ('faq_4', 'equipements', 4, $json${"id":"faq_4","category":"equipements","question":"Pouvez-vous remplacer ma pompe ou mon filtre ?","answer":"Nous examinons votre installation afin de sélectionner un équipement compatible et adapté, puis établissons un devis de fourniture et d’installation."}$json$::jsonb)
  on conflict (id) do update set category=excluded.category, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();
