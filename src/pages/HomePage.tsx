import React, { useState } from 'react';
import { ArrowRight, BrickWall, Leaf, Wrench, Settings, Filter, Sparkles, ShieldCheck, UsersRound, Droplets, Play, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { initialServices, initialProjects, initialProducts, initialFAQ, poolPhotos } from '../data/initialData';
import { InteractiveBeforeAfter } from '../components/InteractiveBeforeAfter';
import { QuickQuoteMiniForm } from '../components/QuickQuoteMiniForm';
import { PoolImage } from '../components/PoolImage';

const serviceIcons = { BrickWall, Leaf, Wrench, Settings, Filter, Sparkles };

export const HomePage: React.FC = () => {
  const { navigate, settings } = useApp();
  const [faq, setFaq] = useState<string | null>(null);
  const hero = settings.heroImage && !settings.heroImage.includes('photo-1503387762') && !settings.heroImage.includes('photo-1600585154340') ? settings.heroImage : poolPhotos.hero;

  return <div className="slt-home pool-home">
    <section className="slt-hero" aria-labelledby="hero-title">
      <img className="slt-hero-photo" src={hero} alt="Piscine turquoise devant une villa contemporaine" fetchPriority="high" />
      <div className="slt-hero-shade" />
      <div className="slt-container slt-hero-content">
        <span className="slt-eyebrow">PISCINES RÉSIDENTIELLES & PROFESSIONNELLES</span>
        <h1 id="hero-title">Votre piscine,<br />notre <span>expertise.</span></h1>
        <p>Construction, aménagement, rénovation, entretien<br className="pool-desktop-break" /> et équipements de piscines au Maroc.<br />De la conception à la maintenance, nous donnons vie<br className="pool-desktop-break" /> à vos projets aquatiques.</p>
        <div className="slt-hero-actions">
          <button className="slt-btn" onClick={() => navigate('/devis')}>Obtenir un devis gratuit <ArrowRight size={18} /></button>
          <button className="slt-btn slt-btn-outline" onClick={() => navigate('/realisations')}><Play size={14} fill="currentColor" /> Découvrir nos réalisations</button>
        </div>
        <div className="slt-hero-promises">
          <div><span><Droplets /></span><p>Solutions<br /><strong>sur mesure</strong></p></div>
          <div><span><UsersRound /></span><p>Accompagnement<br /><strong>professionnel</strong></p></div>
          <div><span><ShieldCheck /></span><p>Équipements<br /><strong>adaptés à vos besoins</strong></p></div>
        </div>
      </div>
      <img className="slt-hero-mockup" src="/assets/mockup-site.png" alt="Aperçu du site SLT SERVICES sur smartphone" loading="lazy" />
    </section>

    <div className="slt-container slt-main-grid">
      <div className="slt-main-content">
        <section className="slt-section" aria-labelledby="services-title">
          <div className="slt-section-head"><div><span className="slt-eyebrow">NOS SERVICES</span><h2 id="services-title">Des solutions complètes pour votre piscine</h2></div><button className="slt-text-link" onClick={() => navigate('/services')}>Voir tous les services <ArrowRight size={16} /></button></div>
          <div className="slt-service-grid">{initialServices.map(service => {
            const Icon = serviceIcons[service.iconName as keyof typeof serviceIcons] || Droplets;
            return <button className="slt-service-card" key={service.id} onClick={() => navigate(`/services/${service.slug}`)}><div className="slt-service-image"><PoolImage src={service.image} alt={service.title} loading="lazy" /></div><span className="slt-service-icon"><Icon size={21} /></span><div className="slt-service-copy"><h3>{service.title}</h3><p>{service.shortDescription}</p><span className="slt-card-arrow"><ArrowRight size={16} /></span></div></button>;
          })}</div>
        </section>

        <section className="slt-section pool-projects" aria-labelledby="projects-title">
          <div className="slt-before-after"><InteractiveBeforeAfter title="" subtitle="" beforeImage={poolPhotos.before} afterImage={poolPhotos.pool} beforeLabel="Avant" afterLabel="Après" /><span className="slt-image-caption">Illustration de transformation · Visuels d’inspiration</span></div>
          <div className="pool-projects-content"><div className="slt-section-head"><div><span className="slt-eyebrow">NOS RÉALISATIONS</span><h2 id="projects-title">Des projets qui font la différence</h2></div><button className="slt-text-link" onClick={() => navigate('/realisations')}>Voir toutes nos réalisations <ArrowRight size={16} /></button></div><div className="slt-project-grid">{initialProjects.map(project => <button className="slt-project-card" key={project.id} onClick={() => navigate(`/realisations/${project.slug}`)} aria-label={project.title}><img src={project.image} alt={project.title} loading="lazy" /><span className="pool-project-caption">{project.categoryLabel}</span></button>)}</div><span className="slt-image-caption">Exemples de projets et inspirations piscine</span></div>
        </section>

        <section className="slt-section" aria-labelledby="equipment-title"><div className="slt-section-head"><div><span className="slt-eyebrow">NOS ÉQUIPEMENTS</span><h2 id="equipment-title">Des équipements fiables et performants</h2></div><button className="slt-text-link" onClick={() => navigate('/equipements')}>Voir tous les équipements <ArrowRight size={16} /></button></div><div className="slt-product-grid">{initialProducts.map(product => <button className="slt-product-card" key={product.id} onClick={() => navigate(`/equipements/${product.slug}`)}><PoolImage src={product.image} alt={product.name} loading="lazy" /><span>{product.name}<ArrowRight size={16} /></span></button>)}</div></section>
      </div>
      <aside className="slt-sidebar" aria-label="Demander un devis piscine"><div className="slt-quote-panel"><QuickQuoteMiniForm /></div><div className="slt-sidebar-note"><Droplets size={28} /><h3>Votre projet, sur mesure.</h3><p>Un nouveau bassin, une rénovation ou un équipement à remplacer ? Parlons de votre piscine.</p><button className="slt-text-link" onClick={() => navigate('/contact')}>Contacter notre équipe <ArrowRight size={16} /></button></div></aside>
    </div>
    <section className="slt-container slt-faq"><div><span className="slt-eyebrow">À VOS CÔTÉS</span><h2>De votre première idée<br />au plaisir de la baignade.</h2><p>Un accompagnement pour concevoir, équiper et entretenir votre piscine à Marrakech et au Maroc.</p><button className="slt-btn" onClick={() => navigate('/devis')}>Parlons de votre piscine <ArrowRight size={18} /></button></div><div>{initialFAQ.map(item => <div className="slt-faq-item" key={item.id}><button aria-expanded={faq === item.id} aria-controls={`answer-${item.id}`} onClick={() => setFaq(faq === item.id ? null : item.id)}>{item.question}<ChevronDown size={18} className={faq === item.id ? 'is-open' : ''} /></button>{faq === item.id && <p id={`answer-${item.id}`}>{item.answer}</p>}</div>)}</div></section>
  </div>;
};
