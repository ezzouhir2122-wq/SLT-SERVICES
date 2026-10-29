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
          Entreprise de bâtiment spécialisée dans la construction, la rénovation et les travaux tous corps d'état à Marrakech et sa région.
        </p>
      </div>

      {/* Presentation */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#102A43]">
          Une entreprise de travaux au service de vos projets
        </h2>
        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Implantée au Quartier Industriel Sidi Ghanem à Marrakech, <strong>{settings.companyName} SARL</strong> accompagne particuliers, promoteurs, syndics et professionnels dans leurs projets de construction et de rénovation, avec rigueur, transparence et respect des délais.
          </p>
          <p>
            Entreprise de travaux divers et de construction, nous coordonnons l'ensemble des corps d'état — du gros œuvre aux finitions — afin de vous offrir un interlocuteur unique du premier coup de pelle à la réception de votre chantier.
          </p>
          <p>
            Nous intervenons sur l'ensemble du cycle du bâtiment : gros œuvre en béton armé, second œuvre et finitions, électricité et plomberie, aménagement extérieur, ainsi que la maintenance et les travaux divers.
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
            Nous privilégions le béton armé et des matériaux éprouvés, mis en œuvre selon les règles de l'art pour des ouvrages durables.
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
            Un interlocuteur unique joignable et réactif pour le suivi de chantier, la maintenance et vos besoins complémentaires.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 text-center space-y-4">
        <h3 className="text-xl font-bold text-[#102A43]">Vous avez un projet en tête ?</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Nos équipes se déplacent sur site pour examiner votre terrain ou votre bâtiment existant et établir un devis.
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
