import { PoolImage } from '../components/PoolImage';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initialServices, initialProjects } from '../data/initialData';
import { QuickQuoteMiniForm } from '../components/QuickQuoteMiniForm';
import {
  Building2,
  Hammer,
  Trees,
  Paintbrush,
  Zap,
  Wrench,
  Droplets,
  BrickWall,
  Leaf,
  Settings,
  Filter,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MessageCircle,
  ChevronDown
} from 'lucide-react';

export const ServicesPage: React.FC<{ serviceSlug?: string }> = ({ serviceSlug }) => {
  const { navigate, getWhatsAppUrl, settings } = useApp();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const getServiceIcon = (iconName: string) => {
    const cls = "w-6 h-6 text-[#0077B6]";
    switch (iconName) {
      case 'BrickWall': return <BrickWall className={cls} />;
      case 'Leaf': return <Leaf className={cls} />;
      case 'Settings': return <Settings className={cls} />;
      case 'Filter': return <Filter className={cls} />;
      case 'Sparkles': return <Sparkles className={cls} />;
      case 'Building2': return <Building2 className={cls} />;
      case 'Hammer': return <Hammer className={cls} />;
      case 'Trees': return <Trees className={cls} />;
      case 'Paintbrush': return <Paintbrush className={cls} />;
      case 'Zap': return <Zap className={cls} />;
      case 'Wrench': return <Wrench className={cls} />;
      default: return <Droplets className={cls} />;
    }
  };

  // If a specific service slug is provided, show that dedicated service landing page
  const activeService = serviceSlug
    ? initialServices.find(s => s.slug === serviceSlug)
    : null;

  if (activeService) {
    const relatedProjects = initialProjects.filter(p => {
      if (activeService.slug === 'construction-piscines') return p.category === 'construction';
      if (activeService.slug === 'renovation-reparation') return p.category === 'renovation';
      if (activeService.slug === 'amenagement-exterieur') return p.category === 'amenagement';
      return true;
    }).slice(0, 2);

    const whatsappText = `Bonjour, je souhaite me renseigner sur votre service : ${activeService.title} pour mon projet.`;

    return (
      <div className="space-y-16 pb-20">
        {/* Service Hero */}
        <section className="bg-gradient-to-b from-[#F0F9FF] via-white to-slate-50 border-b border-slate-200/60 pt-10 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0077B6] uppercase tracking-wider">
                <button onClick={() => navigate('/services')} className="hover:underline">
                  Nos Services
                </button>
                <span aria-hidden="true">/</span>
                <span>{activeService.kicker}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#102A43] tracking-tight leading-tight">
                {activeService.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                {activeService.fullDescription}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/devis')}
                  className="px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-[#0077B6] hover:bg-[#005f94] rounded-xl shadow-sm transition-all"
                >
                  Demander un devis pour ce service
                </button>
                <a
                  href={getWhatsAppUrl(whatsappText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Poser une question sur WhatsApp</span>
                </a>
              </div>
            </div>

            {activeService.image && (
              <div className="mt-10 rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-[21/9]">
                <PoolImage
                  src={activeService.image}
                  alt={activeService.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </section>

        {/* Problems & Solutions Dual Column */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Problèmes fréquents */}
            <div className="bg-rose-50/50 rounded-2xl border border-rose-100 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-base mb-4">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3>Les difficultés courantes rencontrées</h3>
              </div>
              <ul className="space-y-3">
                {activeService.clientProblems.map((prob, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span>{prob}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nos solutions */}
            <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3>La réponse technique SLT SERVICES</h3>
              </div>
              <ul className="space-y-3">
                {activeService.solutions.map((sol, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>{sol}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Prestations détaillées */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-xs font-semibold tracking-wider text-[#0077B6] uppercase">
              Programme d'intervention
            </span>
            <h2 className="text-2xl font-bold text-[#102A43] mt-1">
              Ce que comprend notre prestation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeService.prestations.map((pres, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-[#0077B6] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-800">{pres}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Related Projects if available */}
        {relatedProjects.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50 py-12 rounded-3xl border border-slate-200">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#102A43]">
                  Réalisations associées
                </h3>
                <p className="text-xs text-slate-500 mt-1">Chantiers menés à Marrakech et sa région.</p>
              </div>
              <button
                onClick={() => navigate('/realisations')}
                className="text-xs font-semibold text-[#0077B6] hover:underline"
              >
                Tout voir →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProjects.map(proj => (
                <div
                  key={proj.id}
                  onClick={() => navigate(`/realisations/${proj.slug}`)}
                  className="bg-white p-5 rounded-2xl border border-slate-200 cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-[#0077B6]">{proj.categoryLabel}</span>
                    <span>{proj.location}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">{proj.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Spécifique au service */}
        {activeService.faq && activeService.faq.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-bold text-[#102A43] mb-6">
              Questions fréquentes sur cette prestation
            </h3>
            <div className="space-y-3">
              {activeService.faq.map((item, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900"
                    >
                      <span>{item.question}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 border-t border-slate-100 mt-2">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Formulaire de devis intégré */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuickQuoteMiniForm />
        </section>
      </div>
    );
  }

  // General Services index view
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold tracking-wider text-[#0077B6] uppercase">
          Notre Savoir-faire
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] mt-2">
          Des solutions complètes pour votre piscine
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Une équipe dédiée pour chaque étape de votre projet de construction ou de rénovation, à Marrakech et sa région.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialServices.map(service => (
          <div
            key={service.id}
            onClick={() => navigate(`/services/${service.slug}`)}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-[#0077B6]/50 hover:shadow-md transition-all cursor-pointer group"
          >
            {service.image && (
              <div className="h-40 overflow-hidden">
                <PoolImage
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            )}
            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0077B6] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {getServiceIcon(service.iconName)}
                </div>
                <span className="text-xs font-medium text-[#0077B6] block mb-1">{service.kicker}</span>
                <h3 className="text-lg font-bold text-[#102A43] group-hover:text-[#0077B6] transition-colors mb-2.5">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-6">
                  {service.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0077B6]">
                <span>Consulter la page détaillée</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mini quick quote */}
      <div className="max-w-3xl mx-auto pt-6">
        <QuickQuoteMiniForm />
      </div>
    </div>
  );
};
