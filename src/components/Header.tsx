import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Menu, X, PhoneCall, Shield } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentPath, navigate, settings, getWhatsAppUrl, adminToken } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Réalisations', path: '/realisations' },
    { label: 'Prestations', path: '/equipements' },
    { label: 'Dépannage', path: '/depannage' },
    { label: 'Maintenance', path: '/maintenance' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark & building icon */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-left focus:outline-none group whitespace-nowrap shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-white shadow-sm shadow-[#0077B6]/20">
            <svg
              className="w-6 h-6 transform group-hover:scale-105 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18" />
              <path d="M6 21V7l6-3 6 3v14" />
              <path d="M10 21v-6h4v6" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#102A43] group-hover:text-[#0077B6] transition-colors block">
              {settings.companyName || 'SLT SERVICES'}
            </span>
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#0077B6] uppercase block -mt-0.5">
              Travaux & Construction
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map(link => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#0077B6] font-semibold'
                    : 'hover:text-[#0077B6]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0077B6] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <a
            href={getWhatsAppUrl("Bonjour, je souhaite échanger directement avec votre équipe.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap shrink-0 border border-emerald-200/60"
            title="Discuter sur WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={() => navigate('/devis')}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#0077B6] to-[#0096C7] hover:from-[#006094] hover:to-[#0077B6] rounded-lg shadow-sm hover:shadow-md transition-all whitespace-nowrap shrink-0"
          >
            Demander un devis
          </button>

          {adminToken && (
            <button
              onClick={() => navigate('/admin')}
              className="p-2 text-slate-500 hover:text-[#0077B6] rounded-lg hover:bg-slate-100 transition-colors"
              title="Tableau de bord CRM"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => navigate('/devis')}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0077B6] rounded-md whitespace-nowrap"
          >
            Devis
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Menu principal"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in fade-in duration-150">
          <nav className="flex flex-col space-y-2">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPath === link.path
                    ? 'bg-[#EBF7FD] text-[#0077B6] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contacter sur WhatsApp</span>
              </a>
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
              >
                <PhoneCall className="w-4 h-4 text-slate-600" />
                <span>Appeler {settings.phone}</span>
              </a>
              <button
                onClick={() => {
                  navigate('/admin');
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-slate-400 py-1 text-center hover:text-slate-600"
              >
                Accès Espace Administrateur
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
