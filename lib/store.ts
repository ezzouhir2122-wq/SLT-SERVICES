/**
 * Couche de stockage — interface unique, deux back-ends.
 *
 *  - Supabase (Postgres)  : activé si SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *                           sont présents. Persistance réelle, multi-instance.
 *  - Fichier JSON (db.json): secours automatique sinon, pour garder le dev /
 *                           AI Studio fonctionnel sans aucune config.
 *
 * server.ts ne connaît que l'interface `Store` : les routes /api restent
 * identiques, seul le back-end change.
 */
import type {
  CompanySettings,
  ServiceItem,
  ProductItem,
  ProjectItem,
  MaintenancePlan,
  BlogPost,
  FAQItem,
  Testimonial,
  Lead
} from '../src/types/index.ts';

export interface Store {
  readonly backend: 'supabase' | 'file';

  getSettings(): Promise<CompanySettings>;
  updateSettings(patch: Partial<CompanySettings>): Promise<CompanySettings>;

  listServices(): Promise<ServiceItem[]>;
  createService(service: ServiceItem): Promise<ServiceItem>;
  updateService(id: string, patch: Partial<ServiceItem>): Promise<ServiceItem | null>;

  listProducts(): Promise<ProductItem[]>;
  createProduct(product: ProductItem): Promise<ProductItem>;
  updateProduct(id: string, patch: Partial<ProductItem>): Promise<ProductItem | null>;
  deleteProduct(id: string): Promise<boolean>;

  listProjects(): Promise<ProjectItem[]>;
  updateProject(id: string, patch: Partial<ProjectItem>): Promise<ProjectItem | null>;

  listBlog(): Promise<BlogPost[]>;
  updateBlog(id: string, patch: Partial<BlogPost>): Promise<BlogPost | null>;

  listFaq(): Promise<FAQItem[]>;
  listTestimonials(): Promise<Testimonial[]>;
  listMaintenancePlans(): Promise<MaintenancePlan[]>;

  listLeads(): Promise<Lead[]>;
  createLead(lead: Lead): Promise<Lead>;
  /** Remplacement complet de l'enregistrement (la route a déjà fusionné). */
  saveLead(lead: Lead): Promise<Lead>;
  deleteLead(id: string): Promise<boolean>;
}
