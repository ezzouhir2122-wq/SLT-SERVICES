import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Award, Users, CheckCircle, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate, settings } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold tracking-wider text-[#0077B6] uppercase">
          L'Entreprise
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] mt-2">
          À Propos de {settings.companyName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Spécialiste de la conception, de la réhabilitation et de la maintenance technique des piscines et espaces de baignade au Maroc.
        </p>
      </div>

      {/* Presentation */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#102A43]">
          Une expertise dédiée aux exigences du climat marocain
        </h2>
        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Implantée au cœur de Marrakech, à Sidi Ghanem, <strong>{settings.companyName}</strong> est née de la volonté d'apporter une réponse rigoureuse, transparente et pérenne aux propriétaires de villas privées, riads traditionnels et établissements touristiques.
          </p>
          <p>
            Sous le soleil marocain, où les températures estivales dépassent régulièrement 40°C, une piscine ne peut souffrir d'approximations hydrauliques ou d'étanchéités vulnérables. La combinaison d'eaux dures très calcaires et d'un rayonnement solaire intense exige un dimensionnement précis des pompes, des filtres et des revêtements.
          </p>
          <p>
            Nous intervenons sur l'ensemble du cycle de vie du bassin : gros œuvre en béton armé banché, pose de carrelage haut de gamme, rénovation de circuits hydrauliques colmatés, dépannage express et contrats de maintenance sur mesure.
          </p>
        </div>
      </div>

      {/* Nos Engagements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0077B6] flex items-center justify-center mb-4">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-2">Pérennité des Ouvrages</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Nous privilégions le béton armé monolithique et des matériaux éprouvés pour résister aux mouvements de terrain sans microfissures.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0077B6] flex items-center justify-center mb-4">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-2">Transparence Technique</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pas de faux diagnostics ni de remplacements abusifs. Nous vous expliquons chaque point d'usure et proposons la solution la plus rationnelle.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0077B6] flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-2">Accompagnement Suivi</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Un interlocuteur unique joignable et réactif pour vos questions, interventions de maintenance et besoins de réapprovisionnement.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 text-center space-y-4">
        <h3 className="text-xl font-bold text-[#102A43]">Vous avez un projet en tête ?</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Nos techniciens se déplacent sur site pour examiner votre terrain ou votre installation existante.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/devis')}
            className="px-6 py-3 text-xs font-semibold text-white bg-[#0077B6] hover:bg-[#005f94] rounded-xl shadow-xs transition-all inline-flex items-center gap-2"
          >
            <span>Prendre contact avec notre équipe</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
