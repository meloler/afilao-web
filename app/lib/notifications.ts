import { env } from 'cloudflare:workers';
import { DEMO, dateLabel, Reservation } from './domain';
// Optional restaurant notification. Disabled throughout the private prototype.
// A successful provider response means accepted for sending, not delivered.
export async function notifyRestaurant(r: Reservation): Promise<'disabled' | 'accepted' | 'failed'> {
  if (DEMO || !env.RESEND_API_KEY || !env.RESERVATIONS_EMAIL_FROM || !env.RESERVATIONS_EMAIL_TO) return 'disabled';
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(5000),
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `afilao-reservation-${r.id}` },
      body: JSON.stringify({ from: env.RESERVATIONS_EMAIL_FROM, to: [env.RESERVATIONS_EMAIL_TO], subject: `Afilao: nueva reserva, ${r.people} personas a las ${r.time}`, text: [`Nueva reserva en Afilao`, dateLabel(r.date), `${r.time} h (hora canaria)`, `${r.people} personas`, `A nombre de: ${r.name}`, `Mesas: ${r.tables.join(' + ')}`, `Referencia: ${r.id.slice(0,8).toUpperCase()}`, 'Consulta los detalles en el panel del bar.'].join('\n') }),
    });
    return response.ok ? 'accepted' : 'failed';
  } catch { return 'failed'; }
}
