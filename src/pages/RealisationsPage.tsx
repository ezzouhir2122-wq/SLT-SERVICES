import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initialProjects } from '../data/initialData';
import { InteractiveBeforeAfter } from '../components/InteractiveBeforeAfter';
import { ProjectItem } from '../types';
import { MapPin, ArrowRight, Check, X } from 'lucide-react';

export const RealisationsPage: React.FC<{ projectSlug?: string }> = ({ projectSlug }) => {
  const { navigate } = useApp();
  const [filter, setFilter] = useState<'all' | 'construction' | 'renovation' | 'amenagement'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(() => {
    if (projectSlug) {
      return initialProjects.find(p => p.slug === projectSlug) || null;
    }
    return null;
  });

  const filtered = filter === 'all'
    ? initialProjects
    : initialProjects.filter(p => p.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold tracking-wider text-[#0077B6] uppercase">
          Galerie & Savoir-faire
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] mt-2">
          Nos Réalisations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Découvrez une sélection de nos chantiers : constructions neuves, rénovations et aménagements extérieurs à Marrakech et sa région.
        </p>
      </div>

      {/* Before / After renovation highlight */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        <InteractiveBeforeAfter
          title="Zoom Rénovation : Avant / Après"
          subtitle="Transformation d'un bien ancien en espace moderne : reprise du bâti, mise aux normes et finitions neuves."
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit mx-auto overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tous les projets
        </button>
        <button
          onClick={() => setFilter('construction')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            filter === 'construction' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Construction neuve
        </button>
        <button
          onClick={() => setFilter('renovation')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            filter === 'renovation' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Rénovation
        </button>
        <button
          onClick={() => setFilter('amenagement')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            filter === 'amenagement' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Aménagement extérieur
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(project => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="h-48 relative overflow-hidden">
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
              <div className="relative h-full p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-medium text-white">
                  <span className="bg-[#102A43]/70 backdrop-blur-md px-2.5 py-1 rounded-md">
                    {project.categoryLabel}
                  </span>
                  <span className="flex items-center gap-1 text-white/90">
                    <MapPin className="w-3.5 h-3.5 text-[#90E0EF]" />
                    <span>{project.location}</span>
                  </span>
                </div>
                <div className="text-white text-xs font-mono opacity-90">
                  {project.dimensions || 'Sur mesure'}
                </div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#102A43] group-hover:text-[#0077B6] transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {project.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Projet de démonstration</span>
                <span className="font-semibold text-[#0077B6] group-hover:underline flex items-center gap-1">
                  <span>Détails du chantier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-semibold text-[#0077B6] uppercase">
                  {selectedProject.categoryLabel} · {selectedProject.location}
                </span>
                <h3 className="text-xl font-bold text-[#102A43] mt-1">
                  {selectedProject.title}
                </h3>
                {selectedProject.dimensions && (
                  <p className="text-xs font-mono text-slate-500 mt-0.5">
                    Dimensions : {selectedProject.dimensions}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedProject.hasBeforeAfter && selectedProject.beforeImage && selectedProject.afterImage ? (
              <div className="mb-6">
                <InteractiveBeforeAfter
                  title=""
                  subtitle=""
                  beforeImage={selectedProject.beforeImage}
                  afterImage={selectedProject.afterImage}
                  beforeLabel={selectedProject.beforeLabel || 'Avant travaux'}
                  afterLabel={selectedProject.afterLabel || 'Après travaux'}
                />
              </div>
            ) : (
              selectedProject.image && (
                <div className="rounded-2xl overflow-hidden mb-6 aspect-[16/9] border border-slate-200">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )
            )}

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              {selectedProject.description}
            </p>

            {/* Key points */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 mb-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Interventions & Spécifications réalisées :
              </h4>
              <ul className="space-y-2">
                {selectedProject.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Chantier témoin réalisé sous maîtrise d'œuvre conforme aux règles de l'art
              </span>
              <button
                onClick={() => {
                  setSelectedProject(null);
                  navigate('/devis');
                }}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-[#0077B6] hover:bg-[#005f94] rounded-xl shadow-xs"
              >
                Demander un devis similaire
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
