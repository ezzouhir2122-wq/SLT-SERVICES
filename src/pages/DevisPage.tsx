import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ArrowRight, ArrowLeft, MessageCircle, Send, ShieldCheck, AlertCircle } from 'lucide-react';

export const DevisPage: React.FC = () => {
  const { submitLead, settings, getWhatsAppUrl, navigate } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Form State
  const [projectType, setProjectType] = useState<string>('Construction de piscines');
  
  // Step 2 conditional fields
  const [details, setDetails] = useState<Record<string, any>>({
    poolType: 'Piscine rectangulaire en béton armé',
    length: '10',
    width: '4.5',
    depth: '1.40',
    terrain: 'Terrain plat accessible',
    timeline: 'Dans les 1 à 3 prochains mois',
    issueType: 'Pompe en panne ou bruyante',
    equipmentType: 'Pompe de circulation',
    urgencyLevel: '24_48h',
    maintenanceFrequency: '1 passage par semaine'
  });

  // Step 3 Contact details
  const [contact, setContact] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    city: 'Marrakech (Palmeraie)',
    message: ''
  });

  const [consent, setConsent] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const projectOptions = [
    { id: 'Construction de piscines', label: 'Construction neuve', desc: 'Bassin en béton armé, miroir, débordement' },
    { id: 'Rénovation de bassin', label: 'Rénovation & réhabilitation', desc: 'Reprise étanchéité, changement carrelage, rehausse' },
    { id: 'Dépannage & réparation', label: 'Dépannage / Réparation', desc: 'Pompe en panne, fuite, disjoncteur' },
    { id: 'Pompe & filtration', label: 'Pompe & filtration', desc: 'Remplacement de pompe, filtre à sable' },
    { id: 'Entretien & maintenance', label: 'Contrat d\'entretien', desc: 'Visites hebdomadaires, suivi régulier' },
    { id: 'Aménagement extérieur', label: 'Aménagement & plages', desc: 'Margelles, solarium, travertin, terrasse' },
    { id: 'Achat équipement', label: 'Achat d\'équipements', desc: 'Robot nettoyeur, électrolyseur sel, projecteurs' },
    { id: 'Autre demande', label: 'Autre projet', desc: 'Conseil ou étude particulière' }
  ];

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
    const summaryMsg = `Bonjour Aqua Piscines, je viens de soumettre ma demande de devis n° ${submittedRef} concernant : ${projectType} à ${contact.city}. Pouvons-nous échanger à ce sujet ?`;
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
            Un technicien chargé d'affaires va examiner les spécificités de votre bassin et vous contacter sous 24h ouvrées.
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
          Étude Chiffrée de votre Bassin
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Complétez ce formulaire en 4 étapes rapides pour obtenir une proposition claire et adaptée à votre projet.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span className={currentStep >= 1 ? 'text-[#0077B6]' : ''}>1. Projet</span>
          <span className={currentStep >= 2 ? 'text-[#0077B6]' : ''}>2. Spécifications</span>
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
                Ces informations nous permettent de calibrer les matériels et les dimensions adéquates.
              </p>
            </div>

            {/* Construction questions */}
            {projectType === 'Construction de piscines' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Type architectural souhaité
                  </label>
                  <select
                    value={details.poolType}
                    onChange={(e) => setDetails({ ...details, poolType: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Piscine miroir (l'eau affleure le dallage)">Bassin miroir contemporain</option>
                    <option value="Piscine à débordement (vue dégagée)">Piscine à débordement cascade</option>
                    <option value="Piscine rectangulaire classique avec plage immergée">Piscine rectangulaire avec plage immergée</option>
                    <option value="Couloir de nage épuré">Couloir de nage (longueur plus de 15m)</option>
                    <option value="Bassin pour patio de riad">Bassin de rafraîchissement pour patio de riad</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Longueur estimée (m)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={details.length}
                      onChange={(e) => setDetails({ ...details, length: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
                      placeholder="Ex : 10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Largeur estimée (m)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={details.width}
                      onChange={(e) => setDetails({ ...details, width: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
                      placeholder="Ex : 4.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Profondeur souhaitée (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={details.depth}
                      onChange={(e) => setDetails({ ...details, depth: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
                      placeholder="Ex : 1.40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Accès et terrain
                    </label>
                    <select
                      value={details.terrain}
                      onChange={(e) => setDetails({ ...details, terrain: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Terrain plat accessible engins">Terrain plat, accès facile pour engins de terrassement</option>
                      <option value="Terrain en pente / rocheux">Terrain en pente ou présence de roche</option>
                      <option value="Accès étroit (médina ou passage piéton)">Accès piéton ou ruelle étroite (médina/riad)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Échéance prévisionnelle
                    </label>
                    <select
                      value={details.timeline}
                      onChange={(e) => setDetails({ ...details, timeline: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Immédiat (chantier prêt)">Immédiat (permis validé, début sous 30 jours)</option>
                      <option value="Dans les 1 à 3 prochains mois">Dans les 1 à 3 prochains mois</option>
                      <option value="Dans plus de 3 mois / Projet futur">Projet en phase d'étude préliminaire</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Pompe / Filtration questions */}
            {(projectType.includes('Pompe') || projectType.includes('filtration')) && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nature de l'intervention
                    </label>
                    <select
                      value={details.pumpNeed || 'Remplacement de pompe défaillante'}
                      onChange={(e) => setDetails({ ...details, pumpNeed: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Remplacement de pompe défaillante">Remplacement d'une pompe défaillante</option>
                      <option value="Passage à une pompe à vitesse variable">Passage à une pompe à vitesse variable (économies d'énergie)</option>
                      <option value="Remplacement du sable du filtre">Changement du sable / Passage au média de verre</option>
                      <option value="Création complète du local technique">Création ou réfection complète du local technique</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Marque / Modèle existant (si connu)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex : Hayward 1.5 CV, AstralPool, Espa..."
                      value={details.pumpBrand || ''}
                      onChange={(e) => setDetails({ ...details, pumpBrand: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Dépannage questions */}
            {projectType.includes('Dépannage') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Problème constaté
                  </label>
                  <select
                    value={details.issueType}
                    onChange={(e) => setDetails({ ...details, issueType: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Pompe qui disjoncte ou ne démarre plus">La pompe disjoncte immédiatement ou bourdonne</option>
                    <option value="Fuite apparente dans le local technique">Fuite d'eau importante au niveau de la tuyauterie ou vanne</option>
                    <option value="L'eau est verte ou laiteuse en quelques jours">Eau verte, trouble ou développement d'algues rapide</option>
                    <option value="Niveau d'eau qui baisse anormalement (fuite bassin)">Baisse rapide du niveau d'eau (suspicion de fuite dans le bassin)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Degré d'urgence
                  </label>
                  <select
                    value={details.urgencyLevel}
                    onChange={(e) => setDetails({ ...details, urgencyLevel: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="immediate">Urgent : Intervention souhaitée au plus vite</option>
                    <option value="24_48h">Sous 24h à 48h ouvrées</option>
                    <option value="cette_semaine">Cette semaine</option>
                  </select>
                </div>
              </div>
            )}

            {/* Entretien questions */}
            {projectType.includes('Entretien') && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Type d'établissement / Propriété
                    </label>
                    <select
                      value={details.propertyType || 'Villa privée résidentielle'}
                      onChange={(e) => setDetails({ ...details, propertyType: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Villa privée résidentielle">Villa privée d'habitation</option>
                      <option value="Résidence secondaire en location">Résidence secondaire / Location saisonnière</option>
                      <option value="Riad ou maison d'hôtes">Riad ou maison d'hôtes</option>
                      <option value="Hôtel ou résidence touristique">Hôtel ou complexe touristique</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Fréquence de passage souhaitée
                    </label>
                    <select
                      value={details.maintenanceFrequency}
                      onChange={(e) => setDetails({ ...details, maintenanceFrequency: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="1 passage par semaine">1 passage par semaine (résidentiel classique)</option>
                      <option value="2 passages par semaine">2 passages par semaine (haute saison / location)</option>
                      <option value="3 passages par semaine">3 passages par semaine (hôtels / forte affluence)</option>
                      <option value="Intervention ponctuelle de remise en route">Passage ponctuel de remise en route</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Rénovation questions */}
            {projectType.includes('Rénovation') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Modifications souhaitées pour la rénovation
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      "Réfection totale de l'étanchéité",
                      "Pose de carrelage imitation pierre de Bali",
                      "Rehausse de fond pour diminuer la profondeur",
                      "Création d'une plage immergée avec banquette",
                      "Remplacement des margelles en pierre naturelle",
                      "Remplacement complet de la plomberie et du filtre"
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
                Localisation du bien (Ville / Quartier) *
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
                placeholder="Indiquez toute précision utile : contraintes d'accès, historique du bassin, dimensions approximatives..."
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
                <span className="text-slate-500">Service sélectionné :</span>
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

            {/* Consentement CNDP */}
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
