# Cahier des charges — Site web & plateforme SLT SERVICES

> Document descriptif du projet digital de **SLT SERVICES** (site vitrine, génération de prospects, back-office CRM, blog SEO et génération de devis/factures).
> Version 1.0 — Dernière mise à jour : 31/10/2026.

---

## 1. Présentation du projet

### 1.1 Contexte
SLT SERVICES souhaite disposer d'une présence digitale professionnelle pour présenter son activité, générer des demandes de devis qualifiées et gérer sa relation client. Le projet couvre un **site web public** orienté conversion et un **espace d'administration** (CRM léger) permettant de suivre les prospects et de produire des documents commerciaux (devis et factures).

### 1.2 Présentation de l'entreprise
- **Raison sociale :** SLT SERVICES S.A.R.L
- **Activité principale (site) :** construction, rénovation, aménagement, équipements et entretien de **piscines** à Marrakech et au Maroc.
- **Activités élargies :** travaux de constructions, infrastructures, rénovation, terrassement, assainissement, aménagement, construction et entretien des routes et travaux de tous corps d'état.
- **Siège :** Bureau N° 26, N° 484, Quartier Industriel Sidi Ghanem, Marrakech.
- **Zone d'intervention :** Marrakech (Guéliz, Hivernage, Palmeraie, Targa, Route de l'Ourika, Route de Fès, Tamansourt) et reste du Maroc.
- **Contact :** +212 661 586 841 (tél/WhatsApp) · +212 663 116 200 · contact@slt-services.ma
- **Horaires :** du lundi au samedi, 08h30 – 18h30.

### 1.3 Objectifs
1. **Crédibiliser** l'entreprise avec un site moderne et professionnel.
2. **Générer des prospects** (demandes de devis) via des formulaires et des appels à l'action clairs.
3. **Centraliser et suivre** les demandes dans un back-office (CRM).
4. **Gagner en visibilité** sur Google (SEO local « piscine Marrakech ») et auprès des IA.
5. **Accélérer la facturation** avec un générateur de devis/factures conforme à l'identité de l'entreprise.

---

## 2. Cibles

| Cible | Besoin | Réponse du site |
|-------|--------|-----------------|
| Particulier / villa | Construire, rénover ou entretenir sa piscine | Pages services, réalisations, devis rapide, WhatsApp |
| Résidence / hôtel / riad | Contrat d'entretien, maintenance professionnelle | Page maintenance, formules, prise de contact |
| Client en panne | Dépannage urgent (pompe, filtration, fuite) | Page dépannage + CTA d'urgence |
| Prospect en recherche d'info | Conseils, prix, étapes | Blog SEO (articles conseils) |
| Gérant / commercial (interne) | Suivre les leads, émettre devis/factures | Espace admin (CRM + Finance) |

---

## 3. Périmètre fonctionnel

### 3.1 Site public

**Arborescence :**
- `/` — Accueil (hero, services, réalisations, témoignages, CTA devis)
- `/services` et `/services/:slug` — Détail des 6 services
- `/equipements` et `/equipements/:slug` — Catalogue d'équipements (pompes, filtres, robots, éclairage…)
- `/realisations` et `/realisations/:slug` — Projets / réalisations (avant-après)
- `/devis` — Formulaire de demande de devis
- `/depannage` — Dépannage / intervention rapide
- `/maintenance` — Contrats d'entretien (formules Essentiel, Sérénité, Professionnel)
- `/blog` et `/blog/:slug` — Blog conseils (articles SEO indexables individuellement)
- `/a-propos` — Présentation de l'entreprise
- `/contact` — Coordonnées et formulaire
- `/mentions-legales`, `/confidentialite` — Pages légales
- `/admin` — Espace d'administration (protégé)

**Composants transverses :**
- En-tête avec navigation + CTA « Demander un devis ».
- Bouton WhatsApp flottant et barre d'action mobile (appel / WhatsApp / devis).
- Mini-formulaire de devis rapide (nom, téléphone, ville, service, message).
- Bandeau de consentement cookies (RGPD / CNDP) conditionné à l'activation d'un suivi analytics.
- **Application installable (PWA)** : manifeste, service worker (cache hors-ligne léger), icônes, bandeau « Installer l'application » (Android/desktop) et astuce iOS. Parcours self-service : lien WhatsApp → ouverture → installation → connexion à l'espace admin, sans assistance technique.
- Pied de page (services, liens, contact, réseaux).

### 3.2 Génération de prospects (leads)
- Soumission d'une demande via le formulaire → enregistrement serveur avec **référence unique** (`SLT-AAAA-NNNN`).
- Validation (nom, téléphone obligatoires) et **anti-doublon** (même numéro < 2 min).
- Notification au gérant **par email à chaque nouveau lead** (via Resend) — activable par variables d'environnement.
- Événement de conversion `generate_lead` envoyé à Google Analytics 4 (si consentement + ID configurés).

### 3.3 Back-office d'administration (CRM)
Accès protégé par authentification (identifiant + mot de passe, jeton serveur). Onglets :
- **Vue d'ensemble & stats** : indicateurs clés (total demandes, nouveaux, en cours, qualifiés, gagnés).
- **Gestion des leads** : liste, filtres (statut, source, recherche), fiche détaillée, mise à jour du statut/assignation/notes, historique, **export CSV**, raccourcis Appeler / WhatsApp / **Créer un devis**.
- **Catalogue produits** et **Services** : édition du contenu.
- **Finance — Devis & Factures** : générateur de documents (voir §3.4).
- **Paramètres de l'entreprise** : coordonnées, WhatsApp, ID Google Analytics.

### 3.4 Module Finance — Devis & Factures
- Générateur de **devis** et **factures** reproduisant fidèlement l'identité de l'entreprise (logo, en-tête d'activité, **bandeau légal** en pied de page : Capital, ICE, RC, IF, Patente, CNSS, RIB AttijariwafaBank).
- Bascule **Facture / Devis** (adaptation des mentions, « Devis valable 30 jours »).
- Tableau d'articles éditable (N°, Désignation, Unité, Quantité, Prix U HT, Total HT) avec ajout/suppression de lignes.
- **Calcul automatique** HT / TVA (taux paramétrable) / TTC et **montant en toutes lettres** (français).
- **Numéro et date automatiques** (format `NNN-MMAAAA`).
- **Pré-remplissage depuis un lead** (nom client, objet, ville, téléphone).
- **Export PDF** via impression A4 (interface masquée, document seul).
- Modèle **autonome hors-ligne** disponible (`modeles/devis-facture-slt.html`) en secours.

---

## 4. Identité visuelle

- **Logo :** logo officiel SLT SERVICES (conservé tel quel sur le site et les documents).
- **Palette :** bleu profond `#0077B6`, cyan `#00B4D8`, encre `#102A43`, fond clair `#F8FAFC`.
- **Typographies :** Manrope (titres) et Plus Jakarta Sans (textes).
- **Ton :** professionnel, rassurant, orienté expertise et proximité locale.

---

## 5. Spécifications techniques

### 5.1 Stack
- **Front-end :** React 19 + TypeScript, build **Vite 8**, styles **Tailwind CSS 4**, animations `motion`, icônes `lucide-react`.
- **Routing :** routeur maison basé sur le chemin courant (SPA).
- **Back-end :** API **Express** exécutée en fonction **serverless Vercel** (`/api`).
- **Persistance :** **Supabase** (PostgreSQL) en production, avec repli automatique sur un stockage fichier (`data/db.json`) si non configuré.
- **Emails :** **Resend** (notification des leads).
- **Analytics :** **Google Analytics 4** (avec consentement).

### 5.2 Architecture
- Application monopage (SPA) servie statiquement, API découplée sous `/api`.
- Données initiales (services, produits, projets, articles, FAQ, paramètres) centralisées dans `src/data/initialData.ts`.
- Séparation claire : `src/pages`, `src/components`, `src/context`, `src/lib`, `lib/` (serveur/stores).

### 5.3 SEO & performance
- Balises `title` / `meta description` **uniques par page**, `canonical`, Open Graph et Twitter Card dynamiques.
- Données structurées **JSON-LD** : `LocalBusiness` (global), `BlogPosting` + `FAQPage` (articles).
- `robots.txt` et `sitemap.xml` (généré automatiquement au build, synchronisé avec le contenu).
- Images optimisées, chargement différé, build minifié.

### 5.4 Sécurité & conformité
- Espace admin protégé par authentification (jeton côté serveur, clé service_role Supabase jamais exposée au front).
- Validation et anti-doublon des soumissions.
- **Consentement cookies** (RGPD / CNDP Maroc) avant tout traçage analytics ; `anonymize_ip` activé.
- Pages **Mentions légales** et **Politique de confidentialité**.
- Variables sensibles gérées via les variables d'environnement Vercel.

### 5.5 Hébergement & déploiement
- **Hébergement :** Vercel (framework Vite, Node 26.x).
- **Domaine de production :** `https://slt-services.vercel.app` (domaine de marque connectable ultérieurement).
- **Déploiement :** automatique à chaque mise à jour (commit + push + déploiement production).

---

## 6. Variables d'environnement (configuration)

| Variable | Rôle |
|----------|------|
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Persistance Supabase (serveur) |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_API_TOKEN` | Accès back-office |
| `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`, `LEAD_NOTIFY_FROM` | Notification email des leads |
| `VITE_SITE_URL` | URL canonique (SEO, sitemap, Open Graph) |
| `VITE_GA_ID` / paramètre `gaMeasurementId` | Identifiant Google Analytics 4 |
| `APP_URL` | Liens auto-référents (ex. lien dashboard dans l'email) |

---

## 7. Évolutions prévues (roadmap)

- **Notifications leads** : activation Resend (email) — code prêt, en attente de clé.
- **Analytics** : activation GA4 — en attente de l'ID de mesure.
- **Référencement** : soumission du `sitemap.xml` à Google Search Console.
- **Contenu** : enrichissement du blog (articles locaux supplémentaires), photos de chantiers réels.
- **Finance** : historique des devis/factures émis (numérotation automatique incrémentale + liste sauvegardée en base).
- **Domaine** : connexion d'un domaine de marque personnalisé.

---

## 8. Annexe — Informations légales de l'entreprise

| Champ | Valeur |
|-------|--------|
| Raison sociale | SLT SERVICES S.A.R.L |
| Capital | 1 000 000,00 DHS |
| Siège | N° 484, Bureau N° 26, QI Sidi Ghanem, Marrakech |
| ICE | 003540448000046 |
| RC | 151233 |
| IF | 66003383 |
| Patente | 64003383 |
| CNSS | 5535817 |
| Banque | ATTIJARIWAFABANK Q-I Sidi Ghanem Marrakech |
| RIB | 007 450 00 13468000001409 61 |
| Téléphone / Fax | +212 661 586 841 |
| Email | contact@slt-services.ma |

---

*Document de référence du projet SLT SERVICES. À mettre à jour à chaque évolution majeure du périmètre.*
