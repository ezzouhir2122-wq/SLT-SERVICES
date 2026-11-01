import React, { useEffect, useState } from 'react';
import { Download, X, Share, ExternalLink } from 'lucide-react';

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Bandeau d'installation PWA « Installer l'application ».
 *
 * Gère le cas clé : lien ouvert depuis WhatsApp (navigateur intégré) où
 * l'installation est impossible → on propose de rouvrir dans Chrome (Android)
 * ou Safari (iOS), puis le bouton d'installation natif prend le relais.
 */
export const InstallPrompt: React.FC = () => {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [env, setEnv] = useState<{ isAndroid: boolean; isIOS: boolean; inApp: boolean; standalone: boolean }>({
    isAndroid: false, isIOS: false, inApp: false, standalone: true,
  });
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try { return sessionStorage.getItem('slt_pwa_hide') === '1'; } catch { return false; }
  });

  useEffect(() => {
    const ua = navigator.userAgent || '';
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
    const isAndroid = /android/i.test(ua);
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    // Navigateurs intégrés (WhatsApp, Facebook, Instagram, Messenger, WebView Android…)
    const inApp = /\bFBAN|FBAV|FB_IAB|Instagram|Messenger|Line\/|WhatsApp|MicroMessenger/i.test(ua) || /;\s?wv\)/.test(ua);
    setEnv({ isAndroid, isIOS, inApp, standalone });

    const onPrompt = (e: Event) => { e.preventDefault(); setDeferred(e as BIPEvent); };
    const onInstalled = () => hide();
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const hide = () => {
    setDismissed(true);
    try { sessionStorage.setItem('slt_pwa_hide', '1'); } catch { /* ignore */ }
  };

  const nativeInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    hide();
  };

  // Rouvre l'URL courante dans Chrome (Android) depuis un navigateur intégré.
  const openInChrome = () => {
    const { host, pathname, search } = window.location;
    window.location.href = `intent://${host}${pathname}${search}#Intent;scheme=https;package=com.android.chrome;end`;
  };

  if (dismissed || env.standalone) return null;

  // 1) Dans WhatsApp / navigateur intégré → impossible d'installer : rediriger vers le vrai navigateur.
  if (env.inApp) {
    return (
      <Bar onClose={hide}>
        {env.isIOS ? (
          <span className="flex-1 flex items-center gap-1.5 flex-wrap">
            Pour installer l'app : menu <strong>···</strong> en bas → <strong>« Ouvrir dans Safari »</strong>, puis <Share className="w-3.5 h-3.5 inline" /> Partager → <strong>Sur l'écran d'accueil</strong>.
          </span>
        ) : (
          <>
            <span className="flex-1">Installez l'application SLT SERVICES sur votre téléphone.</span>
            <button onClick={openInChrome} className="shrink-0 inline-flex items-center gap-1.5 bg-white text-[#0077B6] font-semibold rounded-lg px-3 py-1.5 text-xs hover:bg-slate-100">
              <ExternalLink className="w-3.5 h-3.5" /> Ouvrir dans Chrome
            </button>
          </>
        )}
      </Bar>
    );
  }

  // 2) Vrai navigateur compatible (Chrome/Edge Android & desktop) → bouton d'installation natif.
  if (deferred) {
    return (
      <Bar onClose={hide}>
        <span className="flex-1">Installez l'application SLT SERVICES pour un accès rapide.</span>
        <button onClick={nativeInstall} className="shrink-0 inline-flex items-center gap-1.5 bg-white text-[#0077B6] font-semibold rounded-lg px-3 py-1.5 text-xs hover:bg-slate-100">
          <Download className="w-3.5 h-3.5" /> Installer
        </button>
      </Bar>
    );
  }

  // 3) iOS Safari (hors app) → méthode « Sur l'écran d'accueil ».
  if (env.isIOS) {
    return (
      <Bar onClose={hide}>
        <span className="flex-1 flex items-center gap-1.5 flex-wrap">
          Pour installer l'app : <Share className="w-3.5 h-3.5 inline" /> <strong>Partager</strong> → <strong>« Sur l'écran d'accueil »</strong>.
        </span>
      </Bar>
    );
  }

  return null;
};

const Bar: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({ onClose, children }) => (
  <div className="bg-[#0077B6] text-white text-sm">
    <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3">
      <Download className="w-4 h-4 shrink-0" />
      {children}
      <button onClick={onClose} aria-label="Fermer" className="shrink-0 text-white/80 hover:text-white p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);
