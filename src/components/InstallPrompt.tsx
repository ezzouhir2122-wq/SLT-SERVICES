import React, { useEffect, useState } from 'react';
import { Download, X, Share } from 'lucide-react';

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Bandeau d'installation PWA : « Installer l'application ».
 * - Android / desktop Chrome : bouton natif (beforeinstallprompt).
 * - iOS Safari : astuce « Partager → Sur l'écran d'accueil ».
 * Masqué si déjà installé ou si l'utilisateur a fermé le bandeau.
 */
export const InstallPrompt: React.FC = () => {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try { return localStorage.getItem('slt_pwa_dismissed') === '1'; } catch { return false; }
  });

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
    if (standalone) { setDismissed(true); return; }

    const ua = navigator.userAgent || '';
    setIsIOS(/iphone|ipad|ipod/i.test(ua) && !(navigator as any).standalone);

    const onPrompt = (e: Event) => { e.preventDefault(); setDeferred(e as BIPEvent); };
    const onInstalled = () => close();
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const close = () => {
    setDismissed(true);
    try { localStorage.setItem('slt_pwa_dismissed', '1'); } catch { /* ignore */ }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    close();
  };

  if (dismissed) return null;
  if (!deferred && !isIOS) return null; // rien à proposer

  return (
    <div className="bg-[#0077B6] text-white text-sm">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <Download className="w-4 h-4 shrink-0" />
        {deferred ? (
          <>
            <span className="flex-1">Installez l'application SLT SERVICES pour un accès rapide.</span>
            <button onClick={install} className="shrink-0 bg-white text-[#0077B6] font-semibold rounded-lg px-3 py-1.5 text-xs hover:bg-slate-100">
              Installer
            </button>
          </>
        ) : (
          <span className="flex-1 flex items-center gap-1.5 flex-wrap">
            Pour installer l'app : appuyez sur <Share className="w-3.5 h-3.5 inline" /> <strong>Partager</strong> puis <strong>« Sur l'écran d'accueil »</strong>.
          </span>
        )}
        <button onClick={close} aria-label="Fermer" className="shrink-0 text-white/80 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
