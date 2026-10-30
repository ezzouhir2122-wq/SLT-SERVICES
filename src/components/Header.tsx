import React, { useState } from 'react';
import { ArrowRight, Menu, X, PhoneCall, Shield, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { currentPath, navigate, settings, adminToken } = useApp();
  const [open, setOpen] = useState(false);
  const links = [{ label: 'Accueil', path: '/' }, { label: 'Services', path: '/services' }, { label: 'Équipements', path: '/equipements' }, { label: 'Réalisations', path: '/realisations' }, { label: 'Blog', path: '/blog' }, { label: 'À propos', path: '/a-propos' }, { label: 'Contact', path: '/contact' }];
  const go = (path: string) => { navigate(path); setOpen(false); };
  return <header className="slt-header">
    <div className="slt-header-inner">
      <button className="slt-brand" onClick={() => go('/')} aria-label={`${settings.companyName || 'SLT SERVICES'} — Accueil`}><img className="slt-brand-logo" src="/assets/logo-slt.png" alt="" /></button>
      <nav className="slt-desktop-nav" aria-label="Navigation principale">{links.map(link => <button key={link.path} aria-current={currentPath === link.path ? 'page' : undefined} className={currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path)) ? 'is-active' : ''} onClick={() => go(link.path)}>{link.label}{['/services', '/equipements'].includes(link.path) && <ChevronDown size={11} />}</button>)}</nav>
      <div className="slt-header-actions"><a className="slt-phone" href={`tel:${settings.phone.replace(/\s/g, '')}`}><PhoneCall size={15} /><span>{settings.phone}</span></a><button className="slt-btn slt-header-quote" onClick={() => go('/devis')}>Demander un devis <ArrowRight size={16} /></button>{adminToken && <button aria-label="Administration" onClick={() => go('/admin')}><Shield size={18} /></button>}<button className="slt-menu-toggle" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
    </div>
    {open && <nav id="mobile-navigation" className="slt-mobile-nav" aria-label="Navigation mobile">{[...links, { label: 'Dépannage', path: '/depannage' }, { label: 'Maintenance', path: '/maintenance' }].map(link => <button key={link.path} onClick={() => go(link.path)} aria-current={currentPath === link.path ? 'page' : undefined}>{link.label}<ArrowRight size={16} /></button>)}<button className="slt-btn" onClick={() => go('/devis')}>Demander un devis gratuit <ArrowRight size={16} /></button></nav>}
  </header>;
};
