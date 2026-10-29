import React from 'react';
import { useApp } from '../context/AppContext';

export const MentionsLegalesPage: React.FC = () => {
  const { settings } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-xs font-semibold text-[#0077B6] uppercase">Juridique</span>
        <h1 className="text-3xl font-extrabold text-[#102A43] mt-1">Mentions Légales</h1>
        <p className="text-xs text-slate-500 mt-1">Dernière mise à jour : 2026</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">1. Éditeur de la Plateforme</h2>
          <p>
            Le présent site internet est édité par la société <strong>{settings.companyName} SARL</strong>, société à responsabilité limitée de droit marocain.
          </p>
          <ul className="mt-2 space-y-1 text-slate-600">
            <li><strong>Forme juridique :</strong> Société à Responsabilité Limitée (SARL)</li>
            <li><strong>Capital social :</strong> 1 000 000,00 MAD</li>
            <li><strong>Activité :</strong> Entrepreneur de travaux divers ou constructions</li>
            <li><strong>Siège social :</strong> {settings.address}</li>
            <li><strong>Téléphone :</strong> {settings.phone}{settings.phoneSecondary ? ` / ${settings.phoneSecondary}` : ''}</li>
            <li><strong>Courrier électronique :</strong> {settings.email}</li>
            <li><strong>Zone d'activité :</strong> Marrakech et région Marrakech-Safi</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">2. Hébergement Web</h2>
          <p>
            L'hébergement de l'application est assuré sur infrastructure sécurisée Cloud avec redondance et sauvegardes automatiques conformes aux standards de sécurité en vigueur.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">3. Propriété Intellectuelle</h2>
          <p>
            L'ensemble des éléments graphiques, photographies témoins, schémas techniques, textes et logos figurant sur ce site sont la propriété exclusive de {settings.companyName} ou font l'objet d'une licence d'utilisation. Toute reproduction, même partielle, sans autorisation préalable est strictement prohibée.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">4. Responsabilité & Conseils Techniques</h2>
          <p>
            Les articles de blog, simulateurs et fiches informatives ont une vocation purement consultative. Une visite technique sur place par un professionnel qualifié est indispensable pour valider tout dimensionnement technique ou structurel.
          </p>
        </div>
      </div>
    </div>
  );
};
