import React from 'react';
import { useApp } from '../context/AppContext';

export const ConfidentialitePage: React.FC = () => {
  const { settings } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-xs font-semibold text-[#0077B6] uppercase">Protection des Données</span>
        <h1 className="text-3xl font-extrabold text-[#102A43] mt-1">Politique de Confidentialité</h1>
        <p className="text-xs text-slate-500 mt-1">Conformité Loi 09-08 (CNDP Maroc)</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">1. Traitement des Données Personnelles</h2>
          <p>
            Conformément à la loi n° 09-08 promulguée par le Dahir 1-09-15 du 18 février 2009 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel au Maroc, vous êtes informé(e) que les données recueillies via les formulaires de devis, dépannage et contact font l'objet d'un traitement informatique destiné à répondre aux sollicitations commerciales et techniques.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">2. Finalité de la Collecte</h2>
          <p>
            Les données collectées (nom, téléphone, adresse email, localisation géographique, caractéristiques du bassin) sont strictement réservées aux services internes de <strong>{settings.companyName}</strong> pour :
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
            <li>L'établissement et le chiffrage d'études techniques et devis.</li>
            <li>La planification d'interventions de dépannage ou de maintenance.</li>
            <li>Le suivi commercial et la relation client.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">3. Non-Cession des Données</h2>
          <p>
            Vos informations personnelles ne sont en aucun cas cédées, vendues, louées ou transmises à des tiers à des fins de prospection publicitaire.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">4. Droit d'Accès, de Rectification et d'Opposition</h2>
          <p>
            Conformément à la loi n° 09-08, vous disposez d'un droit d'accès, de rectification et d'opposition sur vos données personnelles. Vous pouvez exercer ce droit à tout moment en adressant un email à : <strong>{settings.email}</strong> ou par courrier postal à notre siège de Marrakech.
          </p>
        </div>
      </div>
    </div>
  );
};
