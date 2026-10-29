import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initialServices, initialProducts, initialProjects, initialFAQ, initialTestimonials } from '../data/initialData';
import { InteractiveBeforeAfter } from '../components/InteractiveBeforeAfter';
import { QuickQuoteMiniForm } from '../components/QuickQuoteMiniForm';
import {
  Building2,
  Hammer,
  Trees,
  Paintbrush,
  Zap,
  Wrench,
  Check,
  ChevronDown,
  ArrowRight,
  MessageCircle,
  FileText
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate, getWhatsAppUrl, settings } = useApp();
  const [projectFilter, setProjectFilter] = useState<'all' | 'construction' | 'renovation' | 'amenagement'>('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const getServiceIcon = (iconName: string) => {
    const cls = "w-6 h-6 text-[#0077B6]";
    switch (iconName) {
      case 'Building2': return <Building2 className={cls} />;
      case 'Hammer': return <Hammer className={cls} />;
      case 'Trees': return <Trees className={cls} />;
      case 'Paintbrush': return <Paintbrush className={cls} />;
      case 'Zap': return <Zap className={cls} />;
      case 'Wrench': return <Wrench className={cls} />;
      default: return <Building2 className={cls} />;
    }
  };

  const filteredProjects = projectFilter === 'all'
    ? initialProjects
    : initialProjects.filter(p => p.category === projectFilter);

  return (
    <div className="space-y-20 pb-20">
      {/* SECTION 2: HERO PREMIUM */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 bg-gradient-to-b from-[#F0F9FF] via-[#F8FAFC] to-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Col: Value proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0077B6] uppercase">
                <span>Marrakech & Région</span>
                <span aria-hidden="true">·</span>
                <span>Construction & Travaux divers</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#102A43] tracking-tight leading-[1.12]">
                Vos travaux, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0077B6] to-[#00B4D8]">
                  notre expertise.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Construction, rénovation, aménagement et travaux tous corps d'état à Marrakech. Du gros œuvre aux finitions, nous donnons vie à vos projets de bâtiment.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/devis')}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-[#0077B6] hover:bg-[#005f94] rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Obtenir mon devis gratuit</span>
                </button>

                <button
                  onClick={() => navigate('/realisations')}
                  className="px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Découvrir nos réalisations</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* 3 Avantages clés */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#0077B6] shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="font-medium text-slate-800">Tous corps d'état</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#0077B6] shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="font-medium text-slate-800">Interlocuteur unique</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#0077B6] shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="font-medium text-slate-800">Devis gratuit & clair</span>
                </div>
              </div>
            </div>

            {/* Right Col: Visual Carrier (photo chantier / bâtiment) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3]">
                <img
                  src={settings.heroImage}
                  alt="Chantier de construction SLT SERVICES à Marrakech"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/50 via-transparent to-transparent" />

                {/* Overlaid trust badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-slate-200/90 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      100%
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Étude & devis sur place</p>
                      <p className="text-[11px] text-slate-500">Marrakech & région</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/devis')}
                    className="text-xs font-semibold text-[#0077B6] hover:underline"
                  >
                    Consulter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: NOS EXPERTISES (6 Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-wider text-[#0077B6] uppercase">
            Services Complets
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#102A43] mt-2">
            Nos Domaines d'Intervention
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Du gros œuvre aux finitions, en passant par la rénovation et la maintenance de vos bâtiments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialServices.map(service => (
            <div
              key={service.id}
              onClick={() => navigate(`/services/${service.slug}`)}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:border-[#00B4D8]/60 hover:shadow-md transition-all cursor-pointer group flex flex-col"
            >
              {service.image && (
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-[#0077B6]/10 flex items-center justify-center transition-colors mb-5">
                    {getServiceIcon(service.iconName)}
                  </div>

                  <div className="text-xs font-medium text-[#0077B6] mb-1">
                    {service.kicker}
                  </div>
                  <h3 className="text-lg font-bold text-[#102A43] group-hover:text-[#0077B6] transition-colors mb-2.5">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0077B6]">
                  <span>Découvrir la prestation</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: POURQUOI NOUS CHOISIR */}
      <section className="bg-slate-50/80 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-semibold tracking-wider text-[#0077B6] uppercase">
                Garantie de Sérénité
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#102A43]">
                Pourquoi confier vos travaux à SLT SERVICES ?
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Construire ou rénover à Marrakech impose rigueur technique et coordination. Nous pilotons l'ensemble de vos travaux, du premier coup de pelle aux finitions, avec un seul interlocuteur responsable.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/a-propos')}
                  className="text-xs font-semibold text-[#0077B6] hover:text-[#005f94] flex items-center gap-1.5"
                >
                  <span>En savoir plus sur notre démarche</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 mb-1">Un interlocuteur unique</h4>
                <p className="text-xs text-slate-600">
                  De la première visite au suivi de chantier, un seul référent coordonne l'ensemble des corps d'état.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 mb-1">Étude & devis détaillé</h4>
                <p className="text-xs text-slate-600">
                  Nous analysons votre projet et votre terrain, puis remettons un devis clair, poste par poste.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 mb-1">Qualité & conformité</h4>
                <p className="text-xs text-slate-600">
                  Béton armé conforme, matériaux traçables et respect des normes de sécurité sur chaque chantier.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 mb-1">Particuliers & Professionnels</h4>
                <p className="text-xs text-slate-600">
                  Villas, immeubles, locaux et contrats de maintenance pour syndics et entreprises.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: NOS RÉALISATIONS AVEC FILTRES & AVANT/APRÈS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#0077B6] uppercase">
              Portfolio
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#102A43] mt-1">
              Nos Réalisations Récentes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Exemples de chantiers menés à Marrakech et ses environs (projets témoins et réalisations).
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            <button
              onClick={() => setProjectFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                projectFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setProjectFilter('construction')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                projectFilter === 'construction'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Construction
            </button>
            <button
              onClick={() => setProjectFilter('renovation')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                projectFilter === 'renovation'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rénovation
            </button>
            <button
              onClick={() => setProjectFilter('amenagement')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                projectFilter === 'amenagement'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aménagement
            </button>
          </div>
        </div>

        {/* Before / After Highlight Module */}
        <div className="mb-12 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8">
          <InteractiveBeforeAfter />
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              onClick={() => navigate(`/realisations/${project.slug}`)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="h-44 relative overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0077B6]/90 via-[#00B4D8]/80 to-[#CAF0F8]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/70 via-transparent to-transparent" />
                <div className="relative h-full p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-medium text-white">
                    <span className="bg-[#102A43]/70 backdrop-blur-md px-2.5 py-1 rounded-md">
                      {project.categoryLabel}
                    </span>
                    <span className="text-white/90">{project.location}</span>
                  </div>
                  <div className="text-white">
                    <span className="text-[11px] font-mono opacity-90">{project.dimensions || 'Sur mesure'}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#102A43] group-hover:text-[#0077B6] transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {project.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] text-slate-400">Projet témoin</span>
                  <span className="font-semibold text-[#0077B6] group-hover:underline">Voir les détails →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: NOS PRESTATIONS & MATÉRIAUX */}
      <section className="bg-slate-50/80 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold tracking-wider text-[#0077B6] uppercase">
                Prestations & Matériaux
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#102A43] mt-1">
                Nos Prestations les plus demandées
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Prestations du bâtiment chiffrées, du gros œuvre aux finitions. Tarifs indicatifs, devis précis après visite.
              </p>
            </div>
            <button
              onClick={() => navigate('/equipements')}
              className="text-xs font-semibold text-[#0077B6] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Voir toutes les prestations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {initialProducts.filter(p => p.featured).slice(0, 4).map(product => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                {product.image && (
                  <div
                    onClick={() => navigate(`/equipements/${product.slug}`)}
                    className="h-36 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                      <span>{product.brand}</span>
                      <span className="font-mono text-slate-400">{product.reference}</span>
                    </div>

                    <h3
                      onClick={() => navigate(`/equipements/${product.slug}`)}
                      className="text-sm font-bold text-[#102A43] hover:text-[#0077B6] cursor-pointer transition-colors mb-2 line-clamp-2"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div>
                    <div className="py-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {product.price
                          ? `${product.price.toLocaleString('fr-FR')} MAD/m² HT`
                          : 'Prix sur devis'}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-medium">Disponible</span>
                    </div>

                    <div className="pt-2 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => navigate(`/equipements/${product.slug}`)}
                        className="w-full py-2 text-center text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Détails
                      </button>
                      <a
                        href={getWhatsAppUrl(`Bonjour, je souhaite un devis pour la prestation : ${product.name} (Réf : ${product.reference})`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 flex items-center justify-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: DEVIS RAPIDE MINI-FORM */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuickQuoteMiniForm />
      </section>

      {/* SECTION 8: PROCESSUS DE TRAVAIL (4 ÉTAPES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-wider text-[#0077B6] uppercase">
            Méthodologie
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#102A43] mt-2">
            Un Déroulement Clair en 4 Étapes
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            De la définition de vos besoins à la réception de votre chantier, en toute sérénité.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 relative">
            <span className="text-3xl font-extrabold text-[#0077B6]/20 block mb-2 font-mono">01</span>
            <h4 className="text-base font-bold text-slate-900 mb-2">Décrivez votre besoin</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Via notre formulaire, WhatsApp ou par téléphone, précisez la nature de votre projet de travaux.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 relative">
            <span className="text-3xl font-extrabold text-[#0077B6]/20 block mb-2 font-mono">02</span>
            <h4 className="text-base font-bold text-slate-900 mb-2">Visite & étude</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visite technique sur place pour analyser l'accès, l'état du bâti ou du terrain et relever les mesures.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 relative">
            <span className="text-3xl font-extrabold text-[#0077B6]/20 block mb-2 font-mono">03</span>
            <h4 className="text-base font-bold text-slate-900 mb-2">Devis détaillé</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Remise d'un devis clair poste par poste, avec choix des matériaux et planning prévisionnel.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 relative">
            <span className="text-3xl font-extrabold text-[#0077B6]/20 block mb-2 font-mono">04</span>
            <h4 className="text-base font-bold text-slate-900 mb-2">Réalisation & suivi</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Exécution soignée des travaux, suivi de chantier régulier et réception avec vous.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9: TÉMOIGNAGES */}
      <section className="bg-slate-50/80 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold tracking-wider text-[#0077B6] uppercase">
              Retours d'Expérience
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#102A43] mt-2">
              Ce que disent nos clients
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Avis recueillis auprès de particuliers et professionnels accompagnés à Marrakech.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {initialTestimonials.map(t => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3 text-xs">
                    {'★'.repeat(t.rating)}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-6">
                    « {t.content} »
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{t.name}</p>
                  <p className="text-[11px] text-slate-500">{t.role} · {t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: FAQ SEO */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-wider text-[#0077B6] uppercase">
            Questions Fréquentes
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#102A43] mt-1">
            Tout savoir sur nos prestations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Réponses aux questions les plus fréquentes sur nos travaux de construction et de rénovation.
          </p>
        </div>

        <div className="space-y-3">
          {initialFAQ.map(faq => {
            const isOpen = expandedFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-sm font-semibold text-slate-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transform transition-transform shrink-0 ${
                      isOpen ? 'rotate-180 text-[#0077B6]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 11: CTA FINAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#102A43] via-[#0077B6] to-[#005f94] rounded-3xl p-8 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Un projet de travaux ? Parlons-en.
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Que ce soit pour construire, rénover un bien ou réaliser des travaux divers, nos équipes sont à votre écoute pour une étude personnalisée et un devis gratuit.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/devis')}
                className="w-full sm:w-auto px-7 py-3.5 bg-white text-[#102A43] hover:bg-blue-50 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#0077B6]" />
                <span>Demander mon devis</span>
              </button>
              <a
                href={getWhatsAppUrl("Bonjour, je souhaite échanger au sujet de mon projet de travaux.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuter sur WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
