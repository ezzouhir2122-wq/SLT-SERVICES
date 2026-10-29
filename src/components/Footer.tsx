import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, Clock, MessageCircle, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, settings, getWhatsAppUrl } = useApp();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#102A43] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Presentation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-white">
                <svg
                  className="w-5 h-5"
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
              <span className="text-xl font-bold tracking-tight text-white">
                {settings.companyName}
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Construction, rénovation, aménagement et travaux tous corps d'état. Entreprise de bâtiment basée au Quartier Industriel Sidi Ghanem, intervenant sur Marrakech et sa région.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={getWhatsAppUrl("Bonjour, je souhaite échanger avec un conseiller.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 rounded-lg border border-emerald-800/60 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Assistance WhatsApp directe</span>
              </a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Prestations
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => navigate('/services/gros-oeuvre-construction')}
                  className="hover:text-white transition-colors text-left"
                >
                  Gros œuvre & Construction
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/services/renovation-rehabilitation')}
                  className="hover:text-white transition-colors text-left"
                >
                  Rénovation & Réhabilitation
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/services/amenagement-exterieur')}
                  className="hover:text-white transition-colors text-left"
                >
                  Aménagement extérieur
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/services/second-oeuvre-finitions')}
                  className="hover:text-white transition-colors text-left"
                >
                  Second œuvre & Finitions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/services/electricite-plomberie')}
                  className="hover:text-white transition-colors text-left"
                >
                  Électricité & Plomberie
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/depannage')}
                  className="hover:text-white transition-colors text-left text-[#00B4D8]"
                >
                  Travaux divers & Urgences
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Liens Utiles & Catalogue */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => navigate('/equipements')}
                  className="hover:text-white transition-colors text-left"
                >
                  Nos prestations
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/realisations')}
                  className="hover:text-white transition-colors text-left"
                >
                  Nos réalisations
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/maintenance')}
                  className="hover:text-white transition-colors text-left"
                >
                  Contrats d'entretien
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/blog')}
                  className="hover:text-white transition-colors text-left"
                >
                  Conseils & Guides techniques
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/a-propos')}
                  className="hover:text-white transition-colors text-left"
                >
                  À propos de nous
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/devis')}
                  className="hover:text-white transition-colors text-left font-medium text-[#90E0EF]"
                >
                  Demander un devis en ligne
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Coordonnées & Horaires */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Contact & Agence
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00B4D8] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00B4D8] shrink-0" />
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
              {settings.phoneSecondary && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#00B4D8] shrink-0" />
                  <a href={`tel:${settings.phoneSecondary.replace(/\s+/g, '')}`} className="hover:text-white">
                    {settings.phoneSecondary}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00B4D8] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#00B4D8] shrink-0 mt-0.5" />
                <span>{settings.openingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div>
            © {currentYear} {settings.companyName} SARL. Tous droits réservés. Construction & travaux à Marrakech.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/mentions-legales')}
              className="hover:text-white transition-colors"
            >
              Mentions Légales
            </button>
            <button
              onClick={() => navigate('/confidentialite')}
              className="hover:text-white transition-colors"
            >
              Confidentialité (CNDP)
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-400 hover:text-[#90E0EF]"
              title="Accès administration"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Espace Pro</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
