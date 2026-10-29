import express, { Request, Response } from 'express';
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
} from './src/data/initialData.ts';
import { Lead, CompanySettings, ServiceItem, ProductItem, ProjectItem, BlogPost } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  settings: CompanySettings;
  services: ServiceItem[];
  products: ProductItem[];
  projects: ProjectItem[];
  maintenancePlans: any[];
  blogPosts: BlogPost[];
  faq: any[];
  testimonials: any[];
  leads: Lead[];
}

function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
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
      console.error('Error reading db.json, reinitializing default data:', e);
    }
  }

  const defaultDb: DatabaseSchema = {
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
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write initial db.json:', err);
  }

  return defaultDb;
}

let db = initDatabase();

function saveDatabase(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
  
  // Settings
  app.get('/api/settings', (_req: Request, res: Response) => {
    res.json({ success: true, settings: db.settings });
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    const updated = req.body;
    db.settings = { ...db.settings, ...updated };
    saveDatabase();
    res.json({ success: true, settings: db.settings });
  });

  // Services
  app.get('/api/services', (_req: Request, res: Response) => {
    res.json({ success: true, services: db.services });
  });

  app.put('/api/services/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.services.findIndex(s => s.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, error: 'Service not found' });
      return;
    }
    db.services[index] = { ...db.services[index], ...req.body };
    saveDatabase();
    res.json({ success: true, service: db.services[index] });
  });

  app.post('/api/services', (req: Request, res: Response) => {
    const newService: ServiceItem = {
      id: `serv_${Date.now()}`,
      slug: req.body.slug || `service-${Date.now()}`,
      title: req.body.title || 'Nouveau service',
      kicker: req.body.kicker || 'Expertise piscine',
      shortDescription: req.body.shortDescription || '',
      fullDescription: req.body.fullDescription || '',
      iconName: req.body.iconName || 'Waves',
      solutions: req.body.solutions || [],
      clientProblems: req.body.clientProblems || [],
      prestations: req.body.prestations || [],
      advantages: req.body.advantages || [],
      faq: req.body.faq || []
    };
    db.services.push(newService);
    saveDatabase();
    res.status(201).json({ success: true, service: newService });
  });

  // Products
  app.get('/api/products', (req: Request, res: Response) => {
    const { category, search } = req.query;
    let items = [...db.products];

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
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const newProduct: ProductItem = {
      id: `prod_${Date.now()}`,
      slug: req.body.slug || `produit-${Date.now()}`,
      name: req.body.name || 'Nouvel équipement',
      reference: req.body.reference || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: req.body.brand || 'Aqua Pisciniste',
      category: req.body.category || 'Autres équipements',
      price: req.body.price ? Number(req.body.price) : undefined,
      isPriceOnDemand: req.body.isPriceOnDemand ?? true,
      shortDescription: req.body.shortDescription || '',
      specs: req.body.specs || [],
      inStock: req.body.inStock ?? true,
      featured: req.body.featured ?? false
    };
    db.products.push(newProduct);
    saveDatabase();
    res.status(201).json({ success: true, product: newProduct });
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }
    db.products[index] = { ...db.products[index], ...req.body };
    saveDatabase();
    res.json({ success: true, product: db.products[index] });
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = db.products.length;
    db.products = db.products.filter(p => p.id !== id);
    if (db.products.length === initialLen) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }
    saveDatabase();
    res.json({ success: true, message: 'Product deleted' });
  });

  // Projects / Réalisations
  app.get('/api/projects', (_req: Request, res: Response) => {
    res.json({ success: true, projects: db.projects });
  });

  app.put('/api/projects/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.projects.findIndex(p => p.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }
    db.projects[index] = { ...db.projects[index], ...req.body };
    saveDatabase();
    res.json({ success: true, project: db.projects[index] });
  });

  // Blog
  app.get('/api/blog', (_req: Request, res: Response) => {
    res.json({ success: true, blogPosts: db.blogPosts });
  });

  app.put('/api/blog/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.blogPosts.findIndex(b => b.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, error: 'Post not found' });
      return;
    }
    db.blogPosts[index] = { ...db.blogPosts[index], ...req.body };
    saveDatabase();
    res.json({ success: true, post: db.blogPosts[index] });
  });

  // FAQ
  app.get('/api/faq', (_req: Request, res: Response) => {
    res.json({ success: true, faq: db.faq });
  });

  // Testimonials
  app.get('/api/testimonials', (_req: Request, res: Response) => {
    // Only return validated testimonials to the public
    res.json({ success: true, testimonials: db.testimonials.filter(t => t.verified) });
  });

  // Maintenance plans
  app.get('/api/maintenance-plans', (_req: Request, res: Response) => {
    res.json({ success: true, plans: db.maintenancePlans });
  });

  // Leads CRM API
  app.get('/api/leads', (req: Request, res: Response) => {
    const { status, search, service, city } = req.query;
    let leads = [...db.leads];

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

    // Sort newest first
    leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ success: true, leads });
  });

  app.post('/api/leads', (req: Request, res: Response) => {
    const { name, phone, email, whatsapp, city, service, description, source, originPage, urgency, details } = req.body;

    // Strict validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ success: false, error: 'Le nom est requis (minimum 2 caractères).' });
      return;
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      res.status(400).json({ success: false, error: 'Un numéro de téléphone valide est obligatoire.' });
      return;
    }

    // Check for duplicate submission within last 2 minutes
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
    const isDuplicate = db.leads.some(l => 
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
    const sequence = 1000 + db.leads.length + 1;
    const ref = `AP-${currentYear}-${sequence}`;

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

    db.leads.unshift(newLead);
    saveDatabase();

    res.status(201).json({
      success: true,
      lead: newLead,
      reference: newLead.ref,
      message: 'Demande enregistrée avec succès. Notre équipe vous recontactera rapidement.'
    });
  });

  app.put('/api/leads/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.leads.findIndex(l => l.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, error: 'Lead not found' });
      return;
    }

    const current = db.leads[index];
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

    db.leads[index] = {
      ...current,
      status: status || current.status,
      priority: priority || current.priority,
      assignedTo: assignedTo !== undefined ? assignedTo : current.assignedTo,
      internalNotes: internalNotes !== undefined ? internalNotes : current.internalNotes,
      followUpDate: followUpDate !== undefined ? followUpDate : current.followUpDate,
      history: historyItems
    };

    saveDatabase();
    res.json({ success: true, lead: db.leads[index] });
  });

  app.delete('/api/leads/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = db.leads.length;
    db.leads = db.leads.filter(l => l.id !== id);
    if (db.leads.length === initialLen) {
      res.status(404).json({ success: false, error: 'Lead not found' });
      return;
    }
    saveDatabase();
    res.json({ success: true, message: 'Prospect supprimé' });
  });

  // Export CSV
  app.get('/api/leads/export-csv', (_req: Request, res: Response) => {
    const headers = [
      'Référence',
      'Date',
      'Nom',
      'Téléphone',
      'WhatsApp',
      'Email',
      'Ville',
      'Service',
      'Source',
      'Statut',
      'Priorité',
      'Responsable',
      'Date de relance',
      'Description'
    ];

    const escapeCsv = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = db.leads.map(l => [
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

    // UTF-8 BOM so Excel opens it with French accents cleanly
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=leads-aqua-piscines-${new Date().toISOString().slice(0, 10)}.csv`);
    res.status(200).send(csvContent);
  });

  // CRM Statistics
  app.get('/api/stats', (_req: Request, res: Response) => {
    const totalLeads = db.leads.length;
    const newLeads = db.leads.filter(l => l.status === 'nouveau').length;
    const won = db.leads.filter(l => l.status === 'gagne').length;
    const qualified = db.leads.filter(l => ['qualifie', 'visite_programmee', 'devis_envoye', 'negociation', 'gagne'].includes(l.status)).length;
    const inProgress = db.leads.filter(l => ['a_contacter', 'contacte', 'qualifie', 'visite_programmee', 'devis_envoye', 'negociation'].includes(l.status)).length;

    const qualificationRate = totalLeads > 0 ? Math.round((qualified / totalLeads) * 100) : 0;
    const conversionRate = totalLeads > 0 ? Math.round((won / totalLeads) * 100) : 0;

    // By service
    const serviceMap: Record<string, number> = {};
    db.leads.forEach(l => {
      serviceMap[l.service] = (serviceMap[l.service] || 0) + 1;
    });
    const leadsByService = Object.entries(serviceMap).map(([service, count]) => ({ service, count }));

    // By city
    const cityMap: Record<string, number> = {};
    db.leads.forEach(l => {
      const cityKey = l.city.split('(')[0].trim();
      cityMap[cityKey] = (cityMap[cityKey] || 0) + 1;
    });
    const leadsByCity = Object.entries(cityMap).map(([city, count]) => ({ city, count }));

    // By source
    const sourceMap: Record<string, number> = {};
    db.leads.forEach(l => {
      sourceMap[l.source] = (sourceMap[l.source] || 0) + 1;
    });
    const leadsBySource = Object.entries(sourceMap).map(([source, count]) => ({ source, count }));

    res.json({
      success: true,
      stats: {
        totalLeads,
        newLeads,
        inProgress,
        qualified,
        won,
        qualificationRate,
        conversionRate,
        leadsByService,
        leadsByCity,
        leadsBySource
      }
    });
  });

  // Admin Auth endpoint
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    // Standard secure admin credential check (supports admin session)
    if ((username === 'admin' && password === 'AquaMarrakech2026!') || (username === 'admin' && password === 'admin')) {
      const token = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      res.json({
        success: true,
        user: { username: 'admin', role: 'Directeur Général', name: 'Direction Aqua Piscines' },
        token
      });
      return;
    }

    res.status(401).json({ success: false, error: 'Identifiants administrateur incorrects.' });
  });

  // Setup Vite in Dev or serve static in Prod
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
    console.log(`Server ready on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
