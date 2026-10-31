# Mise en ligne — SLT SERVICES

## État de la préproduction

- Le contrôle TypeScript et le build Vite passent localement.
- Le sitemap est généré dans `public/sitemap.xml`.
- L’API Vercel est exposée par `api/index.ts`.
- La base Supabase est activée dès que `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont configurées.

## 1. Initialiser Supabase

1. Créer le projet Supabase de production.
2. Dans **SQL Editor**, exécuter [`supabase/setup.sql`](supabase/setup.sql). Il crée les tables, les règles RLS et les données initiales.
3. Dans **Project Settings > API**, relever :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

La clé `service_role` doit rester exclusivement côté serveur : ne jamais créer de variable `VITE_` avec cette valeur.

## 2. Configurer Vercel

Dans **Project > Settings > Environment Variables**, ajouter pour les environnements Production et Preview :

| Variable | Usage |
| --- | --- |
| `ADMIN_USERNAME` | identifiant du tableau de bord |
| `ADMIN_PASSWORD` | mot de passe long et unique |
| `ADMIN_API_TOKEN` | jeton aléatoire long pour protéger l’API admin |
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | clé serveur Supabase, secrète |
| `VITE_SITE_URL` | URL HTTPS canonique du site |
| `RESEND_API_KEY` | optionnel, alertes email pour les devis |
| `LEAD_NOTIFY_EMAIL` | optionnel, adresse de réception des devis |
| `LEAD_NOTIFY_FROM` | optionnel, expéditeur Resend vérifié |

Ne pas définir `GEMINI_API_KEY` ni `APP_URL` si ces services ne sont pas utilisés en production.

## 3. Déployer

1. Lier le domaine personnalisé dans Vercel et définir `VITE_SITE_URL` sur son URL finale.
2. Déployer la branche `main`.
3. Vérifier que le build Vercel exécute `npm run build`.

## 4. Recette après déploiement

- Envoyer un devis de test et vérifier sa présence dans `/admin`.
- Vérifier qu’un accès à `/admin` sans identifiants est refusé.
- Tester l’export CSV avec un compte admin.
- Tester les liens téléphone, WhatsApp, email et les boutons de devis sur mobile.
- Ouvrir `/sitemap.xml` et `/robots.txt`.
- Soumettre le sitemap dans Google Search Console une fois le domaine relié.
