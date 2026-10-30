import React from 'react';
import { Droplets, ShieldCheck, UsersRound, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { poolPhotos } from '../data/initialData';

export const AboutPage: React.FC = () => {
  const { settings, navigate } = useApp();
  return <div className="slt-container pool-about-page"><span className="slt-eyebrow">À PROPOS DE {settings.companyName}</span><h1>Votre piscine,<br />notre expertise.</h1><p>De la conception à la maintenance, nous accompagnons vos projets aquatiques à Marrakech et au Maroc.</p><img src={poolPhotos.hero} alt="Piscine et villa contemporaine" /><div className="pool-about-grid">{[{ Icon: Droplets, title: 'Des solutions sur mesure', text: 'Construction de piscines, aménagement des abords et rénovation du bassin : un projet étudié selon votre espace et vos usages.' }, { Icon: UsersRound, title: 'Un accompagnement professionnel', text: 'Un interlocuteur pour préciser votre besoin, suivre les étapes de votre projet et vous accompagner dans l’entretien de votre piscine.' }, { Icon: ShieldCheck, title: 'Des équipements adaptés', text: 'Pompes, filtration, traitement de l’eau, robots et éclairage : une sélection qui tient compte des caractéristiques de votre installation.' }].map(({ Icon, title, text }) => <div key={title}><Icon /><h2>{title}</h2><p>{text}</p></div>)}</div><button className="slt-btn" onClick={() => navigate('/devis')}>Demander une étude personnalisée <ArrowRight size={18} /></button></div>;
};
