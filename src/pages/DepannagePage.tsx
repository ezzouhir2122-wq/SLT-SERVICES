import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wrench, PhoneCall, MessageCircle, AlertTriangle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

export const DepannagePage: React.FC = () => {
  const { submitLead, settings, getWhatsAppUrl, navigate } = useApp();
  const [formData, setFormData] = useState({
    issue: 'Infiltration d\'eau / humidité',
    urgency: 'immediate',
    city: 'Marrakech',
    name: '',
    phone: '',
    whatsapp: '',
    description: ''
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
      whatsapp: formData.whatsapp || formData.phone,
      city: formData.city,
      service: "Dépannage & travaux d'urgence",
      source: "depannage_urgent",
      urgency: formData.urgency,
      description: `Intervention signalée : ${formData.issue}. ${formData.description}`,
      details: {
        issue: formData.issue,
        urgency: formData.urgency
      }
    });
    setLoading(false);

    if (result.success && result.reference) {
      setSubmittedRef(result.reference);
    }
  };

  const emergencyWhatsApp = `URGENCE BÂTIMENT : Bonjour SLT SERVICES, je signale un problème (${formData.issue}) à ${formData.city}. Contact : ${formData.name} (${formData.phone}). Pouvez-vous intervenir ?`;

  if (submittedRef) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-8 sm:p-12">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-xs font-semibold tracking-wider text-amber-700 uppercase">
            Demande d'intervention prise en compte
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] mt-2 mb-3">
            Ticket de dépannage n° {submittedRef}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6">
            Nos techniciens d'astreinte ont bien reçu votre alerte. Pour un suivi prioritaire immédiat, contactez directement l'astreinte sur WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={getWhatsAppUrl(`Ticket dépannage n° ${submittedRef} : ${emergencyWhatsApp}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contacter l'astreinte WhatsApp</span>
            </a>
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-[#0077B6]" />
              <span>Appeler le {settings.phone}</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold tracking-wider text-rose-600 uppercase flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Assistance & Dépannage Technique</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] mt-2">
          Dépannage & Interventions d'Urgence
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Infiltration, fissure, humidité, panne électrique ou plomberie, petits travaux urgents : nos équipes interviennent rapidement sur Marrakech et ses environs.
        </p>
      </div>

      {/* Grid: Direct Emergency Hotline + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Emergency Info & Call */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#102A43] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <div>
              <span className="text-xs font-semibold tracking-wider text-[#90E0EF] uppercase">
                Ligne Directe
              </span>
              <h3 className="text-xl font-bold mt-1 text-white">Besoin d'aide immédiate ?</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Une infiltration ou une fissure non traitée peut vite s'aggraver. Appelez notre équipe pour une intervention rapide.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-3 p-3.5 bg-white/10 hover:bg-white/15 rounded-xl border border-white/10 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#0077B6] flex items-center justify-center text-white shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-300 block">Téléphone standard & urgences</span>
                  <span className="text-sm font-mono font-bold text-white">{settings.phone}</span>
                </div>
              </a>

              <a
                href={getWhatsAppUrl(emergencyWhatsApp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 bg-emerald-950/70 hover:bg-emerald-900/70 rounded-xl border border-emerald-500/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-emerald-300 block">WhatsApp direct dépannage</span>
                  <span className="text-sm font-semibold text-white">Message instantané</span>
                </div>
              </a>
            </div>

            <div className="pt-4 border-t border-slate-700/80 text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#00B4D8]" />
                <span>Interventions programmées 6j/7 + urgences</span>
              </div>
              <p>Équipe d'intervention mobile équipée pour la plupart des réparations courantes.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Structured breakdown ticket form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <h3 className="text-lg font-bold text-[#102A43] mb-1">
            Fiche de Demande d'Intervention
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Remplissez ce formulaire pour créer un ticket d'assistance technique numéroté.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Problème principal constaté *
              </label>
              <select
                value={formData.issue}
                onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Infiltration d'eau / humidité">Infiltration d'eau / humidité (toiture, mur, terrasse)</option>
                <option value="Fissures de structure ou façade">Fissures de structure ou de façade</option>
                <option value="Problème d'étanchéité">Problème d'étanchéité (toiture-terrasse, salle d'eau)</option>
                <option value="Panne électrique">Panne électrique / tableau / court-circuit</option>
                <option value="Problème de plomberie">Fuite ou problème de plomberie</option>
                <option value="Réparation maçonnerie / finitions">Réparation maçonnerie, plâtre ou peinture</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Degré d'urgence *
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="immediate">Urgent (dégât en cours / aggravation)</option>
                  <option value="24_48h">Sous 24h à 48h ouvrées</option>
                  <option value="cette_semaine">Cette semaine / flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Localisation (Ville / Secteur) *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  {settings.citiesCovered.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="Autre région">Autre localité</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Votre Nom *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : M. Benjelloun"
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Description du problème et contexte
              </label>
              <textarea
                rows={3}
                placeholder="Décrivez le problème, sa localisation (étage, pièce), depuis quand il est apparu, l'ampleur des dégâts..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-xs sm:text-sm p-3.5 rounded-lg border border-slate-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span>Enregistrement du ticket...</span>
              ) : (
                <>
                  <Wrench className="w-4 h-4" />
                  <span>Demander une intervention technique</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              Nous confirmons systématiquement l'horaire de passage par téléphone avant tout déplacement.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
