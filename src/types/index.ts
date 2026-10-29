export type LeadStatus = 
  | 'nouveau'
  | 'a_contacter'
  | 'contacte'
  | 'qualifie'
  | 'visite_programmee'
  | 'devis_envoye'
  | 'negociation'
  | 'gagne'
  | 'perdu';

export type LeadPriority = 'urgent' | 'eleve' | 'normal' | 'faible';

export interface LeadHistoryItem {
  timestamp: string;
  action: string;
  user: string;
  note?: string;
}

export interface Lead {
  id: string;
  ref: string;
  createdAt: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  city: string;
  source: 'formulaire_devis' | 'devis_rapide' | 'depannage_urgent' | 'whatsapp' | 'fiche_produit' | 'maintenance' | 'contact';
  originPage: string;
  service: string;
  description: string;
  urgency?: 'immediate' | '24_48h' | 'cette_semaine' | 'flexible';
  details?: Record<string, any>;
  status: LeadStatus;
  priority: LeadPriority;
  assignedTo?: string;
  internalNotes?: string;
  followUpDate?: string;
  history: LeadHistoryItem[];
}

export interface CompanySettings {
  companyName: string;
  slogan: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  primaryCity: string;
  citiesCovered: string[];
  openingHours: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  allowEmergencyCalls: boolean;
  gaMeasurementId?: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  kicker: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  solutions: string[];
  clientProblems: string[];
  prestations: string[];
  advantages: string[];
  faq: { question: string; answer: string }[];
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  reference: string;
  brand: string;
  category: string;
  price?: number;
  isPriceOnDemand: boolean;
  shortDescription: string;
  specs: { label: string; value: string }[];
  inStock: boolean;
  featured: boolean;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: 'construction' | 'renovation' | 'amenagement' | 'technique';
  categoryLabel: string;
  location: string;
  dimensions?: string;
  description: string;
  keyPoints: string[];
  isDemonstration: boolean;
  hasBeforeAfter?: boolean;
  beforeLabel?: string;
  afterLabel?: string;
}

export interface MaintenancePlan {
  id: string;
  name: string;
  targetAudience: string;
  idealFor: string;
  visitsPerMonth: string;
  features: string[];
  isPopular?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  publishedAt: string;
  excerpt: string;
  content: string[];
  isDraft: boolean;
}

export interface FAQItem {
  id: string;
  category: 'construction' | 'prix' | 'entretien' | 'pompe_filtration' | 'renovation' | 'depannage';
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  propertyType: string;
  location: string;
  content: string;
  rating: number;
  projectType: string;
  verified: boolean;
}

export interface CRMStats {
  totalLeads: number;
  newLeads: number;
  inProgress: number;
  qualified: number;
  won: number;
  qualificationRate: number;
  conversionRate: number;
  leadsByService: { service: string; count: number }[];
  leadsByCity: { city: string; count: number }[];
  leadsBySource: { source: string; count: number }[];
}
