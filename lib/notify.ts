import { Lead } from '../src/types/index.ts';

/**
 * Notification email d'un nouveau lead via l'API Resend (HTTP, sans dépendance).
 * Activée uniquement si RESEND_API_KEY et LEAD_NOTIFY_EMAIL sont définis ;
 * sinon no-op silencieux (le lead reste enregistré normalement).
 *
 * Variables d'environnement :
 *  - RESEND_API_KEY     : clé API Resend (re_...)
 *  - LEAD_NOTIFY_EMAIL  : adresse(s) de réception, séparées par des virgules
 *  - LEAD_NOTIFY_FROM   : expéditeur vérifié (def. "SLT SERVICES <onboarding@resend.dev>")
 *  - APP_URL            : base URL du site (pour le lien vers le dashboard admin)
 */

const URGENCY_LABEL: Record<string, string> = {
  immediate: 'Immédiate 🔴',
  '24_48h': 'Sous 24-48h 🟠',
  cette_semaine: 'Cette semaine 🟡',
  flexible: 'Flexible 🟢',
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildHtml(lead: Lead, adminUrl: string): string {
  const row = (label: string, value?: string) =>
    value ? `<tr><td style="padding:6px 12px;color:#64748b;font-weight:600;">${label}</td><td style="padding:6px 12px;color:#0f172a;">${escapeHtml(value)}</td></tr>` : '';
  const whatsappNum = (lead.whatsapp || lead.phone).replace(/[^0-9]/g, '');
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;">
    <div style="background:#0077B6;color:#fff;padding:16px 20px;border-radius:10px 10px 0 0;">
      <h2 style="margin:0;font-size:18px;">🏊 Nouveau lead — ${escapeHtml(lead.ref)}</h2>
      <p style="margin:4px 0 0;font-size:13px;opacity:.9;">Urgence : ${URGENCY_LABEL[lead.urgency || 'cette_semaine'] || lead.urgency}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;background:#f8fafc;font-size:14px;">
      ${row('Nom', lead.name)}
      ${row('Téléphone', lead.phone)}
      ${row('Email', lead.email)}
      ${row('Ville', lead.city)}
      ${row('Service', lead.service)}
      ${row('Source', lead.source)}
      ${row('Page', lead.originPage)}
      <tr><td style="padding:6px 12px;color:#64748b;font-weight:600;vertical-align:top;">Message</td><td style="padding:6px 12px;color:#0f172a;">${escapeHtml(lead.description)}</td></tr>
    </table>
    <div style="padding:16px 20px;background:#f8fafc;border-radius:0 0 10px 10px;text-align:center;">
      <a href="https://wa.me/${whatsappNum}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;margin:4px;">Répondre sur WhatsApp</a>
      <a href="tel:${escapeHtml(lead.phone)}" style="display:inline-block;background:#0077B6;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;margin:4px;">Appeler</a>
      ${adminUrl ? `<a href="${adminUrl}" style="display:inline-block;color:#0077B6;text-decoration:none;padding:10px 18px;font-weight:600;margin:4px;">Voir dans le dashboard →</a>` : ''}
    </div>
  </div>`;
}

export async function notifyNewLead(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!apiKey || !to) return; // non configuré → on ne bloque pas

  const from = process.env.LEAD_NOTIFY_FROM || 'SLT SERVICES <onboarding@resend.dev>';
  const base = (process.env.APP_URL || '').replace(/\/$/, '');
  const adminUrl = base ? `${base}/admin` : '';

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: to.split(',').map(e => e.trim()).filter(Boolean),
        reply_to: lead.email || undefined,
        subject: `🏊 Nouveau lead ${lead.ref} — ${lead.name} (${lead.city})`,
        html: buildHtml(lead, adminUrl),
      }),
    });
    if (!res.ok) {
      console.error('[notify] Resend a répondu', res.status, await res.text());
    }
  } catch (err) {
    console.error('[notify] Échec envoi email lead:', err);
  }
}
