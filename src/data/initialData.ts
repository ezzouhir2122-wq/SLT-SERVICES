import {
  CompanySettings,
  ServiceItem,
  ProductItem,
  ProjectItem,
  MaintenancePlan,
  BlogPost,
  FAQItem,
  Testimonial,
  Lead
} from '../types';

// Helper: génère une URL d'image Unsplash optimisée (toutes testées et fonctionnelles)
const img = (id: string, w = 900): string =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export const initialCompanySettings: CompanySettings = {
  companyName: "SLT SERVICES",
  slogan: "Vos travaux, notre expertise. Construction, rénovation et travaux tous corps d'état à Marrakech.",
  phone: "+212 661 586 841",
  phoneSecondary: "+212 663 116 200",
  whatsapp: "+212 661 586 841",
  email: "contact@slt-services.ma",
  address: "Bureau N°26, N°484, Quartier Industriel Sidi Ghanem, Marrakech",
  primaryCity: "Marrakech",
  citiesCovered: [
    "Marrakech",
    "Guéliz & Hivernage",
    "Palmeraie & Environs",
    "Targa & Route de Casablanca",
    "Route de l'Ourika",
    "Route de Fès",
    "Tamansourt",
    "Région Marrakech-Safi"
  ],
  openingHours: "Lundi au Samedi : 08h30 – 18h30",
  heroImage: img("photo-1503387762-592deb58ef4e", 1400),
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  linkedinUrl: "https://linkedin.com",
  allowEmergencyCalls: true,
  gaMeasurementId: ""
};

export const initialServices: ServiceItem[] = [
  {
    id: "serv_1",
    slug: "gros-oeuvre-construction",
    title: "Gros Œuvre & Construction",
    kicker: "Fondations, structure & bâtiment",
    shortDescription: "Construction de villas, immeubles et locaux professionnels, du terrassement au béton armé, selon les règles de l'art.",
    fullDescription: "SLT SERVICES prend en charge l'intégralité du gros œuvre : étude de sol, terrassement, fondations, radier, ferraillage, coulage de béton armé, élévation des murs et dalles. Nous construisons des structures solides et durables, conformes aux normes marocaines, pour villas, immeubles et bâtiments professionnels.",
    iconName: "Building2",
    image: img("photo-1523217582562-09d0def993a6"),
    clientProblems: [
      "Crainte de fissures et de malfaçons sur la structure",
      "Coordination difficile entre plusieurs sous-traitants",
      "Délais de chantier qui s'allongent sans explication",
      "Dépassement du budget initialement annoncé"
    ],
    solutions: [
      "Étude technique et métré précis avant le démarrage",
      "Structure en béton armé dimensionnée par un bureau d'études",
      "Interlocuteur unique du terrassement à la réception",
      "Planning de chantier clair avec jalons de paiement"
    ],
    prestations: [
      "Terrassement, fouilles et fondations",
      "Radier, semelles et longrines en béton armé",
      "Élévation de murs en agglomérés ou briques",
      "Planchers, dalles et poteaux-poutres",
      "Charpente et couverture"
    ],
    advantages: [
      "Béton armé conforme aux normes parasismiques",
      "Matériaux sélectionnés et traçables",
      "Chantier propre, sécurisé et balisé"
    ],
    faq: [
      {
        question: "Quels types de bâtiments construisez-vous ?",
        answer: "Villas individuelles, immeubles R+2 à R+5, locaux commerciaux, dépôts et bâtiments industriels légers. Nous intervenons en construction neuve comme en extension."
      },
      {
        question: "Travaillez-vous avec un architecte ?",
        answer: "Oui. Nous collaborons avec votre architecte et bureau d'études, ou pouvons vous en recommander un pour les plans et l'obtention du permis de construire."
      }
    ]
  },
  {
    id: "serv_2",
    slug: "renovation-rehabilitation",
    title: "Rénovation & Réhabilitation",
    kicker: "Remise à neuf & transformation",
    shortDescription: "Rénovation complète de maisons, appartements et locaux : reprise de structure, mise aux normes et modernisation.",
    fullDescription: "Vous souhaitez transformer un bien ancien ou le remettre au goût du jour ? Nous réalisons des rénovations partielles ou complètes : démolition maîtrisée, reprise de maçonnerie, création d'ouvertures, réfection des sols et murs, mise aux normes électriques et sanitaires.",
    iconName: "Hammer",
    image: img("photo-1574359411659-15573a27fd0c"),
    clientProblems: [
      "Bien vétuste, humide ou mal agencé",
      "Installations électriques et plomberie hors normes",
      "Peur des mauvaises surprises une fois le chantier ouvert",
      "Difficulté à chiffrer précisément les travaux"
    ],
    solutions: [
      "Diagnostic complet avant devis détaillé",
      "Reprise de structure et traitement de l'humidité",
      "Mise aux normes électricité, plomberie et étanchéité",
      "Devis ferme et transparent, poste par poste"
    ],
    prestations: [
      "Démolition et dépose sélective",
      "Création et agrandissement d'ouvertures",
      "Réfection des sols, murs et plafonds",
      "Rénovation de cuisines et salles de bains",
      "Mise aux normes des réseaux"
    ],
    advantages: [
      "Valorisation immédiate du bien",
      "Respect du bâti existant",
      "Chantier planifié pour limiter la gêne"
    ],
    faq: [
      {
        question: "Pouvez-vous rénover un appartement occupé ?",
        answer: "Oui, nous organisons le chantier par zones et sécurisons les espaces pour limiter la gêne lorsque le logement reste partiellement occupé."
      }
    ]
  },
  {
    id: "serv_3",
    slug: "amenagement-exterieur",
    title: "Aménagement Extérieur",
    kicker: "Voirie, terrasses & espaces verts",
    shortDescription: "Terrasses, allées, murs de clôture, dallage et aménagement paysager pour valoriser vos extérieurs.",
    fullDescription: "Nous aménageons vos espaces extérieurs de A à Z : terrassement et nivellement, dallage et pavage, murs de clôture et portails, terrasses en béton ou pierre naturelle, et intégration paysagère avec espaces verts et éclairage.",
    iconName: "Trees",
    image: img("photo-1512917774080-9991f1c4c750"),
    clientProblems: [
      "Terrain brut, en pente ou mal drainé",
      "Extérieurs peu valorisés et difficiles à entretenir",
      "Clôture ou mur de soutènement à réaliser",
      "Manque d'éclairage et de circulation"
    ],
    solutions: [
      "Nivellement et gestion des eaux pluviales",
      "Dallage antidérapant et pavage durable",
      "Murs de clôture et de soutènement en béton armé",
      "Éclairage extérieur et intégration paysagère"
    ],
    prestations: [
      "Terrasses en béton désactivé, pierre ou grès cérame",
      "Allées, parkings et voirie légère",
      "Murs de clôture, portails et garde-corps",
      "Pose de gazon, plantations et arrosage",
      "Éclairage extérieur encastré"
    ],
    advantages: [
      "Matériaux résistants au climat de Marrakech",
      "Pentes et drainage calculés contre l'eau stagnante",
      "Harmonie avec l'architecture du bâtiment"
    ],
    faq: [
      {
        question: "Réalisez-vous aussi les murs de clôture ?",
        answer: "Oui, nous construisons murs de clôture et de soutènement en béton armé, avec finition enduit, pierre ou habillage, ainsi que la pose de portails."
      }
    ]
  },
  {
    id: "serv_4",
    slug: "second-oeuvre-finitions",
    title: "Second Œuvre & Finitions",
    kicker: "Plâtre, carrelage, peinture & menuiserie",
    shortDescription: "Toutes les finitions intérieures : plâtrerie, carrelage, peinture, faux plafonds et menuiserie pour un rendu impeccable.",
    fullDescription: "Le second œuvre fait toute la différence. Nos équipes réalisent la plâtrerie et les faux plafonds, la pose de carrelage et revêtements, la peinture décorative, ainsi que la menuiserie bois et aluminium, pour des finitions soignées et durables.",
    iconName: "Paintbrush",
    image: img("photo-1621905251189-08b45d6a269e"),
    clientProblems: [
      "Finitions bâclées par des intervenants non coordonnés",
      "Fissures de plâtre et peintures qui s'écaillent",
      "Carrelage mal posé ou joints irréguliers",
      "Menuiseries mal ajustées, peu étanches"
    ],
    solutions: [
      "Équipes spécialisées par corps d'état",
      "Préparation rigoureuse des supports",
      "Pose de carrelage calepinée au millimètre",
      "Menuiserie alu et bois sur mesure posée à niveau"
    ],
    prestations: [
      "Plâtrerie, cloisons et faux plafonds (placo & staff)",
      "Carrelage, faïence et revêtements grand format",
      "Peinture intérieure et décorative",
      "Menuiserie bois, aluminium et PVC",
      "Pose de parquet et revêtements de sol"
    ],
    advantages: [
      "Finitions nettes et durables",
      "Respect du calepinage et des teintes choisies",
      "Nettoyage de fin de chantier inclus"
    ],
    faq: [
      {
        question: "Proposez-vous la menuiserie aluminium sur mesure ?",
        answer: "Oui, nous réalisons fenêtres, baies coulissantes, portes et garde-corps en aluminium sur mesure, avec vitrage adapté à l'isolation thermique."
      }
    ]
  },
  {
    id: "serv_5",
    slug: "electricite-plomberie",
    title: "Électricité & Plomberie",
    kicker: "Réseaux, mise aux normes & sanitaire",
    shortDescription: "Installation et mise aux normes électriques, plomberie, sanitaire et évacuation pour le neuf comme la rénovation.",
    fullDescription: "Nous réalisons l'ensemble des lots techniques : installation électrique complète avec tableau et protections, plomberie d'alimentation et d'évacuation, pose de sanitaires, chauffe-eau et réseaux, dans le respect des normes de sécurité en vigueur.",
    iconName: "Zap",
    image: img("photo-1590725140246-20acdee442be"),
    clientProblems: [
      "Installation électrique ancienne et dangereuse",
      "Fuites, mauvaise pression ou évacuations bouchées",
      "Absence de mise à la terre et de protections",
      "Tableaux électriques non conformes"
    ],
    solutions: [
      "Installation conforme avec disjoncteurs différentiels",
      "Réseaux de plomberie en PER ou multicouche",
      "Mise à la terre et protection des circuits",
      "Tests et mise en service documentés"
    ],
    prestations: [
      "Installation électrique complète et tableaux",
      "Éclairage intérieur et extérieur",
      "Plomberie d'alimentation et d'évacuation",
      "Pose de sanitaires et chauffe-eau",
      "Mise aux normes et dépannage"
    ],
    advantages: [
      "Sécurité des personnes et des biens",
      "Matériel de marques reconnues",
      "Schémas et repérage des circuits fournis"
    ],
    faq: [
      {
        question: "Pouvez-vous mettre aux normes une ancienne installation ?",
        answer: "Oui. Après diagnostic, nous remplaçons le tableau, ajoutons les protections différentielles, la mise à la terre et sécurisons l'ensemble des circuits."
      }
    ]
  },
  {
    id: "serv_6",
    slug: "travaux-divers-maintenance",
    title: "Travaux Divers & Maintenance",
    kicker: "Entretien & petits travaux du bâtiment",
    shortDescription: "Interventions ponctuelles, maintenance de bâtiments, réparations et petits travaux tous corps d'état.",
    fullDescription: "Pour les particuliers, syndics et professionnels, nous assurons la maintenance et les travaux divers : réparations, reprises d'étanchéité, dépannage, entretien courant et interventions multi-métiers, avec réactivité sur Marrakech et sa région.",
    iconName: "Wrench",
    image: img("photo-1416339306562-f3d12fefd36f"),
    clientProblems: [
      "Petits travaux négligés qui s'aggravent",
      "Difficulté à trouver un intervenant fiable et réactif",
      "Infiltrations et fissures non traitées",
      "Besoin d'un contrat d'entretien régulier"
    ],
    solutions: [
      "Interventions rapides planifiées",
      "Équipe polyvalente multi-corps d'état",
      "Traitement durable des infiltrations et fissures",
      "Contrats de maintenance sur mesure"
    ],
    prestations: [
      "Réparations maçonnerie, plâtre et peinture",
      "Reprise d'étanchéité toiture et terrasse",
      "Petits travaux d'électricité et de plomberie",
      "Entretien de bâtiments et parties communes",
      "Dépannage et interventions d'urgence"
    ],
    advantages: [
      "Réactivité sur Marrakech et sa région",
      "Devis clair même pour les petits travaux",
      "Suivi et conseils d'entretien"
    ],
    faq: [
      {
        question: "Intervenez-vous pour de petits travaux ?",
        answer: "Oui, aucun chantier n'est trop petit. Nous réalisons aussi bien des réparations ponctuelles que des contrats d'entretien pour syndics et professionnels."
      }
    ]
  }
];

export const initialProducts: ProductItem[] = [
  {
    id: "prod_1",
    slug: "chape-beton-lisse",
    name: "Chape & Dalle Béton Lissé",
    reference: "GO-CHAPE",
    brand: "Gros Œuvre",
    category: "Gros œuvre",
    price: 180,
    isPriceOnDemand: false,
    shortDescription: "Coulage et lissage de dalle béton pour sols intérieurs et extérieurs. Prix indicatif au m², selon surface et finition.",
    image: img("photo-1504328345606-18bbc8c9d7d1"),
    specs: [
      { label: "Prestation", value: "Fourniture & pose" },
      { label: "Épaisseur", value: "8 à 15 cm selon usage" },
      { label: "Finition", value: "Lissée ou talochée" },
      { label: "Unité", value: "Prix au m² HT (indicatif)" }
    ],
    inStock: true,
    featured: true
  },
  {
    id: "prod_2",
    slug: "mur-agglos-beton",
    name: "Élévation de Murs en Agglomérés",
    reference: "GO-MUR",
    brand: "Gros Œuvre",
    category: "Gros œuvre",
    price: 160,
    isPriceOnDemand: false,
    shortDescription: "Montage de murs en parpaings/agglomérés avec chaînages, pour cloisons porteuses et murs de clôture.",
    image: img("photo-1574359411659-15573a27fd0c"),
    specs: [
      { label: "Matériau", value: "Agglomérés 20 cm" },
      { label: "Chaînage", value: "Horizontal & vertical inclus" },
      { label: "Hauteur", value: "Selon étude" },
      { label: "Unité", value: "Prix au m² HT (indicatif)" }
    ],
    inStock: true,
    featured: true
  },
  {
    id: "prod_3",
    slug: "carrelage-grand-format",
    name: "Pose de Carrelage Grand Format",
    reference: "SO-CARR",
    brand: "Second Œuvre",
    category: "Finitions",
    price: 120,
    isPriceOnDemand: false,
    shortDescription: "Pose calepinée de carrelage et grès cérame grand format, sols et murs, joints fins.",
    image: img("photo-1600596542815-ffad4c1539a9"),
    specs: [
      { label: "Prestation", value: "Pose (hors fourniture carreaux)" },
      { label: "Formats", value: "Jusqu'à 120 x 120 cm" },
      { label: "Joints", value: "Fins, teinte au choix" },
      { label: "Unité", value: "Prix au m² HT (indicatif)" }
    ],
    inStock: true,
    featured: true
  },
  {
    id: "prod_4",
    slug: "enduit-facade",
    name: "Enduit & Ravalement de Façade",
    reference: "SO-FACADE",
    brand: "Second Œuvre",
    category: "Finitions",
    price: 90,
    isPriceOnDemand: false,
    shortDescription: "Enduit monocouche ou traditionnel et ravalement de façade, avec traitement des fissures.",
    image: img("photo-1558618666-fcd25c85cd64"),
    specs: [
      { label: "Type", value: "Monocouche / traditionnel" },
      { label: "Préparation", value: "Reprise fissures incluse" },
      { label: "Finition", value: "Gratté, taloché ou lisse" },
      { label: "Unité", value: "Prix au m² HT (indicatif)" }
    ],
    inStock: true,
    featured: false
  },
  {
    id: "prod_5",
    slug: "cloison-faux-plafond-placo",
    name: "Cloisons & Faux Plafonds Placo",
    reference: "SO-PLACO",
    brand: "Second Œuvre",
    category: "Finitions",
    price: 110,
    isPriceOnDemand: false,
    shortDescription: "Cloisons de distribution, doublages isolants et faux plafonds en plaques de plâtre.",
    image: img("photo-1621905251189-08b45d6a269e"),
    specs: [
      { label: "Ossature", value: "Métallique galvanisée" },
      { label: "Isolation", value: "Laine minérale en option" },
      { label: "Plaques", value: "Standard / hydrofuge" },
      { label: "Unité", value: "Prix au m² HT (indicatif)" }
    ],
    inStock: true,
    featured: false
  },
  {
    id: "prod_6",
    slug: "peinture-interieure",
    name: "Peinture Intérieure",
    reference: "FN-PEINT",
    brand: "Finitions",
    category: "Finitions",
    price: 55,
    isPriceOnDemand: false,
    shortDescription: "Préparation des supports et application de peinture intérieure, murs et plafonds, finition soignée.",
    image: img("photo-1590725140246-20acdee442be"),
    specs: [
      { label: "Préparation", value: "Rebouchage & ponçage" },
      { label: "Couches", value: "Impression + 2 couches" },
      { label: "Teintes", value: "Au nuancier, au choix" },
      { label: "Unité", value: "Prix au m² HT (indicatif)" }
    ],
    inStock: true,
    featured: false
  },
  {
    id: "prod_7",
    slug: "etancheite-toiture-terrasse",
    name: "Étanchéité Toiture-Terrasse",
    reference: "ET-TOIT",
    brand: "Étanchéité",
    category: "Étanchéité",
    price: 140,
    isPriceOnDemand: false,
    shortDescription: "Reprise et réalisation d'étanchéité de toitures-terrasses contre les infiltrations, avec protection.",
    image: img("photo-1504307651254-35680f356dfd"),
    specs: [
      { label: "Système", value: "Membrane bitumineuse / résine" },
      { label: "Préparation", value: "Forme de pente & relevés" },
      { label: "Garantie", value: "Selon système retenu" },
      { label: "Unité", value: "Prix au m² HT (indicatif)" }
    ],
    inStock: true,
    featured: true
  },
  {
    id: "prod_8",
    slug: "menuiserie-aluminium",
    name: "Menuiserie Aluminium sur Mesure",
    reference: "MN-ALU",
    brand: "Menuiserie",
    category: "Menuiserie",
    price: undefined,
    isPriceOnDemand: true,
    shortDescription: "Fenêtres, baies coulissantes, portes et garde-corps en aluminium sur mesure, posés et réglés.",
    image: img("photo-1486406146926-c627a92ad1ab"),
    specs: [
      { label: "Produits", value: "Fenêtres, baies, portes" },
      { label: "Vitrage", value: "Double vitrage isolant" },
      { label: "Coloris", value: "Laqué au choix (RAL)" },
      { label: "Prix", value: "Sur devis après métré" }
    ],
    inStock: true,
    featured: true
  }
];

export const initialProjects: ProjectItem[] = [
  {
    id: "proj_1",
    slug: "villa-contemporaine-palmeraie",
    title: "Construction d'une Villa Contemporaine",
    category: "construction",
    categoryLabel: "Construction Neuve",
    location: "Palmeraie, Marrakech",
    dimensions: "350 m² habitables (R+1)",
    description: "Construction complète d'une villa contemporaine, du terrassement aux finitions : gros œuvre en béton armé, toiture-terrasse étanchée, menuiserie aluminium et finitions haut de gamme.",
    keyPoints: [
      "Fondations et structure en béton armé",
      "Toiture-terrasse avec étanchéité garantie",
      "Menuiserie aluminium double vitrage",
      "Finitions carrelage grand format et peinture décorative"
    ],
    image: img("photo-1600585154340-be6161a56a0c"),
    isDemonstration: true,
    hasBeforeAfter: false
  },
  {
    id: "proj_2",
    slug: "renovation-appartement-gueliz",
    title: "Rénovation Complète d'un Appartement",
    category: "renovation",
    categoryLabel: "Rénovation Complète",
    location: "Guéliz, Marrakech",
    dimensions: "140 m²",
    description: "Réhabilitation totale d'un appartement ancien : redistribution des espaces, mise aux normes électrique et plomberie, nouvelles cuisines et salles de bains, et finitions modernes.",
    keyPoints: [
      "Démolition et redistribution des cloisons",
      "Mise aux normes électricité et plomberie",
      "Rénovation cuisine et salles de bains",
      "Sols, peinture et faux plafonds neufs"
    ],
    image: img("photo-1600596542815-ffad4c1539a9"),
    beforeImage: img("photo-1574359411659-15573a27fd0c"),
    afterImage: img("photo-1600596542815-ffad4c1539a9"),
    isDemonstration: true,
    hasBeforeAfter: true,
    beforeLabel: "Appartement vétuste, agencement cloisonné",
    afterLabel: "Espaces ouverts, finitions modernes"
  },
  {
    id: "proj_3",
    slug: "immeuble-r-plus-4-targa",
    title: "Gros Œuvre d'un Immeuble R+4",
    category: "construction",
    categoryLabel: "Projet Immobilier",
    location: "Targa, Marrakech",
    dimensions: "Immeuble R+4, 8 appartements",
    description: "Réalisation du gros œuvre d'un immeuble résidentiel R+4 : fondations profondes, structure poteaux-poutres, planchers et murs, livrés dans les délais.",
    keyPoints: [
      "Fondations et radier dimensionnés par bureau d'études",
      "Structure poteaux-poutres en béton armé",
      "Planchers et escaliers coulés en place",
      "Respect strict du planning de livraison"
    ],
    image: img("photo-1486406146926-c627a92ad1ab"),
    isDemonstration: true,
    hasBeforeAfter: false
  },
  {
    id: "proj_4",
    slug: "amenagement-exterieur-ourika",
    title: "Aménagement Extérieur & Clôture",
    category: "amenagement",
    categoryLabel: "Aménagement Extérieur",
    location: "Route de l'Ourika, Marrakech",
    dimensions: "Terrain 1 200 m²",
    description: "Aménagement complet des extérieurs d'une propriété : mur de clôture en béton armé, terrasse en béton désactivé, allées carrossables et espaces verts.",
    keyPoints: [
      "Mur de clôture et portail sur mesure",
      "Terrasse et allées en béton désactivé",
      "Gestion des eaux pluviales et drainage",
      "Plantations et éclairage extérieur"
    ],
    image: img("photo-1512917774080-9991f1c4c750"),
    beforeImage: img("photo-1574359411659-15573a27fd0c"),
    afterImage: img("photo-1512917774080-9991f1c4c750"),
    isDemonstration: true,
    hasBeforeAfter: true,
    beforeLabel: "Terrain brut non aménagé",
    afterLabel: "Extérieurs clôturés et paysagés"
  }
];

export const initialMaintenancePlans: MaintenancePlan[] = [
  {
    id: "plan_1",
    name: "Contrat Entretien Particulier",
    targetAudience: "Villas & Résidences",
    idealFor: "Propriétaires souhaitant entretenir durablement leur bien sans souci",
    visitsPerMonth: "Visites planifiées selon besoin (mensuel / trimestriel)",
    features: [
      "Visite d'inspection programmée du bâtiment",
      "Contrôle étanchéité, fissures et infiltrations",
      "Petites réparations maçonnerie et peinture",
      "Vérification des réseaux électriques et plomberie",
      "Entretien des extérieurs et évacuations",
      "Rapport d'intervention après chaque passage",
      "Devis prioritaire pour travaux complémentaires"
    ],
    isPopular: true
  },
  {
    id: "plan_2",
    name: "Contrat Maintenance Professionnelle",
    targetAudience: "Syndics, Immeubles & Entreprises",
    idealFor: "Gestionnaires de bâtiments nécessitant un suivi régulier et réactif",
    visitsPerMonth: "Interventions régulières + astreinte prioritaire",
    features: [
      "Plan de maintenance préventive du bâtiment",
      "Entretien des parties communes et extérieurs",
      "Interventions multi-corps d'état coordonnées",
      "Dépannage prioritaire sous 24 à 48h",
      "Suivi et traçabilité des interventions",
      "Référent technique dédié joignable",
      "Tarifs négociés pour travaux récurrents"
    ],
    isPopular: false
  },
  {
    id: "plan_3",
    name: "Intervention Ponctuelle",
    targetAudience: "Tous Bâtiments",
    idealFor: "Réparation unique, reprise d'étanchéité ou petits travaux",
    visitsPerMonth: "À la demande",
    features: [
      "Diagnostic sur place et devis clair",
      "Réparation ciblée et durable",
      "Reprise d'infiltrations et de fissures",
      "Petits travaux tous corps d'état",
      "Conseils d'entretien personnalisés",
      "Intervention rapide sur Marrakech"
    ],
    isPopular: false
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: "blog_1",
    slug: "etapes-cles-construction-maison-marrakech",
    title: "Les étapes clés d'une construction de maison réussie à Marrakech",
    category: "Construction",
    readTime: "5 min",
    publishedAt: "15 Mars 2026",
    excerpt: "Du terrain au emménagement, découvrez les grandes étapes d'un projet de construction maîtrisé et sans mauvaise surprise.",
    content: [
      "Construire sa maison est un projet de vie qui demande méthode et anticipation. Voici les étapes incontournables pour un chantier maîtrisé.",
      "1. L'étude et les plans : avant tout, l'architecte et le bureau d'études définissent les plans, la structure et déposent la demande de permis de construire.",
      "2. Le terrassement et les fondations : la nature du sol détermine le type de fondations. Un radier ou des semelles en béton armé assurent la stabilité de l'ouvrage.",
      "3. Le gros œuvre : élévation des murs, coulage des planchers et de la structure poteaux-poutres. C'est le squelette de la maison.",
      "4. Le second œuvre et les finitions : électricité, plomberie, plâtrerie, carrelage, peinture et menuiserie donnent vie au bâtiment avant la réception du chantier."
    ],
    isDraft: false
  },
  {
    id: "blog_2",
    slug: "eviter-infiltrations-toiture-terrasse",
    title: "Comment éviter les infiltrations sur une toiture-terrasse ?",
    category: "Étanchéité",
    readTime: "3 min",
    publishedAt: "22 Février 2026",
    excerpt: "Les toitures-terrasses sont exposées. Une bonne étanchéité protège durablement votre bâtiment des infiltrations.",
    content: [
      "Les infiltrations sont l'une des principales causes de dégradation des bâtiments. Sur une toiture-terrasse, la vigilance est essentielle.",
      "La forme de pente : une pente minimale est indispensable pour évacuer l'eau vers les descentes. Une terrasse plate accumule l'eau et fragilise l'étanchéité.",
      "Le choix du système : membrane bitumineuse soudée ou résine d'étanchéité, chaque solution a ses avantages selon la configuration et l'usage de la terrasse.",
      "Les points singuliers : relevés, évacuations et joints de dilatation sont les zones les plus sensibles. Ils doivent être traités avec le plus grand soin.",
      "L'entretien : un contrôle annuel des évacuations et des relevés permet d'anticiper les problèmes avant qu'ils ne causent des dégâts à l'intérieur."
    ],
    isDraft: false
  },
  {
    id: "blog_3",
    slug: "renover-ou-construire-que-choisir",
    title: "Rénover ou construire : comment faire le bon choix ?",
    category: "Rénovation",
    readTime: "4 min",
    publishedAt: "10 Janvier 2026",
    excerpt: "Entre rénovation d'un bien existant et construction neuve, le bon choix dépend de plusieurs critères. Nos conseils.",
    content: [
      "Faut-il rénover un bien existant ou construire du neuf ? La réponse dépend de votre budget, de l'état du bâti et de vos objectifs.",
      "L'état de la structure : si les fondations et la structure sont saines, la rénovation est souvent plus économique et plus rapide.",
      "Le budget : la rénovation permet d'étaler les travaux par étapes, tandis que la construction neuve offre une maîtrise totale mais demande un investissement initial plus important.",
      "Les performances : une construction neuve respecte les dernières normes thermiques et de sécurité. Une rénovation lourde peut toutefois atteindre un niveau de confort équivalent.",
      "Notre conseil : un diagnostic technique préalable permet de comparer objectivement les deux scénarios et de chiffrer précisément chaque option."
    ],
    isDraft: false
  }
];

export const initialFAQ: FAQItem[] = [
  {
    id: "faq_1",
    category: "prix",
    question: "Comment établissez-vous vos devis ?",
    answer: "Après une visite technique sur place et un métré précis, nous remettons un devis détaillé poste par poste, clair et sans surprise. L'étude et le devis sont gratuits et sans engagement."
  },
  {
    id: "faq_2",
    category: "construction",
    question: "Quels sont les délais pour une construction ?",
    answer: "Les délais dépendent de la nature et de la taille du projet. Pour une villa, comptez en moyenne 8 à 14 mois selon les finitions. Un planning prévisionnel est fourni avec le devis et suivi tout au long du chantier."
  },
  {
    id: "faq_3",
    category: "construction",
    question: "Intervenez-vous uniquement à Marrakech ?",
    answer: "Notre base est au Quartier Industriel Sidi Ghanem à Marrakech. Nous intervenons sur toute la ville, sa périphérie (Palmeraie, Targa, Route de l'Ourika…) et la région Marrakech-Safi."
  },
  {
    id: "faq_4",
    category: "renovation",
    question: "Gérez-vous tous les corps d'état ?",
    answer: "Oui. SLT SERVICES coordonne l'ensemble des corps d'état (gros œuvre, électricité, plomberie, menuiserie, finitions) avec un interlocuteur unique, ce qui vous évite de gérer plusieurs entreprises."
  },
  {
    id: "faq_5",
    category: "prix",
    question: "Faut-il un architecte pour mon projet ?",
    answer: "Pour une construction neuve soumise à permis de construire, un architecte est requis. Nous travaillons avec le vôtre ou pouvons vous recommander des partenaires de confiance."
  },
  {
    id: "faq_6",
    category: "depannage",
    question: "Réalisez-vous aussi de petits travaux ?",
    answer: "Absolument. Au-delà des grands chantiers, nous assurons les travaux divers, la maintenance et les réparations ponctuelles, pour les particuliers comme pour les professionnels et syndics."
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: "test_1",
    name: "Karim B.",
    role: "Propriétaire de villa",
    propertyType: "Villa contemporaine",
    location: "Palmeraie, Marrakech",
    content: "SLT SERVICES a construit notre villa de A à Z. Chantier sérieux, délais respectés et finitions impeccables. Un interlocuteur unique du début à la fin, c'est un vrai confort.",
    rating: 5,
    projectType: "Construction neuve",
    verified: true
  },
  {
    id: "test_2",
    name: "Sophie M.",
    role: "Gérante d'immeuble",
    propertyType: "Résidence 8 logements",
    location: "Guéliz, Marrakech",
    content: "Rénovation complète de deux appartements et entretien des parties communes. Équipe réactive, propre et de bon conseil. Je recommande pour le suivi professionnel.",
    rating: 5,
    projectType: "Rénovation & maintenance",
    verified: true
  },
  {
    id: "test_3",
    name: "Hassan E.",
    role: "Architecte",
    propertyType: "Projet résidentiel",
    location: "Targa, Marrakech",
    content: "Nous avons confié à SLT SERVICES le gros œuvre d'un immeuble R+4. Maîtrise technique, respect des plans et du planning. Une entreprise fiable pour nos chantiers.",
    rating: 5,
    projectType: "Gros œuvre",
    verified: true
  }
];

export const initialLeads: Lead[] = [
  {
    id: "lead_1001",
    ref: "SLT-2026-1001",
    createdAt: "2026-10-26T10:15:00Z",
    name: "Omar Tazi",
    phone: "+212 6 61 22 33 44",
    whatsapp: "+212 6 61 22 33 44",
    email: "omar.tazi@example.ma",
    city: "Marrakech (Palmeraie)",
    source: "formulaire_devis",
    originPage: "/devis",
    service: "Gros Œuvre & Construction",
    description: "Projet de construction d'une villa R+1 d'environ 300 m² sur terrain déjà viabilisé. Souhaite une étude et un devis gros œuvre + finitions.",
    urgency: "cette_semaine",
    details: {
      type: "Construction villa",
      surface: "300 m² (R+1)",
      terrain: "Viabilisé et accessible",
      echeance: "Démarrage sous 3 mois"
    },
    status: "qualifie",
    priority: "eleve",
    assignedTo: "Directeur Technique",
    internalNotes: "Contact sérieux, plans d'architecte disponibles. Visite de terrain fixée vendredi à 11h.",
    followUpDate: "2026-10-31",
    history: [
      {
        timestamp: "2026-10-26T10:15:00Z",
        action: "Demande reçue via le formulaire de devis",
        user: "Système"
      },
      {
        timestamp: "2026-10-26T14:30:00Z",
        action: "Appel de qualification effectué",
        user: "Admin",
        note: "Projet très sérieux, permis de construire validé, terrain prêt."
      }
    ]
  },
  {
    id: "lead_1002",
    ref: "SLT-2026-1002",
    createdAt: "2026-10-27T08:45:00Z",
    name: "Nadia Bennani",
    phone: "+212 6 70 88 99 00",
    whatsapp: "+212 6 70 88 99 00",
    email: "n.bennani@example.com",
    city: "Route de l'Ourika",
    source: "depannage_urgent",
    originPage: "/depannage",
    service: "Travaux Divers & Maintenance",
    description: "Infiltration importante au niveau de la toiture-terrasse après les pluies. Traces d'humidité au plafond du dernier étage.",
    urgency: "immediate",
    details: {
      probleme: "Infiltration toiture-terrasse",
      zone: "Dernier étage",
      urgent: true
    },
    status: "visite_programmee",
    priority: "urgent",
    assignedTo: "Chef de Chantier",
    internalNotes: "Passage calé aujourd'hui en fin d'après-midi. Prévoir diagnostic étanchéité et reprise des relevés.",
    followUpDate: "2026-10-28",
    history: [
      {
        timestamp: "2026-10-27T08:45:00Z",
        action: "Demande d'intervention urgente enregistrée",
        user: "Système"
      },
      {
        timestamp: "2026-10-27T09:10:00Z",
        action: "Prise en charge par le responsable technique",
        user: "Admin"
      }
    ]
  },
  {
    id: "lead_1003",
    ref: "SLT-2026-1003",
    createdAt: "2026-10-27T16:20:00Z",
    name: "M. Delacroix",
    phone: "+212 6 12 34 56 78",
    whatsapp: "+212 6 12 34 56 78",
    city: "Marrakech Guéliz",
    source: "maintenance",
    originPage: "/maintenance",
    service: "Contrats de maintenance",
    description: "Demande de contrat de maintenance annuel pour un immeuble de 8 logements (parties communes, étanchéité, petits travaux).",
    urgency: "cette_semaine",
    details: {
      formule: "Contrat Maintenance Professionnelle",
      batiment: "Immeuble 8 logements",
      besoins: "Parties communes & étanchéité"
    },
    status: "devis_envoye",
    priority: "normal",
    assignedTo: "Chargé Commercial",
    internalNotes: "Proposition de contrat annuel envoyée par email et WhatsApp. En attente de validation du syndic.",
    followUpDate: "2026-11-02",
    history: [
      {
        timestamp: "2026-10-27T16:20:00Z",
        action: "Demande de contrat de maintenance reçue",
        user: "Système"
      },
      {
        timestamp: "2026-10-28T09:00:00Z",
        action: "Devis n° DE-2026-088 envoyé",
        user: "Admin"
      }
    ]
  }
];
