/** Enregistre le service worker (production uniquement, après chargement). */
export function registerServiceWorker() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (!import.meta.env.PROD) return; // évite les soucis de cache en dev

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('[PWA] Enregistrement du service worker échoué :', err);
    });
  });
}
