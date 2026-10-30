// server.ts
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// src/data/initialData.ts
var photo = (id, w = 1e3) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
var poolPhotos = {
  hero: "/assets/pool-hero.png",
  pool: photo("photo-1576013551627-0cc20b96c2a7"),
  terrace: photo("photo-1600596542815-ffad4c1539a9"),
  villa: "/assets/pool-hero.png",
  evening: photo("photo-1564013799919-ab600027ffc6"),
  before: photo("photo-1504307651254-35680f356dfd")
};
var initialCompanySettings = {
  companyName: "SLT SERVICES",
  slogan: "Votre piscine, notre expertise. Construction, am\xE9nagement, entretien et \xE9quipements de piscines au Maroc.",
  phone: "+212 661 586 841",
  phoneSecondary: "+212 663 116 200",
  whatsapp: "+212 661 586 841",
  email: "contact@slt-services.ma",
  address: "Bureau N\xB026, N\xB0484, Quartier Industriel Sidi Ghanem, Marrakech",
  primaryCity: "Marrakech",
  citiesCovered: ["Marrakech", "Gu\xE9liz & Hivernage", "Palmeraie & Environs", "Targa", "Route de l\u2019Ourika", "Route de F\xE8s", "Tamansourt", "Autre ville au Maroc"],
  openingHours: "Lundi au samedi : 08h30 \u2013 18h30",
  heroImage: poolPhotos.hero,
  allowEmergencyCalls: true,
  gaMeasurementId: ""
};
var service = (id, slug, title, description, iconName, image, prestations) => ({
  id,
  slug,
  title,
  kicker: "Piscines r\xE9sidentielles & professionnelles",
  shortDescription: description,
  fullDescription: `${description} Nous \xE9tudions votre bassin, vos usages et les contraintes du site pour vous proposer une solution adapt\xE9e, avec un devis d\xE9taill\xE9 avant intervention.`,
  iconName,
  image,
  prestations,
  clientProblems: ["Un projet \xE0 dimensionner selon vos besoins", "Des \xE9quipements \xE0 choisir ou \xE0 remplacer", "Un besoin de suivi technique et de conseil"],
  solutions: ["Visite et diagnostic de votre installation", "Proposition technique adapt\xE9e \xE0 votre piscine", "Installation et accompagnement \xE0 la prise en main"],
  advantages: ["Solutions sur mesure", "Accompagnement professionnel", "\xC9quipements adapt\xE9s \xE0 vos besoins"],
  faq: [{ question: "Comment obtenir un devis ?", answer: "D\xE9crivez votre projet et indiquez votre ville. Notre \xE9quipe vous contacte pour pr\xE9ciser vos besoins et organiser une visite si n\xE9cessaire." }]
});
var initialServices = [
  service("serv_1", "construction-piscines", "Construction de piscines", "Piscines sur mesure, b\xE9ton, skimmers, d\xE9bordement.", "BrickWall", poolPhotos.pool, ["\xC9tude et conception du bassin", "Terrassement et structure en b\xE9ton", "\xC9tanch\xE9it\xE9 et rev\xEAtement", "Piscines \xE0 skimmers ou \xE0 d\xE9bordement"]),
  service("serv_2", "amenagement-exterieur", "Am\xE9nagement ext\xE9rieur", "Terrasses, margelles, \xE9clairage, espaces verts.", "Leaf", poolPhotos.terrace, ["Plages et terrasses de piscine", "Pose de margelles", "\xC9clairage ext\xE9rieur", "Int\xE9gration paysag\xE8re"]),
  service("serv_3", "renovation-reparation", "R\xE9novation et r\xE9paration", "R\xE9habilitation, \xE9tanch\xE9it\xE9, modernisation.", "Wrench", poolPhotos.villa, ["Diagnostic du bassin", "Reprise de l\u2019\xE9tanch\xE9it\xE9", "R\xE9fection des rev\xEAtements", "Modernisation des \xE9quipements"]),
  service("serv_4", "installation-pompes", "Installation de pompes", "Pompes, surpresseurs, remplacement.", "Settings", "/assets/pool-equipment.png#pump", ["Choix et dimensionnement de la pompe", "Pose et raccordement hydraulique", "Remplacement de pompes", "R\xE9glage et mise en service"]),
  service("serv_5", "filtration-equipements", "Filtration et \xE9quipements", "Filtres, vannes, coffrets, traitement de l\u2019eau.", "Filter", "/assets/pool-equipment.png#filter", ["Installation de filtres", "Vannes et coffrets de commande", "\xC9quipements de traitement de l\u2019eau", "Optimisation du local technique"]),
  service("serv_6", "entretien-maintenance", "Entretien et maintenance", "Nettoyage, suivi, contrats d\u2019entretien.", "Sparkles", "/assets/pool-equipment.png#robot", ["Nettoyage du bassin", "Contr\xF4le de la filtration", "Suivi de la qualit\xE9 de l\u2019eau", "Contrats d\u2019entretien adapt\xE9s"])
];
var product = (id, slug, name, category, tile, description) => ({
  id,
  slug,
  name,
  reference: `PISC-${id}`,
  brand: "S\xE9lection SLT SERVICES",
  category,
  isPriceOnDemand: true,
  shortDescription: description,
  image: `/assets/pool-equipment.png#${tile}`,
  specs: [{ label: "S\xE9lection", value: "Selon le volume et la configuration du bassin" }, { label: "Installation", value: "Sur devis apr\xE8s \xE9tude" }],
  inStock: false,
  featured: true
});
var initialProducts = [
  product("1", "pompes-piscine", "Pompes de piscine", "Pompes", "pump", "Pompes de circulation et surpresseurs, s\xE9lectionn\xE9s selon votre bassin et votre r\xE9seau hydraulique."),
  product("2", "filtres-sable", "Filtres \xE0 sable", "Filtration", "filter", "Filtres \xE0 sable et vannes multivoies pour une filtration adapt\xE9e au volume de votre piscine."),
  product("3", "robots-nettoyeurs", "Robots nettoyeurs", "Nettoyage", "robot", "Robots pour le nettoyage du fond et, selon le mod\xE8le, des parois du bassin."),
  product("4", "eclairage-led", "\xC9clairage LED", "\xC9clairage", "light", "Projecteurs immerg\xE9s pour mettre en lumi\xE8re votre piscine et cr\xE9er une ambiance nocturne."),
  product("5", "skimmers-accessoires", "Skimmers et accessoires", "Accessoires", "skimmer", "Skimmers, paniers et accessoires pour l\u2019aspiration de surface et l\u2019entretien du bassin."),
  product("6", "pieces-detachees", "Pi\xE8ces d\xE9tach\xE9es", "Pi\xE8ces d\xE9tach\xE9es", "fittings", "Raccords, unions et pi\xE8ces de remplacement \xE0 v\xE9rifier selon votre installation.")
];
var initialProjects = [
  { id: "proj_1", slug: "piscine-villa-contemporaine", title: "Piscine de villa contemporaine", category: "construction", categoryLabel: "Construction de piscine", location: "Marrakech", description: "Inspiration pour un bassin r\xE9sidentiel int\xE9gr\xE9 \xE0 une villa et \xE0 ses espaces de d\xE9tente.", keyPoints: ["Bassin sur mesure", "Int\xE9gration \xE0 la terrasse", "Filtration adapt\xE9e"], image: poolPhotos.villa, isDemonstration: true },
  { id: "proj_2", slug: "renovation-bassin", title: "Une piscine remise en valeur", category: "renovation", categoryLabel: "R\xE9novation", location: "Marrakech", description: "Exemple illustratif de modernisation d\u2019un bassin et de ses abords.", keyPoints: ["\xC9tanch\xE9it\xE9", "Rev\xEAtement", "Modernisation"], image: poolPhotos.pool, beforeImage: poolPhotos.before, afterImage: poolPhotos.pool, hasBeforeAfter: true, isDemonstration: true },
  { id: "proj_3", slug: "piscine-eclairage", title: "Ambiance autour du bassin", category: "amenagement", categoryLabel: "Am\xE9nagement ext\xE9rieur", location: "Marrakech", description: "Inspiration pour une piscine et des espaces de vie ext\xE9rieurs harmonieux.", keyPoints: ["Terrasses", "Margelles", "\xC9clairage"], image: poolPhotos.evening, isDemonstration: true },
  { id: "proj_4", slug: "piscine-jardin", title: "Un espace de d\xE9tente au jardin", category: "amenagement", categoryLabel: "Piscine & jardin", location: "Marrakech", description: "Exemple d\u2019int\xE9gration paysag\xE8re d\u2019un bassin dans un jardin r\xE9sidentiel.", keyPoints: ["Espaces verts", "Plages de piscine", "Confort d\u2019utilisation"], image: poolPhotos.pool, isDemonstration: true }
];
var initialMaintenancePlans = [
  { id: "maint_1", name: "Essentiel", targetAudience: "Piscines priv\xE9es", idealFor: "Un contr\xF4le r\xE9gulier de votre piscine", visitsPerMonth: "Fr\xE9quence \xE0 d\xE9finir", features: ["Nettoyage du bassin", "Contr\xF4le visuel des \xE9quipements", "Conseils d\u2019entretien"] },
  { id: "maint_2", name: "S\xE9r\xE9nit\xE9", targetAudience: "R\xE9sidences et villas", idealFor: "Un accompagnement pendant la saison", visitsPerMonth: "Selon les usages du bassin", features: ["Nettoyage et contr\xF4le de la filtration", "Suivi de la qualit\xE9 de l\u2019eau", "R\xE9glage des \xE9quipements", "Compte rendu des interventions"], isPopular: true },
  { id: "maint_3", name: "Professionnel", targetAudience: "H\xF4tels, riads et r\xE9sidences", idealFor: "Un suivi adapt\xE9 aux piscines professionnelles", visitsPerMonth: "Planning personnalis\xE9", features: ["Programme d\u2019entretien sur mesure", "Suivi du local technique", "Maintenance pr\xE9ventive", "Interlocuteur d\xE9di\xE9"] }
];
var initialBlogPosts = [
  { id: "blog_1", slug: "concevoir-piscine", title: "Bien pr\xE9parer son projet de piscine", category: "Construction", readTime: "4 min", publishedAt: "2026-10-29", excerpt: "Les questions \xE0 se poser avant de concevoir votre bassin.", content: ["La conception commence par vos usages : d\xE9tente, nage ou accueil de visiteurs. Le terrain et les acc\xE8s guident ensuite l\u2019implantation.", "D\xE9finissez la forme, le rev\xEAtement et les abords avec votre professionnel. Demandez un devis d\xE9taill\xE9 qui inclut le bassin, la filtration et la mise en service."], isDraft: false },
  { id: "blog_2", slug: "entretenir-piscine", title: "Les bons r\xE9flexes pour entretenir votre piscine", category: "Entretien", readTime: "3 min", publishedAt: "2026-10-29", excerpt: "Nettoyage, filtration et suivi de l\u2019eau : les bases d\u2019un entretien r\xE9gulier.", content: ["Retirez les d\xE9bris et nettoyez r\xE9guli\xE8rement les paniers et le bassin. Adaptez la filtration \xE0 l\u2019utilisation de votre piscine et aux recommandations du fabricant.", "Contr\xF4lez l\u2019eau avec un dispositif adapt\xE9. Pour tout produit de traitement, suivez la notice et les conseils de votre professionnel."], isDraft: false },
  { id: "blog_3", slug: "choisir-equipements", title: "Quels \xE9quipements pour votre piscine ?", category: "\xC9quipements", readTime: "4 min", publishedAt: "2026-10-29", excerpt: "Pompe, filtre, robot et \xE9clairage : une s\xE9lection adapt\xE9e au bassin.", content: ["Le choix de la pompe et du filtre d\xE9pend du volume du bassin, du r\xE9seau hydraulique et des usages.", "Un robot compatible avec le rev\xEAtement facilite le nettoyage. L\u2019\xE9clairage et les accessoires se s\xE9lectionnent en tenant compte de l\u2019installation existante."], isDraft: false }
];
var initialFAQ = [
  { id: "faq_1", category: "devis", question: "Comment obtenir un devis pour ma piscine ?", answer: "Indiquez votre type de projet, vos coordonn\xE9es et votre ville. Nous vous contactons pour pr\xE9ciser vos besoins et organiser une \xE9tude du site si n\xE9cessaire." },
  { id: "faq_2", category: "construction", question: "R\xE9alisez-vous des piscines sur mesure ?", answer: "Oui, la forme, les dimensions, le rev\xEAtement et les \xE9quipements sont \xE9tudi\xE9s selon votre terrain et vos attentes." },
  { id: "faq_3", category: "entretien", question: "Proposez-vous des contrats d\u2019entretien ?", answer: "Nous proposons un suivi du nettoyage, de la filtration et des \xE9quipements. La fr\xE9quence des visites est d\xE9finie selon votre bassin et son utilisation." },
  { id: "faq_4", category: "equipements", question: "Pouvez-vous remplacer ma pompe ou mon filtre ?", answer: "Nous examinons votre installation afin de s\xE9lectionner un \xE9quipement compatible et adapt\xE9, puis \xE9tablissons un devis de fourniture et d\u2019installation." }
];
var initialTestimonials = [];
var initialLeads = [];

// server.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var DATA_DIR = path.join(__dirname, "data");
var DB_FILE = path.join(DATA_DIR, "db.json");
function initDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, "utf-8");
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
      console.error("Error reading db.json, reinitializing default data:", e);
    }
  }
  const defaultDb = {
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
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write initial db.json:", err);
  }
  return defaultDb;
}
var db = initDatabase();
function saveDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist database:", err);
  }
}
async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3e3;
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.get("/api/settings", (_req, res) => {
    res.json({ success: true, settings: db.settings });
  });
  app.put("/api/settings", (req, res) => {
    const updated = req.body;
    db.settings = { ...db.settings, ...updated };
    saveDatabase();
    res.json({ success: true, settings: db.settings });
  });
  app.get("/api/services", (_req, res) => {
    res.json({ success: true, services: db.services });
  });
  app.put("/api/services/:id", (req, res) => {
    const { id } = req.params;
    const index = db.services.findIndex((s) => s.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, error: "Service not found" });
      return;
    }
    db.services[index] = { ...db.services[index], ...req.body };
    saveDatabase();
    res.json({ success: true, service: db.services[index] });
  });
  app.post("/api/services", (req, res) => {
    const newService = {
      id: `serv_${Date.now()}`,
      slug: req.body.slug || `service-${Date.now()}`,
      title: req.body.title || "Nouveau service",
      kicker: req.body.kicker || "Expertise b\xE2timent",
      shortDescription: req.body.shortDescription || "",
      fullDescription: req.body.fullDescription || "",
      iconName: req.body.iconName || "Waves",
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
  app.get("/api/products", (req, res) => {
    const { category, search } = req.query;
    let items = [...db.products];
    if (category && typeof category === "string" && category !== "all") {
      items = items.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      items = items.filter(
        (p) => p.name.toLowerCase().includes(q) || p.reference.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, products: items });
  });
  app.post("/api/products", (req, res) => {
    const newProduct = {
      id: `prod_${Date.now()}`,
      slug: req.body.slug || `produit-${Date.now()}`,
      name: req.body.name || "Nouvel \xE9quipement",
      reference: req.body.reference || `REF-${Math.floor(1e3 + Math.random() * 9e3)}`,
      brand: req.body.brand || "SLT SERVICES",
      category: req.body.category || "Autres \xE9quipements",
      price: req.body.price ? Number(req.body.price) : void 0,
      isPriceOnDemand: req.body.isPriceOnDemand ?? true,
      shortDescription: req.body.shortDescription || "",
      specs: req.body.specs || [],
      inStock: req.body.inStock ?? true,
      featured: req.body.featured ?? false
    };
    db.products.push(newProduct);
    saveDatabase();
    res.status(201).json({ success: true, product: newProduct });
  });
  app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }
    db.products[index] = { ...db.products[index], ...req.body };
    saveDatabase();
    res.json({ success: true, product: db.products[index] });
  });
  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const initialLen = db.products.length;
    db.products = db.products.filter((p) => p.id !== id);
    if (db.products.length === initialLen) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }
    saveDatabase();
    res.json({ success: true, message: "Product deleted" });
  });
  app.get("/api/projects", (_req, res) => {
    res.json({ success: true, projects: db.projects });
  });
  app.put("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    const index = db.projects.findIndex((p) => p.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, error: "Project not found" });
      return;
    }
    db.projects[index] = { ...db.projects[index], ...req.body };
    saveDatabase();
    res.json({ success: true, project: db.projects[index] });
  });
  app.get("/api/blog", (_req, res) => {
    res.json({ success: true, blogPosts: db.blogPosts });
  });
  app.put("/api/blog/:id", (req, res) => {
    const { id } = req.params;
    const index = db.blogPosts.findIndex((b) => b.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, error: "Post not found" });
      return;
    }
    db.blogPosts[index] = { ...db.blogPosts[index], ...req.body };
    saveDatabase();
    res.json({ success: true, post: db.blogPosts[index] });
  });
  app.get("/api/faq", (_req, res) => {
    res.json({ success: true, faq: db.faq });
  });
  app.get("/api/testimonials", (_req, res) => {
    res.json({ success: true, testimonials: db.testimonials.filter((t) => t.verified) });
  });
  app.get("/api/maintenance-plans", (_req, res) => {
    res.json({ success: true, plans: db.maintenancePlans });
  });
  app.get("/api/leads", (req, res) => {
    const { status, search, service: service2, city } = req.query;
    let leads = [...db.leads];
    if (status && typeof status === "string" && status !== "all") {
      leads = leads.filter((l) => l.status === status);
    }
    if (service2 && typeof service2 === "string" && service2 !== "all") {
      leads = leads.filter((l) => l.service.toLowerCase().includes(service2.toLowerCase()));
    }
    if (city && typeof city === "string" && city !== "all") {
      leads = leads.filter((l) => l.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      leads = leads.filter(
        (l) => l.name.toLowerCase().includes(q) || l.phone.toLowerCase().includes(q) || l.email && l.email.toLowerCase().includes(q) || l.ref.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
      );
    }
    leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ success: true, leads });
  });
  app.post("/api/leads", (req, res) => {
    const { name, phone, email, whatsapp, city, service: service2, description, source, originPage, urgency, details } = req.body;
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      res.status(400).json({ success: false, error: "Le nom est requis (minimum 2 caract\xE8res)." });
      return;
    }
    if (!phone || typeof phone !== "string" || phone.trim().length < 8) {
      res.status(400).json({ success: false, error: "Un num\xE9ro de t\xE9l\xE9phone valide est obligatoire." });
      return;
    }
    const twoMinutesAgo = Date.now() - 2 * 60 * 1e3;
    const isDuplicate = db.leads.some(
      (l) => l.phone.replace(/\s+/g, "") === phone.replace(/\s+/g, "") && new Date(l.createdAt).getTime() > twoMinutesAgo
    );
    if (isDuplicate) {
      res.status(429).json({
        success: false,
        error: "Une demande identique a d\xE9j\xE0 \xE9t\xE9 enregistr\xE9e r\xE9cemment. Notre \xE9quipe vous contactera sous peu."
      });
      return;
    }
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const sequence = 1e3 + db.leads.length + 1;
    const ref = `SLT-${currentYear}-${sequence}`;
    const newLead = {
      id: `lead_${Date.now()}`,
      ref,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      name: name.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp?.trim() || phone.trim(),
      email: email?.trim() || void 0,
      city: city?.trim() || "Marrakech",
      source: source || "formulaire_devis",
      originPage: originPage || "/",
      service: service2 || "Demande g\xE9n\xE9rale",
      description: description?.trim() || "Demande de renseignements / devis",
      urgency: urgency || "cette_semaine",
      details: details || {},
      status: "nouveau",
      priority: urgency === "immediate" ? "urgent" : "normal",
      assignedTo: void 0,
      internalNotes: "",
      history: [
        {
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          action: `Prospect cr\xE9\xE9 via ${source || "site web"} (R\xE9f: ${ref})`,
          user: "Syst\xE8me"
        }
      ]
    };
    db.leads.unshift(newLead);
    saveDatabase();
    res.status(201).json({
      success: true,
      lead: newLead,
      reference: newLead.ref,
      message: "Demande enregistr\xE9e avec succ\xE8s. Notre \xE9quipe vous recontactera rapidement."
    });
  });
  app.put("/api/leads/:id", (req, res) => {
    const { id } = req.params;
    const index = db.leads.findIndex((l) => l.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, error: "Lead not found" });
      return;
    }
    const current = db.leads[index];
    const { status, priority, assignedTo, internalNotes, followUpDate, actionNote } = req.body;
    const historyItems = [...current.history];
    if (status && status !== current.status) {
      historyItems.push({
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        action: `Statut chang\xE9 de "${current.status}" \xE0 "${status}"`,
        user: "Administrateur",
        note: actionNote
      });
    }
    if (assignedTo && assignedTo !== current.assignedTo) {
      historyItems.push({
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        action: `Assign\xE9 \xE0 ${assignedTo}`,
        user: "Administrateur"
      });
    }
    if (actionNote && !status) {
      historyItems.push({
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        action: "Note ajout\xE9e",
        user: "Administrateur",
        note: actionNote
      });
    }
    db.leads[index] = {
      ...current,
      status: status || current.status,
      priority: priority || current.priority,
      assignedTo: assignedTo !== void 0 ? assignedTo : current.assignedTo,
      internalNotes: internalNotes !== void 0 ? internalNotes : current.internalNotes,
      followUpDate: followUpDate !== void 0 ? followUpDate : current.followUpDate,
      history: historyItems
    };
    saveDatabase();
    res.json({ success: true, lead: db.leads[index] });
  });
  app.delete("/api/leads/:id", (req, res) => {
    const { id } = req.params;
    const initialLen = db.leads.length;
    db.leads = db.leads.filter((l) => l.id !== id);
    if (db.leads.length === initialLen) {
      res.status(404).json({ success: false, error: "Lead not found" });
      return;
    }
    saveDatabase();
    res.json({ success: true, message: "Prospect supprim\xE9" });
  });
  app.get("/api/leads/export-csv", (_req, res) => {
    const headers = [
      "R\xE9f\xE9rence",
      "Date",
      "Nom",
      "T\xE9l\xE9phone",
      "WhatsApp",
      "Email",
      "Ville",
      "Service",
      "Source",
      "Statut",
      "Priorit\xE9",
      "Responsable",
      "Date de relance",
      "Description"
    ];
    const escapeCsv = (val) => {
      if (val === void 0 || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };
    const rows = db.leads.map((l) => [
      escapeCsv(l.ref),
      escapeCsv(new Date(l.createdAt).toLocaleDateString("fr-FR")),
      escapeCsv(l.name),
      escapeCsv(l.phone),
      escapeCsv(l.whatsapp || ""),
      escapeCsv(l.email || ""),
      escapeCsv(l.city),
      escapeCsv(l.service),
      escapeCsv(l.source),
      escapeCsv(l.status),
      escapeCsv(l.priority),
      escapeCsv(l.assignedTo || "Non assign\xE9"),
      escapeCsv(l.followUpDate || ""),
      escapeCsv(l.description)
    ].join(";"));
    const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\r\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=leads-slt-services-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
    res.status(200).send(csvContent);
  });
  app.get("/api/stats", (_req, res) => {
    const totalLeads = db.leads.length;
    const newLeads = db.leads.filter((l) => l.status === "nouveau").length;
    const won = db.leads.filter((l) => l.status === "gagne").length;
    const qualified = db.leads.filter((l) => ["qualifie", "visite_programmee", "devis_envoye", "negociation", "gagne"].includes(l.status)).length;
    const inProgress = db.leads.filter((l) => ["a_contacter", "contacte", "qualifie", "visite_programmee", "devis_envoye", "negociation"].includes(l.status)).length;
    const qualificationRate = totalLeads > 0 ? Math.round(qualified / totalLeads * 100) : 0;
    const conversionRate = totalLeads > 0 ? Math.round(won / totalLeads * 100) : 0;
    const serviceMap = {};
    db.leads.forEach((l) => {
      serviceMap[l.service] = (serviceMap[l.service] || 0) + 1;
    });
    const leadsByService = Object.entries(serviceMap).map(([service2, count]) => ({ service: service2, count }));
    const cityMap = {};
    db.leads.forEach((l) => {
      const cityKey = l.city.split("(")[0].trim();
      cityMap[cityKey] = (cityMap[cityKey] || 0) + 1;
    });
    const leadsByCity = Object.entries(cityMap).map(([city, count]) => ({ city, count }));
    const sourceMap = {};
    db.leads.forEach((l) => {
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
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "SltMarrakech2026!" || username === "admin" && password === "admin") {
      const token = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      res.json({
        success: true,
        user: { username: "admin", role: "Directeur G\xE9n\xE9ral", name: "Direction SLT SERVICES" },
        token
      });
      return;
    }
    res.status(401).json({ success: false, error: "Identifiants administrateur incorrects." });
  });
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== "true",
        watch: process.env.DISABLE_HMR === "true" ? null : {}
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "../dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, () => {
    console.log(`Server ready on port ${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
