/**
 * Back-end Supabase (Postgres).
 *
 * Utilise la clé service_role côté serveur : les politiques RLS sont donc
 * contournées (le serveur est de confiance). Le contenu éditorial est stocké
 * en jsonb `data` (= le type TS), avec quelques colonnes plates pour tri/filtre.
 * Les leads sont stockés en colonnes plates (mapping camelCase <-> snake_case).
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
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

const nz = <T>(v: T | undefined): T | null => (v === undefined ? null : v);

/** Lead (camelCase) -> ligne Postgres (snake_case). */
function leadToRow(l: Lead) {
  return {
    id: l.id,
    ref: l.ref,
    created_at: l.createdAt,
    name: l.name,
    phone: l.phone,
    whatsapp: nz(l.whatsapp),
    email: nz(l.email),
    city: nz(l.city),
    source: nz(l.source),
    origin_page: nz(l.originPage),
    service: nz(l.service),
    description: nz(l.description),
    urgency: nz(l.urgency),
    details: l.details ?? {},
    status: l.status,
    priority: l.priority,
    assigned_to: nz(l.assignedTo),
    internal_notes: l.internalNotes ?? '',
    follow_up_date: nz(l.followUpDate),
    history: l.history ?? []
  };
}

/** Ligne Postgres -> Lead (camelCase). */
function rowToLead(r: any): Lead {
  return {
    id: r.id,
    ref: r.ref,
    createdAt: r.created_at,
    name: r.name,
    phone: r.phone,
    whatsapp: r.whatsapp ?? undefined,
    email: r.email ?? undefined,
    city: r.city,
    source: r.source,
    originPage: r.origin_page,
    service: r.service,
    description: r.description,
    urgency: r.urgency ?? undefined,
    details: r.details ?? {},
    status: r.status,
    priority: r.priority,
    assignedTo: r.assigned_to ?? undefined,
    internalNotes: r.internal_notes ?? '',
    followUpDate: r.follow_up_date ?? undefined,
    history: r.history ?? []
  };
}

export class SupabaseStore implements Store {
  readonly backend = 'supabase' as const;
  private sb: SupabaseClient;

  constructor(url: string, serviceRoleKey: string) {
    this.sb = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  }

  private async rows(table: string, order = 'sort_order'): Promise<any[]> {
    const { data, error } = await this.sb.from(table).select('data').order(order, { ascending: true });
    if (error) throw new Error(`[store:supabase] select ${table}: ${error.message}`);
    return (data ?? []).map((r: any) => r.data);
  }

  // ----- Settings (singleton id=1) -----
  async getSettings(): Promise<CompanySettings> {
    const { data, error } = await this.sb.from('settings').select('data').eq('id', 1).maybeSingle();
    if (error) throw new Error(`[store:supabase] get settings: ${error.message}`);
    return data?.data as CompanySettings;
  }
  async updateSettings(patch: Partial<CompanySettings>): Promise<CompanySettings> {
    const current = (await this.getSettings()) || ({} as CompanySettings);
    const merged = { ...current, ...patch } as CompanySettings;
    const { error } = await this.sb
      .from('settings')
      .upsert({ id: 1, data: merged, updated_at: new Date().toISOString() });
    if (error) throw new Error(`[store:supabase] update settings: ${error.message}`);
    return merged;
  }

  // ----- Services -----
  async listServices(): Promise<ServiceItem[]> {
    return this.rows('services');
  }
  private async nextOrder(table: string): Promise<number> {
    const { count } = await this.sb.from(table).select('id', { count: 'exact', head: true });
    return (count ?? 0) + 1;
  }
  async createService(s: ServiceItem): Promise<ServiceItem> {
    const { error } = await this.sb
      .from('services')
      .insert({ id: s.id, slug: s.slug, sort_order: await this.nextOrder('services'), data: s });
    if (error) throw new Error(`[store:supabase] create service: ${error.message}`);
    return s;
  }
  async updateService(id: string, patch: Partial<ServiceItem>): Promise<ServiceItem | null> {
    return this.mergeJsonRow('services', id, patch, r => ({ slug: r.slug }));
  }

  // ----- Products -----
  async listProducts(): Promise<ProductItem[]> {
    return this.rows('products');
  }
  async createProduct(p: ProductItem): Promise<ProductItem> {
    const { error } = await this.sb.from('products').insert({
      id: p.id,
      slug: p.slug,
      category: p.category,
      sort_order: await this.nextOrder('products'),
      data: p
    });
    if (error) throw new Error(`[store:supabase] create product: ${error.message}`);
    return p;
  }
  async updateProduct(id: string, patch: Partial<ProductItem>): Promise<ProductItem | null> {
    return this.mergeJsonRow('products', id, patch, r => ({ slug: r.slug, category: r.category }));
  }
  async deleteProduct(id: string): Promise<boolean> {
    return this.deleteRow('products', id);
  }

  // ----- Projects -----
  async listProjects(): Promise<ProjectItem[]> {
    return this.rows('projects');
  }
  async updateProject(id: string, patch: Partial<ProjectItem>): Promise<ProjectItem | null> {
    return this.mergeJsonRow('projects', id, patch, r => ({ slug: r.slug, category: r.category }));
  }

  // ----- Blog -----
  async listBlog(): Promise<BlogPost[]> {
    const { data, error } = await this.sb
      .from('blog_posts')
      .select('data')
      .order('published_at', { ascending: false });
    if (error) throw new Error(`[store:supabase] list blog: ${error.message}`);
    return (data ?? []).map((r: any) => r.data);
  }
  async updateBlog(id: string, patch: Partial<BlogPost>): Promise<BlogPost | null> {
    return this.mergeJsonRow('blog_posts', id, patch, r => ({
      slug: r.slug,
      is_draft: !!r.isDraft,
      published_at: r.publishedAt ?? null
    }));
  }

  // ----- Contenu en lecture seule -----
  async listFaq(): Promise<FAQItem[]> {
    return this.rows('faq');
  }
  async listTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await this.sb.from('testimonials').select('data');
    if (error) throw new Error(`[store:supabase] list testimonials: ${error.message}`);
    return (data ?? []).map((r: any) => r.data);
  }
  async listMaintenancePlans(): Promise<MaintenancePlan[]> {
    return this.rows('maintenance_plans');
  }

  // ----- Leads -----
  async listLeads(): Promise<Lead[]> {
    const { data, error } = await this.sb.from('leads').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(`[store:supabase] list leads: ${error.message}`);
    return (data ?? []).map(rowToLead);
  }
  async createLead(lead: Lead): Promise<Lead> {
    const { error } = await this.sb.from('leads').insert(leadToRow(lead));
    if (error) throw new Error(`[store:supabase] create lead: ${error.message}`);
    return lead;
  }
  async saveLead(lead: Lead): Promise<Lead> {
    const { error } = await this.sb.from('leads').upsert(leadToRow(lead));
    if (error) throw new Error(`[store:supabase] save lead: ${error.message}`);
    return lead;
  }
  async deleteLead(id: string): Promise<boolean> {
    return this.deleteRow('leads', id);
  }

  // ----- Helpers jsonb -----
  /**
   * Lit la ligne, fusionne le patch dans `data`, ré-écrit data + colonnes plates.
   * `flat` recalcule les colonnes de filtre/tri à partir de l'objet fusionné.
   */
  private async mergeJsonRow<T>(
    table: string,
    id: string,
    patch: Partial<T>,
    flat: (merged: any) => Record<string, any>
  ): Promise<T | null> {
    const { data: row, error: selErr } = await this.sb
      .from(table)
      .select('data')
      .eq('id', id)
      .maybeSingle();
    if (selErr) throw new Error(`[store:supabase] read ${table}: ${selErr.message}`);
    if (!row) return null;

    const merged = { ...(row.data as object), ...patch } as any;
    const { error: updErr } = await this.sb
      .from(table)
      .update({ data: merged, updated_at: new Date().toISOString(), ...flat(merged) })
      .eq('id', id);
    if (updErr) throw new Error(`[store:supabase] update ${table}: ${updErr.message}`);
    return merged as T;
  }

  private async deleteRow(table: string, id: string): Promise<boolean> {
    const { data, error } = await this.sb.from(table).delete().eq('id', id).select('id');
    if (error) throw new Error(`[store:supabase] delete ${table}: ${error.message}`);
    return (data?.length ?? 0) > 0;
  }
}
