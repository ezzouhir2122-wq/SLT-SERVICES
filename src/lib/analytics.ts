/**
 * Google Analytics 4 avec consentement (RGPD / CNDP Maroc).
 * GA n'est chargé QUE si l'utilisateur a accepté les cookies ET qu'un
 * identifiant de mesure (G-XXXXXXXXXX) est configuré.
 *
 * L'ID provient des paramètres société (settings.gaMeasurementId, éditable
 * dans le dashboard admin) ou de la variable d'env VITE_GA_ID.
 */

const CONSENT_KEY = 'slt_cookie_consent';

type Consent = 'granted' | 'denied' | null;

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function getConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: 'granted' | 'denied') {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* stockage indisponible : on ignore */
  }
}

let loadedId: string | null = null;

/** Résout l'ID GA4 depuis les settings ou l'env. */
export function resolveGaId(settingsId?: string): string {
  const id = (settingsId || import.meta.env.VITE_GA_ID || '').trim();
  return /^G-[A-Z0-9]+$/i.test(id) ? id : '';
}

/** Charge GA4 une seule fois, si le consentement est accordé. */
export function ensureGaLoaded(measurementId: string) {
  if (!measurementId || loadedId === measurementId) return;
  if (getConsent() !== 'granted') return;
  if (typeof document === 'undefined') return;

  loadedId = measurementId;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  // anonymize_ip pour la conformité ; pas d'envoi auto de page_view (SPA).
  window.gtag('config', measurementId, { anonymize_ip: true, send_page_view: false });
}

/** Envoie une vue de page (routeur SPA). */
export function trackPageView(path: string, title?: string) {
  if (!loadedId || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
}

/** Envoie un événement GA4 personnalisé (ex. generate_lead). */
export function trackEvent(name: string, params: Record<string, any> = {}) {
  if (!loadedId || !window.gtag) return;
  window.gtag('event', name, params);
}
