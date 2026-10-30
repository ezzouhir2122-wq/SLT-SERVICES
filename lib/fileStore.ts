/**
 * Back-end de secours : base JSON locale (data/db.json).
 * Reprend exactement le comportement historique de server.ts.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initialCompanySettings,
  initialServices,
  initialProducts,
  initialProjects,
  initialMaintenancePlans,
  initialBlogPosts,
  initialFAQ,
  initialTestimonials,
  initialLeads
} from '../src/data/initialData.ts';
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
import type { Store } from './store.ts';

interface DatabaseSchema {
  settings: CompanySettings;
  services: ServiceItem[];
  products: ProductItem[];
  projects: ProjectItem[];
  maintenancePlans: MaintenancePlan[];
  blogPosts: BlogPost[];
  faq: FAQItem[];
  testimonials: Testimonial[];
  leads: Lead[];
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function loadDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  if (fs.existsSync(DB_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      return {
        settings: parsed.settings || initialCompanySettings,
        services: parsed.services || initialServices,
        products: parsed.products || initialProducts,
        projects: parsed.projects || initialProjects,
        maintenancePlans: parsed.maintenancePlans || initialMaintenancePlans,
        blogPosts: parsed.blogPosts || initialBlogPosts,
        faq: parsed.faq || initialFAQ,
        testimonials: parsed.testimonials || initialTestimonials,
        leads: parsed.leads || initialLeads
      };
    } catch (e) {
      console.error('[store:file] db.json illisible, réinitialisation:', e);
    }
  }

  const defaults: DatabaseSchema = {
    settings: initialCompanySettings,
    services: initialServices,
    products: initialProducts,
    projects: initialProjects,
    maintenancePlans: initialMaintenancePlans,
    blogPosts: initialBlogPosts,
    faq: initialFAQ,
    testimonials: initialTestimonials,
    leads: initialLeads
  };
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaults, null, 2), 'utf-8');
  } catch (err) {
    console.error('[store:file] échec écriture db.json initial:', err);
  }
  return defaults;
}

export class FileStore implements Store {
  readonly backend = 'file' as const;
  private db: DatabaseSchema;

  constructor() {
    this.db = loadDatabase();
  }

  private persist(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (err) {
      console.error('[store:file] échec persistance:', err);
    }
  }

  async getSettings() {
    return this.db.settings;
  }
  async updateSettings(patch: Partial<CompanySettings>) {
    this.db.settings = { ...this.db.settings, ...patch };
    this.persist();
    return this.db.settings;
  }

  async listServices() {
    return this.db.services;
  }
  async createService(service: ServiceItem) {
    this.db.services.push(service);
    this.persist();
    return service;
  }
  async updateService(id: string, patch: Partial<ServiceItem>) {
    const i = this.db.services.findIndex(s => s.id === id);
    if (i === -1) return null;
    this.db.services[i] = { ...this.db.services[i], ...patch };
    this.persist();
    return this.db.services[i];
  }

  async listProducts() {
    return this.db.products;
  }
  async createProduct(product: ProductItem) {
    this.db.products.push(product);
    this.persist();
    return product;
  }
  async updateProduct(id: string, patch: Partial<ProductItem>) {
    const i = this.db.products.findIndex(p => p.id === id);
    if (i === -1) return null;
    this.db.products[i] = { ...this.db.products[i], ...patch };
    this.persist();
    return this.db.products[i];
  }
  async deleteProduct(id: string) {
    const before = this.db.products.length;
    this.db.products = this.db.products.filter(p => p.id !== id);
    if (this.db.products.length === before) return false;
    this.persist();
    return true;
  }

  async listProjects() {
    return this.db.projects;
  }
  async updateProject(id: string, patch: Partial<ProjectItem>) {
    const i = this.db.projects.findIndex(p => p.id === id);
    if (i === -1) return null;
    this.db.projects[i] = { ...this.db.projects[i], ...patch };
    this.persist();
    return this.db.projects[i];
  }

  async listBlog() {
    return this.db.blogPosts;
  }
  async updateBlog(id: string, patch: Partial<BlogPost>) {
    const i = this.db.blogPosts.findIndex(b => b.id === id);
    if (i === -1) return null;
    this.db.blogPosts[i] = { ...this.db.blogPosts[i], ...patch };
    this.persist();
    return this.db.blogPosts[i];
  }

  async listFaq() {
    return this.db.faq;
  }
  async listTestimonials() {
    return this.db.testimonials;
  }
  async listMaintenancePlans() {
    return this.db.maintenancePlans;
  }

  async listLeads() {
    return this.db.leads;
  }
  async createLead(lead: Lead) {
    this.db.leads.unshift(lead);
    this.persist();
    return lead;
  }
  async saveLead(lead: Lead) {
    const i = this.db.leads.findIndex(l => l.id === lead.id);
    if (i === -1) this.db.leads.unshift(lead);
    else this.db.leads[i] = lead;
    this.persist();
    return lead;
  }
  async deleteLead(id: string) {
    const before = this.db.leads.length;
    this.db.leads = this.db.leads.filter(l => l.id !== id);
    if (this.db.leads.length === before) return false;
    this.persist();
    return true;
  }
}
