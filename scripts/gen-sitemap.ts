/**
 * Génère public/sitemap.xml à partir de src/data/initialData.ts pour rester
 * synchronisé avec les services, équipements, réalisations et articles.
 * Lancer : npx tsx scripts/gen-sitemap.ts
 */
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  initialServices,
  initialProducts,
  initialProjects,
  initialBlogPosts,
} from '../src/data/initialData.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = (process.env.VITE_SITE_URL || 'https://slt-services.vercel.app').replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);

interface Entry { loc: string; priority: string; }

const entries: Entry[] = [
  { loc: '/', priority: '1.0' },
  { loc: '/devis', priority: '0.9' },
  { loc: '/services', priority: '0.9' },
  { loc: '/equipements', priority: '0.8' },
  { loc: '/realisations', priority: '0.7' },
  { loc: '/maintenance', priority: '0.8' },
  { loc: '/depannage', priority: '0.8' },
  { loc: '/a-propos', priority: '0.6' },
  { loc: '/blog', priority: '0.6' },
  { loc: '/contact', priority: '0.7' },
];

for (const s of initialServices) entries.push({ loc: `/services/${s.slug}`, priority: '0.7' });
for (const p of initialProducts) entries.push({ loc: `/equipements/${p.slug}`, priority: '0.6' });
for (const p of initialProjects) entries.push({ loc: `/realisations/${p.slug}`, priority: '0.5' });
for (const b of initialBlogPosts.filter(b => !b.isDraft)) entries.push({ loc: `/blog/${b.slug}`, priority: '0.5' });

const urls = entries
  .map(e => `  <url>\n    <loc>${SITE_URL}${e.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`)
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

const out = path.join(__dirname, '..', 'public', 'sitemap.xml');
writeFileSync(out, xml, 'utf-8');
console.log(`sitemap.xml généré : ${entries.length} URLs → ${out}`);
