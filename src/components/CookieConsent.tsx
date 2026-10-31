import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getConsent, setConsent, ensureGaLoaded } from '../lib/analytics';

/**
 * Bandeau de consentement cookies (RGPD / CNDP Maroc).
 * S'affiche tant qu'aucune décision n'a été prise. L'acceptation déclenche
 * le chargement de Google Analytics via le measurementId fourni.
 */
export const CookieConsent: React.FC<{ measurementId: string }> = ({ measurementId }) => {
  const { navigate } = useApp();
  const [visible, setVisible] = useState<boolean>(() => getConsent() === null);

  if (!visible) return null;

  const accept = () => {
    setConsent('granted');
    if (measurementId) ensureGaLoaded(measurementId);
    setVisible(false);
  };
  const refuse = () => {
    setConsent('denied');
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Consentement cookies"
      className="fixed bottom-0 inset-x-0 z-[60] p-4 sm:p-5 bg-[#102A43] text-white shadow-2xl border-t border-white/10"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm leading-relaxed flex-1">
          Nous utilisons des cookies de mesure d'audience pour améliorer votre expérience et nos services.
          Vous pouvez accepter ou refuser.{' '}
          <button
            onClick={() => { setVisible(false); navigate('/confidentialite'); }}
            className="underline text-[#90E0EF] hover:text-white"
          >
            En savoir plus
          </button>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={refuse}
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-white/30 hover:bg-white/10 transition"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#00B4D8] hover:bg-[#0096c7] text-[#03233a] transition"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
};
