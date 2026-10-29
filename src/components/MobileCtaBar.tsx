import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, FileText } from 'lucide-react';

export const MobileCtaBar: React.FC = () => {
  const { settings, navigate } = useApp();

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 flex items-center gap-2 shadow-lg">
      <a
        href={`tel:${settings.phone.replace(/\s+/g, '')}`}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
      >
        <Phone className="w-4 h-4 text-[#0077B6]" />
        <span>Appeler</span>
      </a>

      <button
        onClick={() => navigate('/devis')}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold text-white bg-gradient-to-r from-[#0077B6] to-[#00B4D8] rounded-lg shadow-sm"
      >
        <FileText className="w-4 h-4" />
        <span>Devis Gratuit</span>
      </button>
    </div>
  );
};
