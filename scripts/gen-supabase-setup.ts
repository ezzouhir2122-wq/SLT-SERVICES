/**
 * Génère supabase/setup.sql = schéma (schema.sql) + seed des données initiales.
 * Le seed est produit à partir de src/data/initialData.ts pour éviter toute
 * recopie manuelle. Lancer : npx tsx scripts/gen-supabase-setup.ts
 */
import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  initialCompanySettings,
  initialServices,
  initialProducts,
  initialProjects,
  initialMaintenancePlans,
  initialBlogPosts,
  initialFAQ,
  initialTestimonials
} from '../src/data/initialData.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

// Dollar-quoting => aucun échappement d'apostrophe nécessaire dans le JSON.
const j = (obj: unknown) => `$json$${JSON.stringify(obj)}$json$::jsonb`;
const s = (v: unknown) => (v === undefined || v === null ? 'null' : `'${String(v).replace(/'/g, "''")}'`);

const out: string[] = [];
out.push('\n-- ============================================================');
out.push('-- SEED — données initiales (généré automatiquement)');
out.push('-- ============================================================\n');

out.push(
  `insert into public.settings (id, data) values (1, ${j(initialCompanySettings)})\n` +
    `  on conflict (id) do update set data = excluded.data, updated_at = now();\n`
);

initialServices.forEach((it, i) => {
  out.push(
    `insert into public.services (id, slug, sort_order, data) values (${s(it.id)}, ${s(it.slug)}, ${i + 1}, ${j(it)})\n` +
      `  on conflict (id) do update set slug=excluded.slug, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();`
  );
});

initialProducts.forEach((it, i) => {
  out.push(
    `insert into public.products (id, slug, category, sort_order, data) values (${s(it.id)}, ${s(it.slug)}, ${s(it.category)}, ${i + 1}, ${j(it)})\n` +
      `  on conflict (id) do update set slug=excluded.slug, category=excluded.category, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();`
  );
});

initialProjects.forEach((it, i) => {
  out.push(
    `insert into public.projects (id, slug, category, sort_order, data) values (${s(it.id)}, ${s(it.slug)}, ${s(it.category)}, ${i + 1}, ${j(it)})\n` +
      `  on conflict (id) do update set slug=excluded.slug, category=excluded.category, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();`
  );
});

initialMaintenancePlans.forEach((it, i) => {
  out.push(
    `insert into public.maintenance_plans (id, sort_order, data) values (${s(it.id)}, ${i + 1}, ${j(it)})\n` +
      `  on conflict (id) do update set sort_order=excluded.sort_order, data=excluded.data, updated_at=now();`
  );
});

initialBlogPosts.forEach((it) => {
  out.push(
    `insert into public.blog_posts (id, slug, is_draft, published_at, data) values (${s(it.id)}, ${s(it.slug)}, ${it.isDraft ? 'true' : 'false'}, ${s(it.publishedAt)}, ${j(it)})\n` +
      `  on conflict (id) do update set slug=excluded.slug, is_draft=excluded.is_draft, published_at=excluded.published_at, data=excluded.data, updated_at=now();`
  );
});

initialFAQ.forEach((it, i) => {
  out.push(
    `insert into public.faq (id, category, sort_order, data) values (${s(it.id)}, ${s(it.category)}, ${i + 1}, ${j(it)})\n` +
      `  on conflict (id) do update set category=excluded.category, sort_order=excluded.sort_order, data=excluded.data, updated_at=now();`
  );
});

initialTestimonials.forEach((it) => {
  out.push(
    `insert into public.testimonials (id, verified, data) values (${s(it.id)}, ${it.verified ? 'true' : 'false'}, ${j(it)})\n` +
      `  on conflict (id) do update set verified=excluded.verified, data=excluded.data, updated_at=now();`
  );
});

const schema = readFileSync(path.join(root, 'supabase', 'schema.sql'), 'utf-8');
const setup = schema.trimEnd() + '\n' + out.join('\n') + '\n';
writeFileSync(path.join(root, 'supabase', 'setup.sql'), setup, 'utf-8');
console.log('OK -> supabase/setup.sql (' + setup.length + ' octets)');
