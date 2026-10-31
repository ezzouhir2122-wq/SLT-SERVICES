import type { CompanySettings, ServiceItem, ProductItem, ProjectItem, MaintenancePlan, BlogPost, FAQItem, Testimonial, Lead } from '../types';

const photo = (id: string, w = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
export const poolPhotos = {
  hero: '/assets/pool-hero.png',
  pool: photo('photo-1576013551627-0cc20b96c2a7'),
  terrace: photo('photo-1600596542815-ffad4c1539a9'),
  villa: '/assets/pool-hero.png',
  evening: photo('photo-1564013799919-ab600027ffc6'),
  before: '/assets/pool-before.png'
};

export const initialCompanySettings: CompanySettings = {
  companyName: 'SLT SERVICES',
  slogan: 'Votre piscine, notre expertise. Construction, aménagement, entretien et équipements de piscines au Maroc.',
  phone: '+212 661 586 841', phoneSecondary: '+212 663 116 200', whatsapp: '+212 661 586 841',
  email: 'contact@slt-services.ma', address: 'Bureau N°26, N°484, Quartier Industriel Sidi Ghanem, Marrakech',
  primaryCity: 'Marrakech', citiesCovered: ['Marrakech', 'Guéliz & Hivernage', 'Palmeraie & Environs', 'Targa', 'Route de l’Ourika', 'Route de Fès', 'Tamansourt', 'Autre ville au Maroc'],
  openingHours: 'Lundi au samedi : 08h30 – 18h30', heroImage: poolPhotos.hero, allowEmergencyCalls: true, gaMeasurementId: ''
};

const service = (id: string, slug: string, title: string, description: string, iconName: string, image: string, prestations: string[]): ServiceItem => ({
  id, slug, title, kicker: 'Piscines résidentielles & professionnelles', shortDescription: description,
  fullDescription: `${description} Nous étudions votre bassin, vos usages et les contraintes du site pour vous proposer une solution adaptée, avec un devis détaillé avant intervention.`,
  iconName, image, prestations,
  clientProblems: ['Un projet à dimensionner selon vos besoins', 'Des équipements à choisir ou à remplacer', 'Un besoin de suivi technique et de conseil'],
  solutions: ['Visite et diagnostic de votre installation', 'Proposition technique adaptée à votre piscine', 'Installation et accompagnement à la prise en main'],
  advantages: ['Solutions sur mesure', 'Accompagnement professionnel', 'Équipements adaptés à vos besoins'],
  faq: [{ question: 'Comment obtenir un devis ?', answer: 'Décrivez votre projet et indiquez votre ville. Notre équipe vous contacte pour préciser vos besoins et organiser une visite si nécessaire.' }]
});

export const initialServices: ServiceItem[] = [
  service('serv_1', 'construction-piscines', 'Construction de piscines', 'Piscines sur mesure, béton, skimmers, débordement.', 'BrickWall', poolPhotos.pool, ['Étude et conception du bassin', 'Terrassement et structure en béton', 'Étanchéité et revêtement', 'Piscines à skimmers ou à débordement']),
  service('serv_2', 'amenagement-exterieur', 'Aménagement extérieur', 'Terrasses, margelles, éclairage, espaces verts.', 'Leaf', poolPhotos.terrace, ['Plages et terrasses de piscine', 'Pose de margelles', 'Éclairage extérieur', 'Intégration paysagère']),
  service('serv_3', 'renovation-reparation', 'Rénovation et réparation', 'Réhabilitation, étanchéité, modernisation.', 'Wrench', poolPhotos.villa, ['Diagnostic du bassin', 'Reprise de l’étanchéité', 'Réfection des revêtements', 'Modernisation des équipements']),
  service('serv_4', 'installation-pompes', 'Installation de pompes', 'Pompes, surpresseurs, remplacement.', 'Settings', '/assets/pool-equipment.png#pump', ['Choix et dimensionnement de la pompe', 'Pose et raccordement hydraulique', 'Remplacement de pompes', 'Réglage et mise en service']),
  service('serv_5', 'filtration-equipements', 'Filtration et équipements', 'Filtres, vannes, coffrets, traitement de l’eau.', 'Filter', '/assets/pool-equipment.png#filter', ['Installation de filtres', 'Vannes et coffrets de commande', 'Équipements de traitement de l’eau', 'Optimisation du local technique']),
  service('serv_6', 'entretien-maintenance', 'Entretien et maintenance', 'Nettoyage, suivi, contrats d’entretien.', 'Sparkles', '/assets/pool-equipment.png#robot', ['Nettoyage du bassin', 'Contrôle de la filtration', 'Suivi de la qualité de l’eau', 'Contrats d’entretien adaptés'])
];

const product = (id: string, slug: string, name: string, category: string, tile: string, description: string): ProductItem => ({
  id, slug, name, reference: `PISC-${id}`, brand: 'Sélection SLT SERVICES', category,
  isPriceOnDemand: true, shortDescription: description, image: `/assets/pool-equipment.png#${tile}`,
  specs: [{ label: 'Sélection', value: 'Selon le volume et la configuration du bassin' }, { label: 'Installation', value: 'Sur devis après étude' }],
  inStock: false, featured: true
});
export const initialProducts: ProductItem[] = [
  product('1', 'pompes-piscine', 'Pompes de piscine', 'Pompes', 'pump', 'Pompes de circulation et surpresseurs, sélectionnés selon votre bassin et votre réseau hydraulique.'),
  product('2', 'filtres-sable', 'Filtres à sable', 'Filtration', 'filter', 'Filtres à sable et vannes multivoies pour une filtration adaptée au volume de votre piscine.'),
  product('3', 'robots-nettoyeurs', 'Robots nettoyeurs', 'Nettoyage', 'robot', 'Robots pour le nettoyage du fond et, selon le modèle, des parois du bassin.'),
  product('4', 'eclairage-led', 'Éclairage LED', 'Éclairage', 'light', 'Projecteurs immergés pour mettre en lumière votre piscine et créer une ambiance nocturne.'),
  product('5', 'skimmers-accessoires', 'Skimmers et accessoires', 'Accessoires', 'skimmer', 'Skimmers, paniers et accessoires pour l’aspiration de surface et l’entretien du bassin.'),
  product('6', 'pieces-detachees', 'Pièces détachées', 'Pièces détachées', 'fittings', 'Raccords, unions et pièces de remplacement à vérifier selon votre installation.')
];

export const initialProjects: ProjectItem[] = [
  { id: 'proj_1', slug: 'piscine-villa-contemporaine', title: 'Piscine de villa contemporaine', category: 'construction', categoryLabel: 'Construction de piscine', location: 'Marrakech', description: 'Inspiration pour un bassin résidentiel intégré à une villa et à ses espaces de détente.', keyPoints: ['Bassin sur mesure', 'Intégration à la terrasse', 'Filtration adaptée'], image: poolPhotos.villa, isDemonstration: true },
  { id: 'proj_2', slug: 'renovation-bassin', title: 'Une piscine remise en valeur', category: 'renovation', categoryLabel: 'Rénovation', location: 'Marrakech', description: 'Exemple illustratif de modernisation d’un bassin et de ses abords.', keyPoints: ['Étanchéité', 'Revêtement', 'Modernisation'], image: poolPhotos.pool, beforeImage: poolPhotos.before, afterImage: poolPhotos.pool, hasBeforeAfter: true, isDemonstration: true },
  { id: 'proj_3', slug: 'piscine-eclairage', title: 'Ambiance autour du bassin', category: 'amenagement', categoryLabel: 'Aménagement extérieur', location: 'Marrakech', description: 'Inspiration pour une piscine et des espaces de vie extérieurs harmonieux.', keyPoints: ['Terrasses', 'Margelles', 'Éclairage'], image: poolPhotos.evening, isDemonstration: true },
  { id: 'proj_4', slug: 'piscine-jardin', title: 'Un espace de détente au jardin', category: 'amenagement', categoryLabel: 'Piscine & jardin', location: 'Marrakech', description: 'Exemple d’intégration paysagère d’un bassin dans un jardin résidentiel.', keyPoints: ['Espaces verts', 'Plages de piscine', 'Confort d’utilisation'], image: poolPhotos.pool, isDemonstration: true }
];

export const initialMaintenancePlans: MaintenancePlan[] = [
  { id: 'maint_1', name: 'Essentiel', targetAudience: 'Piscines privées', idealFor: 'Un contrôle régulier de votre piscine', visitsPerMonth: 'Fréquence à définir', features: ['Nettoyage du bassin', 'Contrôle visuel des équipements', 'Conseils d’entretien'] },
  { id: 'maint_2', name: 'Sérénité', targetAudience: 'Résidences et villas', idealFor: 'Un accompagnement pendant la saison', visitsPerMonth: 'Selon les usages du bassin', features: ['Nettoyage et contrôle de la filtration', 'Suivi de la qualité de l’eau', 'Réglage des équipements', 'Compte rendu des interventions'], isPopular: true },
  { id: 'maint_3', name: 'Professionnel', targetAudience: 'Hôtels, riads et résidences', idealFor: 'Un suivi adapté aux piscines professionnelles', visitsPerMonth: 'Planning personnalisé', features: ['Programme d’entretien sur mesure', 'Suivi du local technique', 'Maintenance préventive', 'Interlocuteur dédié'] }
];
export const initialBlogPosts: BlogPost[] = [
  {
    id: 'blog_prix',
    slug: 'prix-piscine-marrakech',
    title: 'Prix d’une piscine à Marrakech : budget, facteurs et exemples (2026)',
    category: 'Construction',
    readTime: '7 min',
    publishedAt: '2026-10-31',
    updatedAt: '2026-10-31',
    author: 'Équipe SLT SERVICES',
    keywords: ['prix piscine Marrakech', 'coût construction piscine Maroc', 'budget piscine', 'tarif piscine béton'],
    excerpt: 'Combien coûte une piscine à Marrakech ? Fourchettes de budget par type de bassin, facteurs de prix et conseils pour cadrer votre projet.',
    metaDescription: 'Prix d’une piscine à Marrakech en 2026 : fourchettes de budget par type (béton, coque, couloir de nage), facteurs qui font varier le coût et devis gratuit SLT SERVICES.',
    heroImage: poolPhotos.pool,
    intro: 'À Marrakech, le budget d’une piscine enterrée se situe le plus souvent entre 120 000 et 400 000 MAD selon la taille, la technique de construction et les finitions. Un petit bassin familial en béton démarre autour de 120 000–180 000 MAD, tandis qu’une piscine sur mesure avec débordement, plage et éclairage dépasse fréquemment 300 000 MAD. Ces montants sont donnés à titre indicatif : seul un devis après étude du terrain est contractuel.',
    content: [
      'À Marrakech, le budget d’une piscine enterrée se situe le plus souvent entre 120 000 et 400 000 MAD selon la taille, la technique et les finitions.',
      'Le prix dépend du type de bassin, de la surface, de la filtration, des abords et de l’accès au chantier. Demandez un devis détaillé pour un chiffrage fiable.',
    ],
    sections: [
      {
        heading: 'Fourchettes de prix selon le type de piscine',
        paragraphs: ['Le poste principal reste la structure du bassin. Voici des ordres de grandeur observés sur la région de Marrakech, hors options et aménagements extérieurs :'],
        bullets: [
          'Piscine béton familiale (≈ 6×3 m, finition classique) : environ 120 000 à 180 000 MAD.',
          'Piscine béton sur mesure (grande taille, revêtement haut de gamme) : 200 000 à 350 000 MAD et plus.',
          'Piscine à débordement ou couloir de nage : généralement au-delà de 300 000 MAD selon la complexité.',
          'Mini-piscine ou petit bassin de détente : à partir de 80 000 à 120 000 MAD.',
        ],
      },
      {
        heading: 'Les facteurs qui font varier le budget',
        paragraphs: ['Deux projets de même surface peuvent afficher des budgets très différents. Les principaux leviers sont :'],
        bullets: [
          'La surface et la profondeur du bassin (volume d’eau, terrassement, béton).',
          'La technique : béton projeté, blocs à bancher, débordement ou skimmers.',
          'Le revêtement : enduit, carrelage, pierre naturelle ou liner.',
          'La filtration et le local technique (pompe, filtre, traitement de l’eau).',
          'Les abords : plage, margelles, terrasse, éclairage et intégration paysagère.',
          'L’accessibilité du terrain pour les engins et l’évacuation des terres.',
        ],
      },
      {
        heading: 'Que comprend un devis sérieux ?',
        paragraphs: ['Un devis complet évite les mauvaises surprises. Il doit détailler le bassin, la filtration, les finitions et la mise en service, pas seulement un prix global.'],
        bullets: [
          'L’étude et l’implantation du bassin sur votre terrain.',
          'Le terrassement, la structure et l’étanchéité.',
          'Le revêtement et les margelles.',
          'La filtration, le local technique et la mise en eau.',
          'Les garanties et le délai de réalisation.',
        ],
      },
      {
        heading: 'Comment réduire le coût sans sacrifier la qualité',
        paragraphs: ['Il est possible d’optimiser le budget en arbitrant sur les options plutôt que sur la structure, qui conditionne la durée de vie du bassin.'],
        bullets: [
          'Choisir une forme simple (rectangulaire) qui limite le terrassement et le béton.',
          'Prioriser une filtration bien dimensionnée plutôt que des gadgets.',
          'Échelonner les aménagements extérieurs (plage, éclairage) sur une 2ᵉ phase.',
        ],
      },
    ],
    faq: [
      { question: 'Quel est le prix moyen d’une piscine à Marrakech ?', answer: 'Pour une piscine béton familiale, comptez le plus souvent entre 120 000 et 180 000 MAD. Les projets sur mesure avec débordement ou grandes dimensions dépassent fréquemment 300 000 MAD. Ces montants sont indicatifs ; seul un devis après visite est contractuel.' },
      { question: 'Le prix inclut-il la filtration et les abords ?', answer: 'Cela dépend du devis. Un devis sérieux précise ce qui est inclus : structure, étanchéité, filtration, margelles et mise en service. Les aménagements extérieurs (terrasse, éclairage, paysage) sont souvent chiffrés à part.' },
      { question: 'Combien de temps pour construire une piscine ?', answer: 'Une construction en béton prend généralement de 6 à 12 semaines selon la taille, la météo et les finitions. Le délai précis figure sur votre devis.' },
      { question: 'Proposez-vous un devis gratuit à Marrakech ?', answer: 'Oui. Décrivez votre projet via notre formulaire de devis : nous vous recontactons pour préciser vos besoins et organiser une visite si nécessaire.' },
    ],
    isDraft: false,
  },
  {
    id: 'blog_1',
    slug: 'construire-piscine-marrakech',
    title: 'Construire sa piscine à Marrakech : étapes, délais et conseils',
    category: 'Construction',
    readTime: '6 min',
    publishedAt: '2026-10-31',
    updatedAt: '2026-10-31',
    author: 'Équipe SLT SERVICES',
    keywords: ['construction piscine Marrakech', 'étapes construction piscine', 'délai piscine béton', 'piscine sur mesure Maroc'],
    excerpt: 'De l’étude à la mise en eau : les étapes d’une construction de piscine, les délais à prévoir et les points de vigilance.',
    metaDescription: 'Construire sa piscine à Marrakech : les étapes (étude, terrassement, structure, étanchéité, filtration, mise en eau), les délais et les conseils de SLT SERVICES.',
    heroImage: poolPhotos.villa,
    intro: 'Construire une piscine en béton à Marrakech suit un parcours en 6 étapes : étude et implantation, terrassement, structure, étanchéité et revêtement, installation de la filtration, puis mise en eau et prise en main. Comptez en général 6 à 12 semaines selon la taille et les finitions. Un projet bien cadré au départ évite les surcoûts et les retards.',
    content: [
      'Construire une piscine en béton suit un parcours en 6 étapes, de l’étude à la mise en eau, sur généralement 6 à 12 semaines.',
      'Le terrain, les usages et les finitions guident chaque décision. Un cahier des charges clair et un devis détaillé sécurisent le projet.',
    ],
    sections: [
      {
        heading: 'Étape 1 — Étude et conception',
        paragraphs: ['Tout commence par vos usages : détente, nage sportive ou accueil de visiteurs. Le terrain, l’exposition et les accès orientent ensuite la forme, les dimensions et l’implantation du bassin. C’est le moment de définir le style et le budget.'],
      },
      {
        heading: 'Étape 2 — Terrassement',
        paragraphs: ['Une fois l’implantation validée, on creuse et on prépare le fond de fouille. L’accès du terrain aux engins et l’évacuation des terres influencent le coût et la durée de cette phase, surtout en zone résidentielle à Marrakech.'],
      },
      {
        heading: 'Étape 3 — Structure et étanchéité',
        paragraphs: ['La structure (béton projeté ou blocs à bancher) donne sa solidité au bassin. Vient ensuite l’étanchéité, étape clé de la durée de vie de la piscine. Le soin apporté ici conditionne l’absence de fuites sur le long terme.'],
      },
      {
        heading: 'Étape 4 — Revêtement et margelles',
        paragraphs: ['Le revêtement (enduit, carrelage, pierre) détermine l’aspect final et le confort. Les margelles assurent la transition avec la plage et la terrasse. C’est l’étape qui donne son caractère à la piscine.'],
      },
      {
        heading: 'Étape 5 — Filtration et local technique',
        paragraphs: ['La pompe, le filtre et le traitement de l’eau sont dimensionnés selon le volume du bassin. Un local technique bien conçu facilite l’entretien et prolonge la durée de vie des équipements.'],
      },
      {
        heading: 'Étape 6 — Mise en eau et prise en main',
        paragraphs: ['Le bassin est rempli, la filtration mise en service et les réglages effectués. Nous vous accompagnons sur les bons gestes d’entretien pour garder une eau saine dès les premières semaines.'],
      },
    ],
    faq: [
      { question: 'Combien de temps dure une construction de piscine ?', answer: 'En béton, comptez généralement 6 à 12 semaines selon la taille, les finitions et la météo. Le délai exact figure sur le devis.' },
      { question: 'Quelle est la meilleure période pour construire à Marrakech ?', answer: 'La construction est possible une grande partie de l’année. L’automne et l’hiver sont souvent privilégiés pour profiter du bassin dès la belle saison suivante.' },
      { question: 'Faut-il une autorisation pour construire une piscine ?', answer: 'Selon la nature du projet et la localisation, des démarches peuvent être nécessaires. Renseignez-vous auprès de votre commune ; nous vous orientons sur les points techniques.' },
    ],
    isDraft: false,
  },
  {
    id: 'blog_2',
    slug: 'entretien-piscine-marrakech',
    title: 'Entretien de piscine à Marrakech : le guide complet (fréquence incluse)',
    category: 'Entretien',
    readTime: '6 min',
    publishedAt: '2026-10-31',
    updatedAt: '2026-10-31',
    author: 'Équipe SLT SERVICES',
    keywords: ['entretien piscine Marrakech', 'eau verte piscine', 'fréquence entretien piscine', 'contrat entretien piscine'],
    excerpt: 'Nettoyage, filtration et équilibre de l’eau : à quelle fréquence entretenir sa piscine et comment éviter l’eau verte.',
    metaDescription: 'Guide complet de l’entretien de piscine à Marrakech : fréquence des gestes (quotidien, hebdomadaire, mensuel), prévention de l’eau verte et contrats d’entretien SLT SERVICES.',
    heroImage: poolPhotos.evening,
    intro: 'Un entretien régulier repose sur trois piliers : le nettoyage du bassin, une filtration adaptée et l’équilibre de l’eau. En saison, prévoyez un contrôle visuel quasi quotidien, un nettoyage hebdomadaire et une vérification mensuelle des équipements. C’est la régularité, plus que l’effort ponctuel, qui évite l’eau verte et les réparations coûteuses.',
    content: [
      'Un entretien régulier repose sur trois piliers : le nettoyage du bassin, une filtration adaptée et l’équilibre de l’eau.',
      'La régularité prime : quelques gestes fréquents valent mieux qu’un gros nettoyage occasionnel. Un contrat d’entretien peut tout prendre en charge.',
    ],
    sections: [
      {
        heading: 'Les 3 piliers d’une eau saine',
        bullets: [
          'Le nettoyage : retirer les débris, brosser les parois, vider les paniers de skimmers.',
          'La filtration : faire tourner la pompe suffisamment chaque jour selon la saison et le volume.',
          'L’équilibre de l’eau : contrôler les paramètres avec un dispositif adapté et suivre les notices des produits.',
        ],
      },
      {
        heading: 'À quelle fréquence entretenir sa piscine ?',
        paragraphs: ['En pleine saison, la piscine demande plus d’attention. Voici un rythme repère à adapter à votre usage et à votre bassin :'],
        bullets: [
          'Chaque jour (en saison) : contrôle visuel, retrait des débris de surface.',
          'Chaque semaine : nettoyage du bassin, paniers et ligne d’eau, contrôle de l’eau.',
          'Chaque mois : vérification de la pompe, du filtre et du local technique.',
          'Selon l’usage : contre-lavage du filtre quand la pression l’indique.',
        ],
      },
      {
        heading: 'Comment éviter (ou rattraper) une eau verte',
        paragraphs: ['L’eau verte vient souvent d’une filtration insuffisante ou d’un déséquilibre de l’eau, fréquent après de fortes chaleurs. La prévention passe par une filtration régulière et un contrôle de l’eau. En cas d’eau déjà verte, augmentez la filtration, nettoyez soigneusement le bassin et faites contrôler l’installation.'],
      },
      {
        heading: 'Pourquoi confier l’entretien à un professionnel',
        paragraphs: ['Un contrat d’entretien garantit la régularité et détecte tôt les petits problèmes avant qu’ils ne deviennent des réparations. C’est particulièrement utile pour les résidences secondaires, les villas en location et les piscines professionnelles (hôtels, riads).'],
      },
    ],
    faq: [
      { question: 'À quelle fréquence nettoyer sa piscine à Marrakech ?', answer: 'En saison, prévoyez un contrôle quasi quotidien, un nettoyage hebdomadaire et une vérification mensuelle des équipements. La fréquence s’adapte à l’usage et à l’environnement du bassin.' },
      { question: 'Pourquoi mon eau devient-elle verte ?', answer: 'Le plus souvent à cause d’une filtration insuffisante ou d’un déséquilibre de l’eau, accentué par la chaleur. Augmenter la filtration, nettoyer le bassin et contrôler l’eau permet de rétablir la situation.' },
      { question: 'Proposez-vous des contrats d’entretien ?', answer: 'Oui, avec des formules adaptées aux particuliers, villas et professionnels. La fréquence des visites est définie selon votre bassin et son utilisation.' },
    ],
    isDraft: false,
  },
  {
    id: 'blog_3',
    slug: 'choisir-equipements-piscine',
    title: 'Quels équipements pour votre piscine ? Pompe, filtre, robot et éclairage',
    category: 'Équipements',
    readTime: '4 min',
    publishedAt: '2026-10-29',
    author: 'Équipe SLT SERVICES',
    keywords: ['équipement piscine', 'pompe filtre piscine', 'robot piscine', 'éclairage piscine'],
    excerpt: 'Pompe, filtre, robot et éclairage : une sélection adaptée au volume et à l’usage du bassin.',
    metaDescription: 'Bien choisir les équipements de sa piscine : pompe, filtre, robot nettoyeur et éclairage, en fonction du volume du bassin et du réseau hydraulique.',
    heroImage: poolPhotos.terrace,
    intro: 'Le choix des équipements dépend avant tout du volume du bassin, du réseau hydraulique et de vos usages. Pompe et filtre doivent être correctement dimensionnés ; le robot et l’éclairage se choisissent selon le revêtement et l’ambiance recherchée.',
    content: [
      'Le choix de la pompe et du filtre dépend du volume du bassin, du réseau hydraulique et des usages.',
      'Un robot compatible avec le revêtement facilite le nettoyage. L’éclairage et les accessoires se sélectionnent en tenant compte de l’installation existante.',
    ],
    sections: [
      {
        heading: 'Pompe et filtration : le cœur du système',
        paragraphs: ['La pompe assure la circulation de l’eau et le filtre retient les impuretés. Ils se dimensionnent ensemble, selon le volume du bassin, pour une eau claire sans surconsommation. Un sous-dimensionnement fatigue le matériel ; un surdimensionnement gaspille de l’énergie.'],
      },
      {
        heading: 'Robot, éclairage et accessoires',
        bullets: [
          'Robot nettoyeur : choisir un modèle compatible avec votre revêtement et la forme du bassin.',
          'Éclairage LED : pour la sécurité et l’ambiance nocturne.',
          'Skimmers et accessoires : à vérifier selon l’installation existante.',
        ],
      },
    ],
    faq: [
      { question: 'Comment choisir la pompe de ma piscine ?', answer: 'Le dimensionnement dépend du volume d’eau et du réseau hydraulique. L’objectif est de filtrer tout le volume du bassin plusieurs fois par jour sans surconsommer. Un professionnel calcule le débit adapté.' },
      { question: 'Pouvez-vous remplacer ma pompe ou mon filtre ?', answer: 'Oui, nous examinons votre installation pour sélectionner un équipement compatible, puis établissons un devis de fourniture et d’installation.' },
    ],
    isDraft: false,
  },
];
export const initialFAQ: FAQItem[] = [
  { id: 'faq_1', category: 'devis', question: 'Comment obtenir un devis pour ma piscine ?', answer: 'Indiquez votre type de projet, vos coordonnées et votre ville. Nous vous contactons pour préciser vos besoins et organiser une étude du site si nécessaire.' },
  { id: 'faq_2', category: 'construction', question: 'Réalisez-vous des piscines sur mesure ?', answer: 'Oui, la forme, les dimensions, le revêtement et les équipements sont étudiés selon votre terrain et vos attentes.' },
  { id: 'faq_3', category: 'entretien', question: 'Proposez-vous des contrats d’entretien ?', answer: 'Nous proposons un suivi du nettoyage, de la filtration et des équipements. La fréquence des visites est définie selon votre bassin et son utilisation.' },
  { id: 'faq_4', category: 'equipements', question: 'Pouvez-vous remplacer ma pompe ou mon filtre ?', answer: 'Nous examinons votre installation afin de sélectionner un équipement compatible et adapté, puis établissons un devis de fourniture et d’installation.' }
];
export const initialTestimonials: Testimonial[] = [];
export const initialLeads: Lead[] = [];
