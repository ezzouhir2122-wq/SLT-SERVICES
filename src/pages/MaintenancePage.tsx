import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initialMaintenancePlans } from '../data/initialData';
import { Check, ShieldCheck, MessageCircle, FileText, Calendar } from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const { navigate, getWhatsAppUrl, submitLead, settings } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<string>('Formule Sérénité Particulier');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Marrakech (Palmeraie)',
    propertyType: 'Villa résidentielle'
  });
  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    setLoading(true);
    const result = await submitLead({
      name: formData.name,
      phone: formData.phone,
      city: formData.city,
      service: "Contrats de maintenance",
      source: "maintenance",
      description: `Demande pour ${selectedPlan} (${formData.propertyType} à ${formData.city})`,
      details: {
        formule: selectedPlan,
        propertyType: formData.propertyType
      }
    });
    setLoading(false);

    if (result.success && result.reference) {
      setSubmittedRef(result.reference);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold tracking-wider text-[#0077B6] uppercase">
          Tranquillité Annuelle
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] mt-2">
          Contrats d'Entretien & Maintenance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Bénéficiez d'une eau saine et cristalline toute l'année sans manipulation de produits chimiques. Nos techniciens qualifiés assurent un suivi rigoureux.
        </p>
      </div>

      {/* 3 Formules de Contrat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {initialMaintenancePlans.map(plan => {
          const isSelected = selectedPlan === plan.name;
          return (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl border transition-all flex flex-col justify-between p-6 sm:p-8 relative ${
                plan.isPopular
                  ? 'border-[#0077B6] shadow-md ring-1 ring-[#0077B6]'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0077B6] text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Recommandé Villas
                </div>
              )}

              <div>
                <span className="text-xs font-semibold text-[#0077B6] block mb-1">
                  {plan.targetAudience}
                </span>
                <h3 className="text-xl font-bold text-[#102A43] mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{plan.idealFor}</p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-700 flex items-center gap-2 mb-6">
                  <Calendar className="w-4 h-4 text-[#0077B6] shrink-0" />
                  <span>{plan.visitsPerMonth}</span>
                </div>

                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Prestations incluses :
                  </p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => {
                    setSelectedPlan(plan.name);
                    const formElement = document.getElementById('maintenance-form');
                    formElement?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0077B6] text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {isSelected ? 'Formule sélectionnée' : 'Sélectionner cette formule'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Formulaire de demande de proposition de maintenance */}
      <div id="maintenance-form" className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
        {submittedRef ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Demande de contrat enregistrée</h3>
            <p className="text-xs text-slate-600 mb-4">
              Votre dossier n° <span className="font-mono font-bold text-[#0077B6]">{submittedRef}</span> a été transmis. Notre responsable maintenance prendra contact pour convenir d'une première visite de calibrage.
            </p>
            <a
              href={getWhatsAppUrl(`Bonjour, je souhaite valider ma demande de contrat d'entretien (Réf: ${submittedRef}) pour la formule : ${selectedPlan}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Accélérer sur WhatsApp</span>
            </a>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-semibold text-[#0077B6] uppercase">Étape finale</span>
              <h3 className="text-xl font-bold text-[#102A43] mt-1">
                Recevoir une proposition de maintenance
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Formule choisie : <span className="font-semibold text-slate-800">{selectedPlan}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Type de bien *
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Villa résidentielle">Villa résidentielle privée</option>
                    <option value="Résidence secondaire">Résidence secondaire / Villa d'hivernage</option>
                    <option value="Riad en Médina">Riad en Médina</option>
                    <option value="Maison d'hôtes / Hôtel">Maison d'hôtes / Établissement hôtelier</option>
                    <option value="Copropriété / Club de sport">Copropriété / Résidence fermée</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Zone géographique *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    {settings.citiesCovered.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                    <option value="Autre région">Autre localité</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Votre Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex : M. Kabbaj"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Téléphone mobile joignable *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex : 06 61 XX XX XX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#0077B6] hover:bg-[#005f94] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span>Transmission en cours...</span>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Recevoir une proposition de maintenance</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                Tarifs calculés selon le cubage d'eau, la localisation et le nombre de passages hebdomadaires.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
