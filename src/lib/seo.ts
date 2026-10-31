import { initialServices, initialProducts, initialProjects, initialCompanySettings } from '../data/initialData';

/**
 * URL de production officielle (indexée par Google).
 * Surchargeable via la variable d'environnement VITE_SITE_URL.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://slt-services.vercel.app').replace(/\/$/, '');

const BRAND = initialCompanySettings.companyName; // "SLT SERVICES"
const CITY = initialCompanySettings.primaryCity; // "Marrakech"
const DEFAULT_IMAGE = `${SITE_URL}/assets/logo-slt.png`;

export interface PageSeo {
  title: string;
  description: string;
  image?: string;
  /** Empêche l'indexation (pages admin, etc.) */
  noindex?: boolean;
}

/** Titres/descriptions optimisés par page statique. */
const STATIC_SEO: Record<string, PageSeo> = {
  '/': {
    title: `${BRAND} — Construction & entretien de piscines à ${CITY}`,
    description: `Construction, rénovation, équipements et entretien de piscines à ${CITY} et au Maroc. Devis personnalisé gratuit. Pompes, filtres, robots et éclairage.`,
  },
  '/devis': {
    title: `Devis piscine gratuit à ${CITY} | ${BRAND}`,
    description: `Recevez une étude personnalisée de votre projet de piscine : construction, rénovation, équipements ou entretien. Réponse rapide par notre équipe à ${CITY}.`,
  },
  '/depannage': {
    title: `Dépannage piscine à ${CITY} | ${BRAND}`,
    description: `Panne de pompe, de filtration ou fuite ? Intervention rapide de dépannage de piscine à ${CITY} et ses environs. Contactez ${BRAND}.`,
  },
  '/maintenance': {
    title: `Entretien & contrats de maintenance piscine à ${CITY} | ${BRAND}`,
    description: `Contrats d'entretien de piscine adaptés aux particuliers, villas et professionnels à ${CITY}. Nettoyage, filtration et suivi de la qualité de l'eau.`,
  },
  '/a-propos': {
    title: `À propos de ${BRAND} — Expert piscines à ${CITY}`,
    description: `${BRAND}, votre spécialiste de la piscine à ${CITY} : construction, aménagement, équipements et entretien. Découvrez notre savoir-faire.`,
  },
  '/blog': {
    title: `Conseils piscine — Blog ${BRAND}`,
    description: `Conseils et guides pour concevoir, équiper et entretenir votre piscine au Maroc. Articles rédigés par les experts de ${BRAND}.`,
  },
  '/contact': {
    title: `Contact — ${BRAND} à ${CITY}`,
    description: `Contactez ${BRAND} à ${CITY} : téléphone, WhatsApp et formulaire. Devis et renseignements sur la construction et l'entretien de piscines.`,
  },
  '/mentions-legales': {
    title: `Mentions légales | ${BRAND}`,
    description: `Mentions légales du site ${BRAND}.`,
    noindex: true,
  },
  '/confidentialite': {
    title: `Politique de confidentialité | ${BRAND}`,
    description: `Politique de confidentialité et traitement des données personnelles du site ${BRAND}.`,
    noindex: true,
  },
  '/admin': {
    title: `Administration | ${BRAND}`,
    description: '',
    noindex: true,
  },
};

const FALLBACK: PageSeo = STATIC_SEO['/'];

/** Résout les meta SEO pour un chemin donné (y compris routes dynamiques). */
export function resolveSeo(path: string): PageSeo {
  const clean = path.replace(/\/+$/, '') || '/';

  if (STATIC_SEO[clean]) return STATIC_SEO[clean];

  // /services ou /services/:slug
  if (clean === '/services' || clean.startsWith('/services/')) {
    const slug = clean.split('/')[2];
    const svc = slug ? initialServices.find(s => s.slug === slug) : undefined;
    if (svc) {
      return {
        title: `${svc.title} à ${CITY} | ${BRAND}`,
        description: `${svc.shortDescription} ${BRAND} intervient à ${CITY} et au Maroc. Demandez votre devis.`.slice(0, 160),
        image: svc.image?.startsWith('http') ? svc.image : undefined,
      };
    }
    return {
      title: `Nos services piscine à ${CITY} | ${BRAND}`,
      description: `Construction, rénovation, aménagement, équipements et entretien de piscines à ${CITY}. Découvrez tous les services ${BRAND}.`,
    };
  }

  // /equipements ou /equipements/:slug
  if (clean === '/equipements' || clean.startsWith('/equipements/')) {
    const slug = clean.split('/')[2];
    const prod = slug ? initialProducts.find(p => p.slug === slug) : undefined;
    if (prod) {
      return {
        title: `${prod.name} pour piscine | ${BRAND}`,
        description: `${prod.shortDescription}`.slice(0, 160),
      };
    }
    return {
      title: `Équipements de piscine à ${CITY} | ${BRAND}`,
      description: `Pompes, filtres, robots, éclairage et accessoires de piscine sélectionnés et installés par ${BRAND} à ${CITY}.`,
    };
  }

  // /realisations ou /realisations/:slug
  if (clean === '/realisations' || clean.startsWith('/realisations/')) {
    const slug = clean.split('/')[2];
    const proj = slug ? initialProjects.find(p => p.slug === slug) : undefined;
    if (proj) {
      return {
        title: `${proj.title} — ${proj.categoryLabel} | ${BRAND}`,
        description: `${proj.description}`.slice(0, 160),
        image: proj.image?.startsWith('http') ? proj.image : undefined,
      };
    }
    return {
      title: `Réalisations piscines à ${CITY} | ${BRAND}`,
      description: `Découvrez des exemples de piscines, rénovations et aménagements réalisés par ${BRAND} à ${CITY} et au Maroc.`,
    };
  }

  return FALLBACK;
}

/** Met à jour (ou crée) une balise <meta> par nom ou propriété. */
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Met à jour (ou crée) une balise <link rel="..."> unique. */
function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/** Applique les meta SEO complètes (title, description, canonical, Open Graph, robots). */
export function applySeo(path: string) {
  const seo = resolveSeo(path);
  const url = `${SITE_URL}${path === '/' ? '' : path.replace(/\/+$/, '')}`;
  const image = seo.image || DEFAULT_IMAGE;

  document.title = seo.title;
  setMeta('name', 'description', seo.description);
  setMeta('name', 'robots', seo.noindex ? 'noindex, nofollow' : 'index, follow');

  setLink('canonical', url);

  setMeta('property', 'og:title', seo.title);
  setMeta('property', 'og:description', seo.description);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:image', image);
  setMeta('property', 'og:type', path === '/' ? 'website' : 'article');

  setMeta('name', 'twitter:title', seo.title);
  setMeta('name', 'twitter:description', seo.description);
  setMeta('name', 'twitter:image', image);
}
