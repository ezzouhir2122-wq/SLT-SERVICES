import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppFloating: React.FC = () => {
  const { currentPath, params, getWhatsAppUrl, settings } = useApp();
  const [minimized, setMinimized] = useState(false);

  // Dynamic contextual message depending on the current page
  let contextualMessage = `Bonjour ${settings.companyName}, je souhaite me renseigner sur vos prestations de travaux.`;

  if (currentPath === '/devis') {
    contextualMessage = "Bonjour, je souhaite obtenir une étude chiffrée pour un projet de travaux.";
  } else if (currentPath === '/depannage') {
    contextualMessage = "Bonjour, j'ai besoin d'une intervention rapide pour des travaux divers ou une urgence bâtiment (infiltration, fissure, panne…).";
  } else if (currentPath === '/maintenance') {
    contextualMessage = "Bonjour, je souhaite recevoir une proposition pour un contrat de maintenance de bâtiment.";
  } else if (currentPath.includes('/services/gros-oeuvre-construction')) {
    contextualMessage = "Bonjour, je souhaite obtenir un devis pour un projet de construction / gros œuvre.";
  } else if (currentPath.includes('/services/renovation-rehabilitation')) {
    contextualMessage = "Bonjour, je souhaite des conseils et un devis pour un projet de rénovation.";
  } else if (currentPath.includes('/services/')) {
    contextualMessage = "Bonjour, je souhaite un devis pour des travaux (construction, rénovation, finitions…).";
  } else if (currentPath.startsWith('/equipements') && params?.slug) {
    contextualMessage = `Bonjour, je souhaite un devis pour la prestation : ${params.name || params.slug}`;
  }

  const whatsappHref = getWhatsAppUrl(contextualMessage);

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-20 sm:bottom-6 right-6 z-40 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-700 transition-transform hover:scale-105"
        title="Ouvrir WhatsApp"
        aria-label="Ouvrir WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-end gap-2">
      <div className="hidden md:flex items-center bg-white border border-slate-200/90 shadow-xl rounded-2xl p-3 pr-4 max-w-xs text-xs text-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="flex-1">
          <p className="font-semibold text-slate-900 mb-0.5">Besoin d'un conseil rapide ?</p>
          <p className="text-slate-500 line-clamp-1">Échangez directement sur WhatsApp avec notre équipe technique.</p>
        </div>
        <button
          onClick={() => setMinimized(true)}
          className="text-slate-400 hover:text-slate-600 p-1 ml-1"
          aria-label="Réduire"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300"
        aria-label="Contacter sur WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
};
