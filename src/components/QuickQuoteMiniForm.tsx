import React, { useId, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { initialServices } from '../data/initialData';

export const QuickQuoteMiniForm: React.FC = () => {
  const { submitLead } = useApp();
  const id = useId();
  const [data, setData] = useState({ service: '', name: '', phone: '', city: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const change = (field: keyof typeof data) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setData({ ...data, [field]: event.target.value });
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true); setError('');
    try {
      const result = await submitLead({ name: data.name.trim(), phone: data.phone.trim(), city: data.city.trim(), service: data.service, source: 'devis_rapide', description: data.message.trim() || `Projet piscine : ${data.service}` });
      if (result.success && result.reference) setReference(result.reference);
      else setError(result.error || 'Votre demande n’a pas pu être enregistrée. Réessayez.');
    } catch { setError('Connexion au serveur impossible. Veuillez réessayer.'); }
    finally { setLoading(false); }
  };
  if (reference) return <div className="pool-quote-success" role="status"><CheckCircle2 size={34} /><h3>Demande enregistrée</h3><p>Votre référence : <strong>{reference}</strong></p><button className="slt-btn" onClick={() => setReference('')}>Nouvelle demande</button></div>;
  return <div className="quote-form-shell">
    <h3>Demandez votre devis</h3><p className="quote-form-intro">Recevez une étude personnalisée<br />de votre projet.</p>
    <form onSubmit={submit} className="pool-quote-form">
      <div className="pool-quote-fields">
        <div><label className="sr-only" htmlFor={`${id}-service`}>Type de projet</label><select id={`${id}-service`} required value={data.service} onChange={change('service')}><option value="" disabled>Type de projet</option>{initialServices.map(service => <option key={service.id}>{service.title}</option>)}</select></div>
        <div><label className="sr-only" htmlFor={`${id}-name`}>Votre nom</label><input id={`${id}-name`} autoComplete="name" required placeholder="Votre nom" value={data.name} onChange={change('name')} /></div>
        <div><label className="sr-only" htmlFor={`${id}-phone`}>Téléphone</label><input id={`${id}-phone`} type="tel" autoComplete="tel" required placeholder="Téléphone" value={data.phone} onChange={change('phone')} /></div>
        <div><label className="sr-only" htmlFor={`${id}-city`}>Ville</label><input id={`${id}-city`} autoComplete="address-level2" required placeholder="Ville" value={data.city} onChange={change('city')} /></div>
      </div>
      <label className="sr-only" htmlFor={`${id}-message`}>Votre message (facultatif)</label><textarea id={`${id}-message`} rows={3} placeholder="Votre message (facultatif)" value={data.message} onChange={change('message')} />
      {error && <p role="alert">{error}</p>}
      <button className="slt-btn" type="submit" disabled={loading}>{loading ? 'Envoi en cours…' : 'Recevoir mon devis'}<ArrowRight size={18} /></button>
      <p className="pool-privacy">Vos coordonnées sont utilisées pour répondre à votre demande.</p>
    </form>
  </div>;
};
