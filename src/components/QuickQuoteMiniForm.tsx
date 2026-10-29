import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, CheckCircle2, MessageCircle } from 'lucide-react';

export const QuickQuoteMiniForm: React.FC = () => {
  const { submitLead, settings, getWhatsAppUrl } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Marrakech',
    service: 'Construction de piscines'
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
      service: formData.service,
      source: 'devis_rapide',
      description: `Demande rapide pour ${formData.service} à ${formData.city}`
    });
    setLoading(false);

    if (result.success && result.reference) {
      setSubmittedRef(result.reference);
    }
  };

  if (submittedRef) {
    const whatsappText = `Bonjour, je viens d'enregistrer ma demande de devis rapide (Réf: ${submittedRef}) pour : ${formData.service} à ${formData.city}. Mon nom est ${formData.name}.`;
    return (
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-slate-900">Demande enregistrée avec succès !</h4>
        <p className="text-xs text-slate-600 mt-1">
          Votre référence de dossier est : <span className="font-mono font-bold text-emerald-800">{submittedRef}</span>
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Un conseiller technique vous contactera sous 24h ouvrées. Vous pouvez également accélérer votre dossier directement sur WhatsApp.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={getWhatsAppUrl(whatsappText)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Continuer sur WhatsApp</span>
          </a>
          <button
            onClick={() => {
              setSubmittedRef(null);
              setFormData({ name: '', phone: '', city: 'Marrakech', service: 'Construction de piscines' });
            }}
            className="w-full sm:w-auto px-4 py-2 text-xs text-slate-600 hover:text-slate-900"
          >
            Nouvelle demande
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-[#102A43]">
          Étude Express de votre Projet
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Renseignez vos coordonnées pour recevoir un premier chiffrage adapté à votre installation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Service recherché *
            </label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-transparent bg-white"
            >
              <option value="Construction de piscines">Construction de piscine neuve</option>
              <option value="Rénovation & réhabilitation">Rénovation de bassin existant</option>
              <option value="Pompes & filtration">Installation ou remplacement de pompe</option>
              <option value="Aménagement extérieur">Aménagement plages & margelles</option>
              <option value="Entretien & maintenance">Contrat d'entretien régulier</option>
              <option value="Dépannage d'urgence">Dépannage / Panne technique</option>
              <option value="Achat d'équipements">Achat équipement ou accessoire</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Ville ou Zone *
            </label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-transparent bg-white"
            >
              {settings.citiesCovered.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
              <option value="Autre ville">Autre région au Maroc</option>
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
              placeholder="Ex : M. Alami"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Téléphone mobile (Maroc) *
            </label>
            <input
              type="tel"
              required
              placeholder="Ex : 06 61 XX XX XX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-[#0077B6] hover:bg-[#005f94] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {loading ? (
            <span>Enregistrement en cours...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Recevoir mon devis gratuit</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-500">
          Vos coordonnées sont confidentielles et utilisées exclusivement pour traiter votre étude technique.
        </p>
      </form>
    </div>
  );
};
