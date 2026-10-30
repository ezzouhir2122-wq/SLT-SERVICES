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
  { id: 'blog_1', slug: 'concevoir-piscine', title: 'Bien préparer son projet de piscine', category: 'Construction', readTime: '4 min', publishedAt: '2026-10-29', excerpt: 'Les questions à se poser avant de concevoir votre bassin.', content: ['La conception commence par vos usages : détente, nage ou accueil de visiteurs. Le terrain et les accès guident ensuite l’implantation.', 'Définissez la forme, le revêtement et les abords avec votre professionnel. Demandez un devis détaillé qui inclut le bassin, la filtration et la mise en service.'], isDraft: false },
  { id: 'blog_2', slug: 'entretenir-piscine', title: 'Les bons réflexes pour entretenir votre piscine', category: 'Entretien', readTime: '3 min', publishedAt: '2026-10-29', excerpt: 'Nettoyage, filtration et suivi de l’eau : les bases d’un entretien régulier.', content: ['Retirez les débris et nettoyez régulièrement les paniers et le bassin. Adaptez la filtration à l’utilisation de votre piscine et aux recommandations du fabricant.', 'Contrôlez l’eau avec un dispositif adapté. Pour tout produit de traitement, suivez la notice et les conseils de votre professionnel.'], isDraft: false },
  { id: 'blog_3', slug: 'choisir-equipements', title: 'Quels équipements pour votre piscine ?', category: 'Équipements', readTime: '4 min', publishedAt: '2026-10-29', excerpt: 'Pompe, filtre, robot et éclairage : une sélection adaptée au bassin.', content: ['Le choix de la pompe et du filtre dépend du volume du bassin, du réseau hydraulique et des usages.', 'Un robot compatible avec le revêtement facilite le nettoyage. L’éclairage et les accessoires se sélectionnent en tenant compte de l’installation existante.'], isDraft: false }
];
export const initialFAQ: FAQItem[] = [
  { id: 'faq_1', category: 'devis', question: 'Comment obtenir un devis pour ma piscine ?', answer: 'Indiquez votre type de projet, vos coordonnées et votre ville. Nous vous contactons pour préciser vos besoins et organiser une étude du site si nécessaire.' },
  { id: 'faq_2', category: 'construction', question: 'Réalisez-vous des piscines sur mesure ?', answer: 'Oui, la forme, les dimensions, le revêtement et les équipements sont étudiés selon votre terrain et vos attentes.' },
  { id: 'faq_3', category: 'entretien', question: 'Proposez-vous des contrats d’entretien ?', answer: 'Nous proposons un suivi du nettoyage, de la filtration et des équipements. La fréquence des visites est définie selon votre bassin et son utilisation.' },
  { id: 'faq_4', category: 'equipements', question: 'Pouvez-vous remplacer ma pompe ou mon filtre ?', answer: 'Nous examinons votre installation afin de sélectionner un équipement compatible et adapté, puis établissons un devis de fourniture et d’installation.' }
];
export const initialTestimonials: Testimonial[] = [];
export const initialLeads: Lead[] = [];
