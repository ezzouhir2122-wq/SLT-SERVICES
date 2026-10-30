import React from 'react';
import { Droplets, ShieldCheck } from 'lucide-react';
import { QuickQuoteMiniForm } from '../components/QuickQuoteMiniForm';
import { poolPhotos } from '../data/initialData';

export const DevisPage: React.FC = () => <div className="slt-container pool-devis-page">
  <div className="pool-devis-intro"><span className="slt-eyebrow">CONSTRUISONS VOTRE PROJET</span><h1>Votre piscine commence<br />par un échange.</h1><p>Construction, rénovation, équipements ou entretien : décrivez votre besoin pour recevoir une étude personnalisée.</p><img src={poolPhotos.pool} alt="Piscine résidentielle et terrasse" /><div><span><Droplets size={20} /> Solutions sur mesure</span><span><ShieldCheck size={20} /> Devis détaillé</span></div></div>
  <div className="pool-devis-form"><QuickQuoteMiniForm /></div>
</div>;
