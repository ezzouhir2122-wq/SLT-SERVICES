import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, getWhatsAppUrl, submitLead } = useApp();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Marrakech',
    subject: 'Renseignement général',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    setLoading(true);
    const result = await submitLead({
      name: form.name,
      phone: form.phone,
      email: form.email,
      city: form.city,
      service: form.subject,
      source: 'contact',
      description: form.message || `Demande générale : ${form.subject}`
    });
    setLoading(false);

    if (result.success && result.reference) {
      setSubmittedRef(result.reference);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold tracking-wider text-[#0077B6] uppercase">
          Nous Joindre
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] mt-2">
          Contact & Accès Agence
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Une question sur vos travaux, un projet à étudier ou une demande de devis ? Nos conseillers sont à votre entière disposition.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Coordinates & Hours */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-lg font-bold text-[#102A43]">
              Agence Principale Marrakech
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0077B6] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Adresse de l'agence</span>
                  <span className="text-slate-600 leading-relaxed">{settings.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0077B6] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Ligne Téléphonique</span>
                  <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-[#0077B6] hover:underline font-mono">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0077B6] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Courrier Électronique</span>
                  <a href={`mailto:${settings.email}`} className="text-slate-600 hover:text-[#0077B6]">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0077B6] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Horaires d'Ouverture</span>
                  <span className="text-slate-600 leading-relaxed">{settings.openingHours}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <a
                href={getWhatsAppUrl("Bonjour, je souhaite prendre contact avec votre service commercial.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ouvrir la discussion WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Zones covered */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Périmètre d'Intervention Habituel :
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {settings.citiesCovered.map(c => (
                <span key={c} className="text-xs text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          {submittedRef ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Message transmis avec succès</h3>
              <p className="text-xs text-slate-600 mb-4">
                Dossier n° <span className="font-mono font-bold text-[#0077B6]">{submittedRef}</span>. Notre équipe vous répondra par téléphone ou email dans les plus brefs délais.
              </p>
              <button
                onClick={() => {
                  setSubmittedRef(null);
                  setForm({ name: '', phone: '', email: '', city: 'Marrakech', subject: 'Renseignement général', message: '' });
                }}
                className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#102A43]">
                  Formulaire de Message
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Écrivez-nous directement pour toute demande d'information ou de partenariat.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Votre Nom *</label>
                    <input
                      type="text"
                      required
                      placeholder="M. Alami"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Téléphone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="06 61 XX XX XX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email (facultatif)</label>
                    <input
                      type="email"
                      placeholder="nom@domaine.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Ville de résidence</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Objet du message</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Renseignement général">Renseignement général</option>
                    <option value="Demande de devis projet">Demande d'étude ou devis pour un projet</option>
                    <option value="Demande de prix prestation">Prix d'une prestation / matériau</option>
                    <option value="Proposition de partenariat pro">Partenariat promoteur / architecte / syndic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Votre Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Précisez votre demande en quelques lignes..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3.5 rounded-lg border border-slate-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0077B6] hover:bg-[#005f94] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span>Envoi en cours...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmettre mon message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
