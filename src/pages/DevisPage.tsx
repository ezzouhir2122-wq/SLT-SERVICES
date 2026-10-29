import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ArrowRight, ArrowLeft, MessageCircle, Send, AlertCircle } from 'lucide-react';

export const DevisPage: React.FC = () => {
  const { submitLead, settings, getWhatsAppUrl, navigate } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Form State
  const [projectType, setProjectType] = useState<string>('Gros œuvre & construction');

  // Step 2 conditional fields
  const [details, setDetails] = useState<Record<string, any>>({
    buildingType: 'Villa individuelle',
    surface: '150',
    levels: 'R+1',
    terrain: 'Terrain plat et accessible',
    timeline: 'Dans les 1 à 3 prochains mois',
    propertyType: 'Villa / maison individuelle',
    issueType: 'Infiltration / humidité',
    urgencyLevel: '24_48h'
  });

  // Step 3 Contact details
  const [contact, setContact] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    city: 'Marrakech',
    message: ''
  });

  const [consent, setConsent] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const projectOptions = [
    { id: 'Gros œuvre & construction', label: 'Construction neuve', desc: 'Villa, immeuble, local — du terrassement au gros œuvre' },
    { id: 'Rénovation & réhabilitation', label: 'Rénovation & réhabilitation', desc: 'Remise à neuf, transformation, mise aux normes' },
    { id: 'Aménagement extérieur', label: 'Aménagement extérieur', desc: 'Terrasse, clôture, voirie, espaces verts' },
    { id: 'Second œuvre & finitions', label: 'Second œuvre & finitions', desc: 'Plâtre, carrelage, peinture, menuiserie' },
    { id: 'Électricité & plomberie', label: 'Électricité & plomberie', desc: 'Installation et mise aux normes' },
    { id: 'Travaux divers & maintenance', label: 'Travaux divers / maintenance', desc: 'Réparations, étanchéité, entretien' },
    { id: 'Dépannage & urgence', label: 'Dépannage / Urgence', desc: 'Infiltration, fissure, panne technique' },
    { id: 'Autre demande', label: 'Autre projet', desc: 'Conseil ou étude particulière' }
  ];

  const isUrgentType = projectType.includes('Dépannage') || projectType.includes('Travaux divers');

  const handleNext = () => {
    setErrorMsg('');
    if (currentStep === 3) {
      if (!contact.name.trim() || !contact.phone.trim()) {
        setErrorMsg('Veuillez renseigner au moins votre nom et votre numéro de téléphone.');
        return;
      }
    }
    setCurrentStep(prev => Math.min(4, prev + 1));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!consent) {
      setErrorMsg('Veuillez accepter le traitement des données pour continuer.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const leadPayload = {
      name: contact.name,
      phone: contact.phone,
      whatsapp: contact.whatsapp || contact.phone,
      email: contact.email,
      city: contact.city,
      service: projectType,
      source: 'formulaire_devis',
      urgency: details.urgencyLevel || 'cette_semaine',
      description: contact.message || `Demande de devis pour ${projectType}`,
      details: {
        ...details,
        projectType
      }
    };

    const res = await submitLead(leadPayload);
    setLoading(false);

    if (res.success && res.reference) {
      setSubmittedRef(res.reference);
    } else {
      setErrorMsg(res.error || 'Erreur lors de la transmission. Veuillez réessayer.');
    }
  };

  if (submittedRef) {
    const summaryMsg = `Bonjour SLT SERVICES, je viens de soumettre ma demande de devis n° ${submittedRef} concernant : ${projectType} à ${contact.city}. Pouvons-nous échanger à ce sujet ?`;
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-8 sm:p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase">
            Demande confirmée & enregistrée
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] mt-2 mb-3">
            Merci {contact.name} !
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
            Votre demande a bien été enregistrée dans notre système sous la référence unique :
          </p>

          <div className="inline-block my-5 px-6 py-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xl font-bold text-[#0077B6]">
            {submittedRef}
          </div>

          <p className="text-xs text-slate-500 mb-8 max-w-md mx-auto">
            Un chargé d'affaires va étudier votre projet et vous contacter sous 24h ouvrées pour organiser la visite technique.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={getWhatsAppUrl(summaryMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Transmettre les détails sur WhatsApp</span>
            </a>

            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-semibold tracking-wider text-[#0077B6] uppercase">
          Devis Personnalisé & Gratuit
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] mt-2">
          Étude Chiffrée de votre Projet
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Complétez ce formulaire en 4 étapes rapides pour obtenir une proposition claire et adaptée à vos travaux.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span className={currentStep >= 1 ? 'text-[#0077B6]' : ''}>1. Projet</span>
          <span className={currentStep >= 2 ? 'text-[#0077B6]' : ''}>2. Précisions</span>
          <span className={currentStep >= 3 ? 'text-[#0077B6]' : ''}>3. Coordonnées</span>
          <span className={currentStep >= 4 ? 'text-[#0077B6]' : ''}>4. Validation</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0077B6] to-[#00B4D8] transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
        {/* ÉTAPE 1: TYPE DE PROJET */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#102A43]">
                Quel est votre projet principal ?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Sélectionnez le domaine correspondant le mieux à vos attentes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {projectOptions.map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setProjectType(opt.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    projectType === opt.id
                      ? 'border-[#0077B6] bg-blue-50/50 ring-1 ring-[#0077B6]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <p className="text-sm font-bold text-slate-900">{opt.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ÉTAPE 2: DÉTAILS SELON LE SERVICE */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#102A43]">
                Précisions sur votre projet ({projectType})
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Ces informations nous permettent de préparer une étude et un chiffrage adaptés.
              </p>
            </div>

            {/* Construction */}
            {projectType === 'Gros œuvre & construction' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Type de bâtiment</label>
                    <select
                      value={details.buildingType}
                      onChange={(e) => setDetails({ ...details, buildingType: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Villa individuelle">Villa individuelle</option>
                      <option value="Immeuble résidentiel">Immeuble résidentiel</option>
                      <option value="Local commercial / professionnel">Local commercial / professionnel</option>
                      <option value="Dépôt / bâtiment industriel">Dépôt / bâtiment industriel</option>
                      <option value="Extension / surélévation">Extension / surélévation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Surface approximative (m²)</label>
                    <input
                      type="number"
                      step="10"
                      value={details.surface}
                      onChange={(e) => setDetails({ ...details, surface: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
                      placeholder="Ex : 150"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nombre de niveaux</label>
                    <select
                      value={details.levels}
                      onChange={(e) => setDetails({ ...details, levels: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="RDC">Rez-de-chaussée seul</option>
                      <option value="R+1">R+1 (un étage)</option>
                      <option value="R+2">R+2 (deux étages)</option>
                      <option value="R+3 et plus">R+3 et plus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Échéance prévisionnelle</label>
                    <select
                      value={details.timeline}
                      onChange={(e) => setDetails({ ...details, timeline: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Immédiat (permis validé)">Immédiat (permis validé, début sous 30 jours)</option>
                      <option value="Dans les 1 à 3 prochains mois">Dans les 1 à 3 prochains mois</option>
                      <option value="Projet en phase d'étude">Projet en phase d'étude préliminaire</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Terrain & accès</label>
                  <select
                    value={details.terrain}
                    onChange={(e) => setDetails({ ...details, terrain: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Terrain plat et accessible">Terrain plat, accès facile pour engins</option>
                    <option value="Terrain en pente / rocheux">Terrain en pente ou présence de roche</option>
                    <option value="Accès étroit">Accès étroit (ruelle, passage piéton)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Rénovation */}
            {projectType === 'Rénovation & réhabilitation' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Type de bien</label>
                    <select
                      value={details.propertyType}
                      onChange={(e) => setDetails({ ...details, propertyType: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Villa / maison individuelle">Villa / maison individuelle</option>
                      <option value="Appartement">Appartement</option>
                      <option value="Local commercial">Local commercial</option>
                      <option value="Immeuble / parties communes">Immeuble / parties communes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Surface approximative (m²)</label>
                    <input
                      type="number"
                      step="10"
                      value={details.surface}
                      onChange={(e) => setDetails({ ...details, surface: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
                      placeholder="Ex : 120"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Travaux souhaités</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      "Redistribution / démolition de cloisons",
                      "Mise aux normes électricité & plomberie",
                      "Rénovation cuisine / salle de bains",
                      "Sols, peinture et faux plafonds",
                      "Reprise d'étanchéité / humidité",
                      "Menuiserie et façade"
                    ].map(item => (
                      <label key={item} className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          className="rounded text-[#0077B6]"
                          checked={(details.renovationItems || []).includes(item)}
                          onChange={(e) => {
                            const list = details.renovationItems || [];
                            if (e.target.checked) {
                              setDetails({ ...details, renovationItems: [...list, item] });
                            } else {
                              setDetails({ ...details, renovationItems: list.filter((x: string) => x !== item) });
                            }
                          }}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Dépannage / Travaux divers */}
            {isUrgentType && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nature du problème / des travaux</label>
                  <select
                    value={details.issueType}
                    onChange={(e) => setDetails({ ...details, issueType: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Infiltration / humidité">Infiltration d'eau / humidité</option>
                    <option value="Fissures de structure ou façade">Fissures de structure ou façade</option>
                    <option value="Réparation maçonnerie / plâtre / peinture">Réparation maçonnerie / plâtre / peinture</option>
                    <option value="Panne électricité / plomberie">Panne électricité / plomberie</option>
                    <option value="Entretien de bâtiment / parties communes">Entretien de bâtiment / parties communes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Degré d'urgence</label>
                  <select
                    value={details.urgencyLevel}
                    onChange={(e) => setDetails({ ...details, urgencyLevel: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="immediate">Urgent : intervention au plus vite</option>
                    <option value="24_48h">Sous 24h à 48h ouvrées</option>
                    <option value="cette_semaine">Cette semaine</option>
                  </select>
                </div>
              </div>
            )}

            {/* Autres types : saisie libre à l'étape suivante */}
            {!['Gros œuvre & construction', 'Rénovation & réhabilitation'].includes(projectType) && !isUrgentType && (
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700">
                Parfait. Vous pourrez décrire précisément votre besoin ({projectType.toLowerCase()}) à l'étape suivante dans le champ message.
              </div>
            )}
          </div>
        )}

        {/* ÉTAPE 3: COORDONNÉES */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#102A43]">
                Vos Coordonnées de Contact
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Indiquez les coordonnées où notre chargé d'affaires pourra vous joindre pour planifier l'étude.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nom et Prénom *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Karim El Fassi"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
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
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Numéro WhatsApp (facultatif si identique)
                </label>
                <input
                  type="tel"
                  placeholder="Ex : 06 61 XX XX XX"
                  value={contact.whatsapp}
                  onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Adresse Email (facultatif)
                </label>
                <input
                  type="email"
                  placeholder="nom@exemple.com"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Localisation du chantier (Ville / Quartier) *
              </label>
              <select
                value={contact.city}
                onChange={(e) => setContact({ ...contact, city: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
              >
                {settings.citiesCovered.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
                <option value="Autre région">Autre localité</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Message ou précisions complémentaires
              </label>
              <textarea
                rows={3}
                placeholder="Indiquez toute précision utile : contraintes d'accès, état du bâti, plans disponibles, budget indicatif..."
                value={contact.message}
                onChange={(e) => setContact({ ...contact, message: e.target.value })}
                className="w-full text-xs sm:text-sm p-3.5 rounded-lg border border-slate-300"
              />
            </div>
          </div>
        )}

        {/* ÉTAPE 4: RÉCAPITULATIF & VALIDATION */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#102A43]">
                Récapitulatif de votre Demande
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Vérifiez les données avant la validation définitive.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Projet sélectionné :</span>
                <span className="font-bold text-slate-900">{projectType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Localisation :</span>
                <span className="font-medium text-slate-900">{contact.city}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Nom du contact :</span>
                <span className="font-medium text-slate-900">{contact.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Téléphone de contact :</span>
                <span className="font-medium text-slate-900">{contact.phone}</span>
              </div>
              {contact.email && (
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Email :</span>
                  <span className="font-medium text-slate-900">{contact.email}</span>
                </div>
              )}
            </div>

            {/* Consentement */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#0077B6]"
                />
                <span className="text-slate-700 leading-relaxed">
                  J'accepte que les données renseignées soient collectées et traitées par {settings.companyName} afin de me fournir une étude technique et commerciale chiffrée, conformément à la législation marocaine sur la protection des données (loi 09-08).
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#0077B6] hover:bg-[#005f94] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
            >
              <span>Continuer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="px-7 py-3 text-xs sm:text-sm font-bold text-white bg-[#0077B6] hover:bg-[#005f94] rounded-xl shadow-md transition-all flex items-center gap-2 ml-auto cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span>Transmission en cours...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Confirmer & Envoyer ma Demande</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
