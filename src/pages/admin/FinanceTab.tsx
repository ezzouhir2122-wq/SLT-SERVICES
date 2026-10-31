import React, { useEffect, useMemo, useState } from 'react';
import { FileText, Plus, Trash2, Printer, CalendarClock } from 'lucide-react';

export interface FinancePrefill {
  client?: string;
  objet?: string;
  ref?: string;
  phone?: string;
  city?: string;
}

interface Line { desc: string; u: string; qt: string; pu: string; }

/* ---------- Nombres ---------- */
const toNum = (v: string) => parseFloat(String(v || '').replace(/\s/g, '').replace(',', '.')) || 0;
const fmt = (x: number) => {
  const [i, d] = x.toFixed(2).split('.');
  return i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + '.' + d;
};

/* ---------- Montant en lettres (français) ---------- */
const U = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const D = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];
function below100(n: number): string {
  if (n < 20) return U[n];
  const d = Math.floor(n / 10), u = n % 10;
  if (d >= 2 && d <= 6) {
    const b = D[d];
    if (u === 0) return b;
    if (u === 1) return b + ' et un';
    return b + '-' + U[u];
  }
  if (d === 7) { if (n === 71) return 'soixante et onze'; return 'soixante-' + U[n - 60]; }
  if (d === 8) { if (u === 0) return 'quatre-vingts'; return 'quatre-vingt-' + U[u]; }
  return 'quatre-vingt-' + U[n - 80];
}
function below1000(n: number): string {
  const c = Math.floor(n / 100), r = n % 100; let s = '';
  if (c > 0) { s += (c > 1 ? U[c] + ' ' : '') + 'cent'; if (c > 1 && r === 0) s += 's'; if (r > 0) s += ' '; }
  if (r > 0) s += below100(r);
  return s;
}
function enLettres(n: number): string {
  n = Math.floor(n);
  if (n === 0) return 'zéro';
  const mi = Math.floor(n / 1e6); n %= 1e6;
  const ml = Math.floor(n / 1000); n %= 1000;
  const parts: string[] = [];
  if (mi > 0) parts.push(below1000(mi) + ' million' + (mi > 1 ? 's' : ''));
  if (ml > 0) parts.push(ml === 1 ? 'mille' : below1000(ml) + ' mille');
  if (n > 0) parts.push(below1000(n));
  return parts.join(' ');
}
function montantLettres(ttc: number): string {
  const dh = Math.floor(ttc);
  const cent = Math.round((ttc - dh) * 100);
  let s = enLettres(dh) + ' dirham' + (dh > 1 ? 's' : '');
  if (cent > 0) s += ' et ' + enLettres(cent) + ' centime' + (cent > 1 ? 's' : '');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function todayDMY() {
  const n = new Date(), p = (x: number) => String(x).padStart(2, '0');
  return { date: `${p(n.getDate())}-${p(n.getMonth() + 1)}-${n.getFullYear()}`, mmYYYY: `${p(n.getMonth() + 1)}${n.getFullYear()}` };
}

export const FinanceTab: React.FC<{ prefill?: FinancePrefill | null }> = ({ prefill }) => {
  const init = todayDMY();
  const [docType, setDocType] = useState<'facture' | 'devis'>('facture');
  const [date, setDate] = useState(init.date);
  const [num, setNum] = useState(`001-${init.mmYYYY}`);
  const [client, setClient] = useState('');
  const [address, setAddress] = useState('');
  const [tel, setTel] = useState('');
  const [ice, setIce] = useState('');
  const [objet, setObjet] = useState('');
  const [tvaRate, setTvaRate] = useState('20');
  const [reglement, setReglement] = useState('Virement bancaire');
  const [lines, setLines] = useState<Line[]>([{ desc: '', u: 'U', qt: '1', pu: '0' }]);

  // Pré-remplissage depuis un lead.
  useEffect(() => {
    if (!prefill) return;
    if (prefill.client) setClient(prefill.client);
    if (prefill.objet) setObjet(prefill.objet);
    if (prefill.city) setAddress(prefill.city);
    if (prefill.phone) setTel(prefill.phone);
  }, [prefill]);

  const { ht, tva, ttc } = useMemo(() => {
    const ht = lines.reduce((s, l) => s + toNum(l.qt) * toNum(l.pu), 0);
    const tva = ht * (toNum(tvaRate) / 100);
    return { ht, tva, ttc: ht + tva };
  }, [lines, tvaRate]);

  const titre = docType === 'devis' ? 'Devis' : 'Facture';
  const arrete = docType === 'devis'
    ? 'Arrêté le présent devis à la somme de :'
    : 'Arrêtée la présente facture à la somme de :';

  const setLine = (i: number, patch: Partial<Line>) =>
    setLines(ls => ls.map((l, k) => (k === i ? { ...l, ...patch } : l)));
  const addLine = () => setLines(ls => [...ls, { desc: '', u: 'U', qt: '1', pu: '0' }]);
  const delLine = (i: number) => setLines(ls => ls.filter((_, k) => k !== i));
  const autoDateNum = () => {
    const t = todayDMY();
    const seq = (num.split('-')[0] || '001').replace(/[^0-9]/g, '') || '001';
    setDate(t.date);
    setNum(`${seq}-${t.mmYYYY}`);
  };

  return (
    <div className="space-y-5">
      <style>{finCss}</style>

      {/* Barre d'outils (non imprimée) */}
      <div className="fin-toolbar flex flex-wrap items-center gap-2">
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#102A43] mr-2">
          <FileText className="w-5 h-5 text-[#0077B6]" /> Devis & Factures
        </h2>
        <div className="inline-flex rounded-lg bg-slate-100 p-1">
          <button onClick={() => setDocType('facture')} className={`px-3 py-1.5 text-xs font-semibold rounded-md ${docType === 'facture' ? 'bg-white text-[#102A43] shadow-sm' : 'text-slate-500'}`}>Facture</button>
          <button onClick={() => setDocType('devis')} className={`px-3 py-1.5 text-xs font-semibold rounded-md ${docType === 'devis' ? 'bg-white text-[#102A43] shadow-sm' : 'text-slate-500'}`}>Devis</button>
        </div>
        <button onClick={addLine} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0077B6] text-white text-xs font-semibold hover:bg-[#026a9f]"><Plus className="w-3.5 h-3.5" /> Ligne</button>
        <button onClick={autoDateNum} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"><CalendarClock className="w-3.5 h-3.5" /> Date + N° du jour</button>
        <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 ml-auto"><Printer className="w-3.5 h-3.5" /> Imprimer / PDF</button>
      </div>

      {/* Document imprimable */}
      <div id="fin-doc" className="fin-doc">
        <div className="fin-head">
          <img src="/assets/logo-slt.png" alt="SLT SERVICES" />
          <div className="fin-activity">
            <span className="fin-big">S</span>ociété Spécialisée dans les Travaux de Constructions, les Infrastructures,
            Rénovation, Terrassement, Assainissement, Aménagement, Construction et Entretien des Routes
            et Travaux de Tous Corps d'Etat
          </div>
        </div>

        <div className="fin-date">Marrakech , le <input className="fin-field" style={{ width: 110 }} value={date} onChange={e => setDate(e.target.value)} /></div>

        <div className="fin-meta">
          <div className="fin-num">{titre} N° : <input className="fin-field" style={{ width: 130 }} value={num} onChange={e => setNum(e.target.value)} /></div>
          <div>Client : <input className="fin-field fin-grow" value={client} placeholder="Nom du client" onChange={e => setClient(e.target.value)} /></div>
          <div>Adresse : <input className="fin-field fin-grow" value={address} placeholder="Adresse / ville du client" onChange={e => setAddress(e.target.value)} /></div>
          <div>Tél. : <input className="fin-field fin-grow" value={tel} placeholder="Téléphone du client" onChange={e => setTel(e.target.value)} /></div>
          <div>ICE : <input className="fin-field fin-grow" value={ice} placeholder="ICE du client" onChange={e => setIce(e.target.value)} /></div>
          <div>Objet : <input className="fin-field fin-grow" value={objet} placeholder="Objet des travaux" onChange={e => setObjet(e.target.value)} /></div>
          {docType === 'devis' && <div className="fin-validity">Devis valable 30 jours à compter de la date d'émission.</div>}
        </div>

        <table className="fin-table">
          <thead>
            <tr>
              <th style={{ width: 36 }}>N°</th>
              <th>DESIGNATION</th>
              <th style={{ width: 46 }}>U</th>
              <th style={{ width: 70 }}>QT</th>
              <th style={{ width: 90 }}>PRIX U HT</th>
              <th style={{ width: 110 }}>TOTAL HT</th>
              <th className="fin-del" />
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td className="fin-desc"><input className="fin-field fin-grow fin-left" value={l.desc} placeholder="Désignation des travaux / prestations" onChange={e => setLine(i, { desc: e.target.value })} /></td>
                <td><input className="fin-field fin-center" value={l.u} onChange={e => setLine(i, { u: e.target.value })} /></td>
                <td><input className="fin-field fin-center" value={l.qt} inputMode="decimal" onChange={e => setLine(i, { qt: e.target.value })} /></td>
                <td><input className="fin-field fin-center" value={l.pu} inputMode="decimal" onChange={e => setLine(i, { pu: e.target.value })} /></td>
                <td className="fin-linetot">{fmt(toNum(l.qt) * toNum(l.pu))}</td>
                <td className="fin-del"><button onClick={() => delLine(i)} title="Supprimer"><Trash2 className="w-3.5 h-3.5" /></button></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td className="fin-totlabel" colSpan={5}>TOTAL HT</td><td className="fin-totval">{fmt(ht)}</td><td className="fin-del" /></tr>
            <tr><td className="fin-totlabel" colSpan={5}>TVA <input className="fin-field fin-center" style={{ width: 34 }} value={tvaRate} onChange={e => setTvaRate(e.target.value)} />%</td><td className="fin-totval">{fmt(tva)}</td><td className="fin-del" /></tr>
            <tr><td className="fin-totlabel" colSpan={5}>TOTAL TTC</td><td className="fin-totval">{fmt(ttc)}</td><td className="fin-del" /></tr>
          </tfoot>
        </table>

        <div className="fin-lettres">{arrete} <strong>{montantLettres(ttc)} Dhs</strong></div>
        <div className="fin-reg">Mode de règlement : <input className="fin-field fin-grow" value={reglement} onChange={e => setReglement(e.target.value)} /></div>

        <div className="fin-sign">Signature<div className="fin-sign-zone" /></div>

        <div className="fin-legal">
          <span className="fin-name">SLT SERVICES</span> S.A.R.L - Capital 1 000 000,00 DHS. Adresse du Siège : N° 484 BUREAU N° 26 QI SIDI GHANEM
          MARRAKECH &nbsp;·&nbsp; C.N.S.S : 5535817 &nbsp;·&nbsp; R.C N° : 151233 &nbsp;·&nbsp; Patente N° : 64003383 &nbsp;·&nbsp; IF : 66003383 &nbsp;·&nbsp;
          ICE 003540448000046 &nbsp;·&nbsp; Tél/fax : +212 661 586 841 &nbsp;·&nbsp; C.B : 007 450 00 13468000001409 61 - ATTIJARIWAFABANK Q-I SIDI GHANEM MARRAKECH
        </div>
      </div>
    </div>
  );
};

const finCss = `
.fin-doc{ background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:22px 26px 18px;
  font-family:"Times New Roman", Georgia, serif; color:#111; font-size:13px; max-width:800px;
  display:flex; flex-direction:column; min-height:1040px; }
.fin-field{ border:0; background:transparent; font:inherit; color:inherit; padding:0 2px; outline:none; }
.fin-field:focus{ background:#eef6ff; }
.fin-field::placeholder{ color:#9aa5b1; font-style:italic; }
.fin-grow{ width:70%; }
.fin-center{ text-align:center; }
.fin-left{ text-align:left; }
.fin-head{ display:flex; gap:14px; align-items:flex-start; }
.fin-head img{ width:140px; height:auto; object-fit:contain; }
.fin-activity{ font-style:italic; color:#1d3a8a; font-weight:700; line-height:1.35; font-size:12px; padding-top:4px; }
.fin-big{ font-size:15px; }
.fin-date{ text-align:right; margin-top:20px; }
.fin-meta{ margin-top:14px; line-height:1.9; }
.fin-num{ font-weight:700; }
.fin-validity{ font-style:italic; }
.fin-table{ width:100%; border-collapse:collapse; margin-top:20px; table-layout:fixed; }
.fin-table th,.fin-table td{ border:1px solid #000; padding:5px 7px; text-align:center; vertical-align:middle; word-wrap:break-word; }
.fin-table td input{ width:100%; box-sizing:border-box; }
.fin-table th{ font-weight:700; }
.fin-desc{ text-align:left; }
.fin-linetot,.fin-totval{ font-weight:700; text-align:center; }
.fin-totlabel{ font-style:italic; font-weight:700; text-align:center; }
.fin-lettres{ margin-top:18px; line-height:1.8; }
.fin-reg{ margin-top:6px; }
.fin-sign{ margin-top:22px; text-align:center; font-weight:700; }
.fin-sign-zone{ height:90px; }
.fin-legal{ margin-top:auto; border-top:1.5px solid #1d3a8a; padding-top:6px; text-align:center;
  color:#1d3a8a; font-size:10px; line-height:1.4; font-weight:600; }
.fin-name{ font-weight:800; }
.fin-del{ width:28px; }
.fin-del button{ border:0; background:transparent; color:#c0392b; cursor:pointer; }
@media print{
  body *{ visibility:hidden !important; }
  #fin-doc, #fin-doc *{ visibility:visible !important; }
  #fin-doc{ position:absolute; left:0; top:0; width:100%; max-width:none; min-height:auto; border:0; border-radius:0; padding:8mm 12mm 26mm; display:block; }
  /* Bandeau légal collé en pied de page imprimée */
  .fin-legal{ position:fixed; left:12mm; right:12mm; bottom:6mm; margin-top:0; background:#fff; }
  .fin-del{ display:none !important; }
  .fin-field:focus{ background:transparent !important; }
}
@page{ size:A4; margin:8mm; }
`;
