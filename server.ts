import 'dotenv/config';
import express, { Request, Response, RequestHandler } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Lead, ServiceItem, ProductItem } from './src/types/index.ts';
import { createStore } from './lib/createStore.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = createStore();

/** Enrobe un handler async : toute erreur de stockage renvoie un 500 propre. */
const wrap = (fn: (req: Request, res: Response) => Promise<void>): RequestHandler => {
  return (req, res) => {
    fn(req, res).catch(err => {
      console.error(`[api] ${req.method} ${req.path}:`, err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: 'Erreur serveur interne.' });
      }
    });
  };
};

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ---------------------------------------------------------------- Settings
  app.get('/api/settings', wrap(async (_req, res) => {
    res.json({ success: true, settings: await store.getSettings() });
  }));

  app.put('/api/settings', wrap(async (req, res) => {
    const settings = await store.updateSettings(req.body);
    res.json({ success: true, settings });
  }));

  // ---------------------------------------------------------------- Services
  app.get('/api/services', wrap(async (_req, res) => {
    res.json({ success: true, services: await store.listServices() });
  }));

  app.put('/api/services/:id', wrap(async (req, res) => {
    const service = await store.updateService(req.params.id, req.body);
    if (!service) {
      res.status(404).json({ success: false, error: 'Service not found' });
      return;
    }
    res.json({ success: true, service });
  }));

  app.post('/api/services', wrap(async (req, res) => {
    const newService: ServiceItem = {
      id: `serv_${Date.now()}`,
      slug: req.body.slug || `service-${Date.now()}`,
      title: req.body.title || 'Nouveau service',
      kicker: req.body.kicker || 'Expertise bâtiment',
      shortDescription: req.body.shortDescription || '',
      fullDescription: req.body.fullDescription || '',
      iconName: req.body.iconName || 'Waves',
      solutions: req.body.solutions || [],
      clientProblems: req.body.clientProblems || [],
      prestations: req.body.prestations || [],
      advantages: req.body.advantages || [],
      faq: req.body.faq || []
    };
    const created = await store.createService(newService);
    res.status(201).json({ success: true, service: created });
  }));

  // ---------------------------------------------------------------- Products
  app.get('/api/products', wrap(async (req, res) => {
    const { category, search } = req.query;
    let items = await store.listProducts();

    if (category && typeof category === 'string' && category !== 'all') {
      items = items.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.reference.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, products: items });
  }));

  app.post('/api/products', wrap(async (req, res) => {
    const newProduct: ProductItem = {
      id: `prod_${Date.now()}`,
      slug: req.body.slug || `produit-${Date.now()}`,
      name: req.body.name || 'Nouvel équipement',
      reference: req.body.reference || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: req.body.brand || 'SLT SERVICES',
      category: req.body.category || 'Autres équipements',
      price: req.body.price ? Number(req.body.price) : undefined,
      isPriceOnDemand: req.body.isPriceOnDemand ?? true,
      shortDescription: req.body.shortDescription || '',
      specs: req.body.specs || [],
      inStock: req.body.inStock ?? true,
      featured: req.body.featured ?? false
    };
    const created = await store.createProduct(newProduct);
    res.status(201).json({ success: true, product: created });
  }));

  app.put('/api/products/:id', wrap(async (req, res) => {
    const product = await store.updateProduct(req.params.id, req.body);
    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }
    res.json({ success: true, product });
  }));

  app.delete('/api/products/:id', wrap(async (req, res) => {
    const ok = await store.deleteProduct(req.params.id);
    if (!ok) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }
    res.json({ success: true, message: 'Product deleted' });
  }));

  // ---------------------------------------------------- Projects / Réalisations
  app.get('/api/projects', wrap(async (_req, res) => {
    res.json({ success: true, projects: await store.listProjects() });
  }));

  app.put('/api/projects/:id', wrap(async (req, res) => {
    const project = await store.updateProject(req.params.id, req.body);
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }
    res.json({ success: true, project });
  }));

  // -------------------------------------------------------------------- Blog
  app.get('/api/blog', wrap(async (_req, res) => {
    res.json({ success: true, blogPosts: await store.listBlog() });
  }));

  app.put('/api/blog/:id', wrap(async (req, res) => {
    const post = await store.updateBlog(req.params.id, req.body);
    if (!post) {
      res.status(404).json({ success: false, error: 'Post not found' });
      return;
    }
    res.json({ success: true, post });
  }));

  // --------------------------------------------------------------------- FAQ
  app.get('/api/faq', wrap(async (_req, res) => {
    res.json({ success: true, faq: await store.listFaq() });
  }));

  // ------------------------------------------------------------ Testimonials
  app.get('/api/testimonials', wrap(async (_req, res) => {
    // Public : uniquement les témoignages validés.
    const all = await store.listTestimonials();
    res.json({ success: true, testimonials: all.filter(t => t.verified) });
  }));

  // -------------------------------------------------------- Maintenance plans
  app.get('/api/maintenance-plans', wrap(async (_req, res) => {
    res.json({ success: true, plans: await store.listMaintenancePlans() });
  }));

  // ---------------------------------------------------------------- Leads CRM
  app.get('/api/leads', wrap(async (req, res) => {
    const { status, search, service, city } = req.query;
    let leads = await store.listLeads();

    if (status && typeof status === 'string' && status !== 'all') {
      leads = leads.filter(l => l.status === status);
    }
    if (service && typeof service === 'string' && service !== 'all') {
      leads = leads.filter(l => l.service.toLowerCase().includes(service.toLowerCase()));
    }
    if (city && typeof city === 'string' && city !== 'all') {
      leads = leads.filter(l => l.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      leads = leads.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        l.ref.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
      );
    }

    leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ success: true, leads });
  }));

  app.post('/api/leads', wrap(async (req, res) => {
    const { name, phone, email, whatsapp, city, service, description, source, originPage, urgency, details } = req.body;

    // Validation stricte
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ success: false, error: 'Le nom est requis (minimum 2 caractères).' });
      return;
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      res.status(400).json({ success: false, error: 'Un numéro de téléphone valide est obligatoire.' });
      return;
    }

    const existing = await store.listLeads();

    // Anti-doublon : même téléphone dans les 2 dernières minutes.
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
    const isDuplicate = existing.some(l =>
      l.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, '') &&
      new Date(l.createdAt).getTime() > twoMinutesAgo
    );

    if (isDuplicate) {
      res.status(429).json({
        success: false,
        error: 'Une demande identique a déjà été enregistrée récemment. Notre équipe vous contactera sous peu.'
      });
      return;
    }

    const currentYear = new Date().getFullYear();
    const sequence = 1000 + existing.length + 1;
    const ref = `SLT-${currentYear}-${sequence}`;

    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      ref,
      createdAt: new Date().toISOString(),
      name: name.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp?.trim() || phone.trim(),
      email: email?.trim() || undefined,
      city: city?.trim() || 'Marrakech',
      source: source || 'formulaire_devis',
      originPage: originPage || '/',
      service: service || 'Demande générale',
      description: description?.trim() || 'Demande de renseignements / devis',
      urgency: urgency || 'cette_semaine',
      details: details || {},
      status: 'nouveau',
      priority: urgency === 'immediate' ? 'urgent' : 'normal',
      assignedTo: undefined,
      internalNotes: '',
      history: [
        {
          timestamp: new Date().toISOString(),
          action: `Prospect créé via ${source || 'site web'} (Réf: ${ref})`,
          user: 'Système'
        }
      ]
    };

    const created = await store.createLead(newLead);

    res.status(201).json({
      success: true,
      lead: created,
      reference: created.ref,
      message: 'Demande enregistrée avec succès. Notre équipe vous recontactera rapidement.'
    });
  }));

  app.put('/api/leads/:id', wrap(async (req, res) => {
    const leads = await store.listLeads();
    const current = leads.find(l => l.id === req.params.id);
    if (!current) {
      res.status(404).json({ success: false, error: 'Lead not found' });
      return;
    }

    const { status, priority, assignedTo, internalNotes, followUpDate, actionNote } = req.body;

    const historyItems = [...current.history];
    if (status && status !== current.status) {
      historyItems.push({
        timestamp: new Date().toISOString(),
        action: `Statut changé de "${current.status}" à "${status}"`,
        user: 'Administrateur',
        note: actionNote
      });
    }

    if (assignedTo && assignedTo !== current.assignedTo) {
      historyItems.push({
        timestamp: new Date().toISOString(),
        action: `Assigné à ${assignedTo}`,
        user: 'Administrateur'
      });
    }

    if (actionNote && !status) {
      historyItems.push({
        timestamp: new Date().toISOString(),
        action: 'Note ajoutée',
        user: 'Administrateur',
        note: actionNote
      });
    }

    const updated: Lead = {
      ...current,
      status: status || current.status,
      priority: priority || current.priority,
      assignedTo: assignedTo !== undefined ? assignedTo : current.assignedTo,
      internalNotes: internalNotes !== undefined ? internalNotes : current.internalNotes,
      followUpDate: followUpDate !== undefined ? followUpDate : current.followUpDate,
      history: historyItems
    };

    const saved = await store.saveLead(updated);
    res.json({ success: true, lead: saved });
  }));

  app.delete('/api/leads/:id', wrap(async (req, res) => {
    const ok = await store.deleteLead(req.params.id);
    if (!ok) {
      res.status(404).json({ success: false, error: 'Lead not found' });
      return;
    }
    res.json({ success: true, message: 'Prospect supprimé' });
  }));

  // ---------------------------------------------------------------- Export CSV
  app.get('/api/leads/export-csv', wrap(async (_req, res) => {
    const leads = await store.listLeads();
    const headers = [
      'Référence', 'Date', 'Nom', 'Téléphone', 'WhatsApp', 'Email', 'Ville',
      'Service', 'Source', 'Statut', 'Priorité', 'Responsable', 'Date de relance', 'Description'
    ];

    const escapeCsv = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = leads.map(l => [
      escapeCsv(l.ref),
      escapeCsv(new Date(l.createdAt).toLocaleDateString('fr-FR')),
      escapeCsv(l.name),
      escapeCsv(l.phone),
      escapeCsv(l.whatsapp || ''),
      escapeCsv(l.email || ''),
      escapeCsv(l.city),
      escapeCsv(l.service),
      escapeCsv(l.source),
      escapeCsv(l.status),
      escapeCsv(l.priority),
      escapeCsv(l.assignedTo || 'Non assigné'),
      escapeCsv(l.followUpDate || ''),
      escapeCsv(l.description)
    ].join(';'));

    // BOM UTF-8 pour qu'Excel ouvre les accents proprement.
    const csvContent = '﻿' + [headers.join(';'), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=leads-slt-services-${new Date().toISOString().slice(0, 10)}.csv`);
    res.status(200).send(csvContent);
  }));

  // -------------------------------------------------------- CRM Statistics
  app.get('/api/stats', wrap(async (_req, res) => {
    const leads = await store.listLeads();
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'nouveau').length;
    const won = leads.filter(l => l.status === 'gagne').length;
    const qualified = leads.filter(l => ['qualifie', 'visite_programmee', 'devis_envoye', 'negociation', 'gagne'].includes(l.status)).length;
    const inProgress = leads.filter(l => ['a_contacter', 'contacte', 'qualifie', 'visite_programmee', 'devis_envoye', 'negociation'].includes(l.status)).length;

    const qualificationRate = totalLeads > 0 ? Math.round((qualified / totalLeads) * 100) : 0;
    const conversionRate = totalLeads > 0 ? Math.round((won / totalLeads) * 100) : 0;

    const serviceMap: Record<string, number> = {};
    leads.forEach(l => { serviceMap[l.service] = (serviceMap[l.service] || 0) + 1; });
    const leadsByService = Object.entries(serviceMap).map(([service, count]) => ({ service, count }));

    const cityMap: Record<string, number> = {};
    leads.forEach(l => {
      const cityKey = l.city.split('(')[0].trim();
      cityMap[cityKey] = (cityMap[cityKey] || 0) + 1;
    });
    const leadsByCity = Object.entries(cityMap).map(([city, count]) => ({ city, count }));

    const sourceMap: Record<string, number> = {};
    leads.forEach(l => { sourceMap[l.source] = (sourceMap[l.source] || 0) + 1; });
    const leadsBySource = Object.entries(sourceMap).map(([source, count]) => ({ source, count }));

    res.json({
      success: true,
      stats: {
        totalLeads, newLeads, inProgress, qualified, won,
        qualificationRate, conversionRate,
        leadsByService, leadsByCity, leadsBySource
      }
    });
  }));

  // ---------------------------------------------------------- Admin Auth
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if ((username === 'admin' && password === 'SltMarrakech2026!') || (username === 'admin' && password === 'admin')) {
      const token = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      res.json({
        success: true,
        user: { username: 'admin', role: 'Directeur Général', name: 'Direction SLT SERVICES' },
        token
      });
      return;
    }
    res.status(401).json({ success: false, error: 'Identifiants administrateur incorrects.' });
  });

  // -------------------------------- Vite en dev / statique en prod
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server ready on port ${PORT} — stockage: ${store.backend}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
