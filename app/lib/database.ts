import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../chatgpt-auth';
import { combinations, DEMO, DURATION, minutes, Reservation, Service, TIMES, validDate, futureSlot, isOpenDate, serviceAvailable } from './domain';

export class ApiError extends Error { constructor(message: string, public status = 400) { super(message); } }
export function database() { if (!env.DB) throw new ApiError('La agenda no está disponible. Inténtalo de nuevo en unos minutos.', 503); return env.DB; }
export async function scope(required = true) {
  const user = await getChatGPTUser();
  if (DEMO) { if (!user && required) throw new ApiError('Entra para guardar y revisar las reservas de prueba.', 401); return user ? `demo:${user.userId}` : 'anonymous-read-only'; }
  // Live operation is intentionally gated until venue configuration and administrator access are verified.
  throw new ApiError('Las reservas reales aún no están activadas.', 503);
}
export function checkOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') throw new ApiError('Solicitud no autorizada.', 403);
}
export function response(data: unknown, status = 200) { return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } }); }
export function failure(error: unknown) { if (error instanceof ApiError) return response({ error: error.message }, error.status); console.error('Afilao storage operation failed', error instanceof Error ? error.name : 'UnknownError'); return response({ error: 'No se pudo acceder a la agenda. Inténtalo de nuevo; tus datos siguen en el formulario.' }, 503); }
export async function body(request: Request) {
  if (!request.headers.get('content-type')?.includes('application/json')) throw new ApiError('Formato no válido.');
  const content = await request.text(); if (content.length > 5000) throw new ApiError('El formulario es demasiado largo.', 413);
  try { const value = JSON.parse(content); if (!value || typeof value !== 'object' || Array.isArray(value)) throw 0; return value as Record<string, unknown>; } catch { throw new ApiError('Formulario no válido.'); }
}
export function validateSelection(date: unknown, people: unknown, service: unknown) {
  if (typeof date !== 'string' || !validDate(date)) throw new ApiError('Elige una fecha válida, dentro de los próximos 45 días.');
  if (typeof people !== 'number' || !Number.isInteger(people) || people < 1 || people > 6) throw new ApiError('Elige entre 1 y 6 personas.');
  if (service !== 'comida' && service !== 'cena') throw new ApiError('Elige comida o cena.');
  return { date, people, service: service as Service };
}
export function reservationRow(row: Record<string, unknown>): Reservation & { version: number } { return { id: String(row.id), date: String(row.date), time: String(row.time), service: row.service as Service, people: Number(row.people), name: String(row.name), phone: String(row.phone), notes: String(row.notes), status: row.status as Reservation['status'], tables: JSON.parse(String(row.tables)), created_at: String(row.created_at), version: Number(row.version) }; }
export async function usedTables(s: string, date: string, time: string, except = '') {
  const begin = minutes(time); const rows = await database().prepare('SELECT DISTINCT table_id FROM claims WHERE scope = ? AND date = ? AND minute >= ? AND minute < ? AND reservation_id != ?').bind(s, date, begin, begin + DURATION, except).all<{ table_id: number }>();
  return new Set(rows.results.map(r => r.table_id));
}
export function claimStatements(s: string, date: string, time: string, tables: number[], id: string, version?: number, mutationToken?: string) {
  const result = [];
  for (const t of tables) for (let m = minutes(time); m < minutes(time) + DURATION; m += 15) {
    result.push(version === undefined ? database().prepare('INSERT INTO claims (scope,date,table_id,minute,reservation_id) VALUES (?,?,?,?,?)').bind(s, date, t, m, id) : database().prepare('INSERT INTO claims (scope,date,table_id,minute,reservation_id) SELECT ?,?,?,?,? WHERE EXISTS (SELECT 1 FROM reservations WHERE id=? AND scope=? AND version=? AND mutation_token=?)').bind(s, date, t, m, id, id, s, version, mutationToken));
  }
  return result;
}
export async function createReservation(s: string, value: Record<string, unknown>) {
  const { date, people, service } = validateSelection(value.date, value.people, value.service);
  if (!isOpenDate(date)) throw new ApiError('Los lunes y martes descansamos. Elige de miércoles a domingo.');
  if (!serviceAvailable(date, service)) throw new ApiError('Los domingos cerramos a las 18:00. Elige comida u otro día.');
  const time = value.time;
  if (typeof time !== 'string' || !TIMES[service].includes(time) || !futureSlot(date, time)) throw new ApiError('Esa hora ya no se puede reservar. Elige otra.');
  const name = typeof value.name === 'string' ? value.name.trim() : '';
  const phone = typeof value.phone === 'string' ? value.phone.trim() : '';
  const notes = typeof value.notes === 'string' ? value.notes.trim() : '';
  if (!name || name.length > 80 || phone.length > 24 || notes.length > 400) throw new ApiError('Revisa el nombre y la longitud de los datos.');
  if (phone && !/^[+\d\s()\-]{6,24}$/.test(phone)) throw new ApiError('Revisa el formato del teléfono o déjalo vacío en esta prueba.');
  const key = value.idempotencyKey;
  if (typeof key !== 'string' || !/^[a-zA-Z0-9-]{20,80}$/.test(key)) throw new ApiError('Vuelve a abrir el formulario para guardar la reserva.');
  const old = await database().prepare('SELECT * FROM reservations WHERE scope=? AND idempotency_key=?').bind(s, key).first<Record<string, unknown>>();
  if (old) { if (old.date !== date || old.time !== time || old.people !== people || old.name !== name || old.phone !== phone || old.notes !== notes) throw new ApiError('La solicitud ha cambiado. Vuelve a elegir la hora.', 409); return reservationRow(old); }
  const id = crypto.randomUUID(), created = new Date().toISOString();
  for (let attempt = 0; attempt < 3; attempt++) {
    const tables = combinations(people, await usedTables(s, date, time));
    if (!tables) throw new ApiError('Ya no queda una mesa para esa hora. Elige otro horario.', 409);
    const insert = database().prepare('INSERT INTO reservations (id,scope,date,time,service,people,name,phone,notes,status,tables,version,idempotency_key,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id, s, date, time, service, people, name, phone, notes, 'confirmada', JSON.stringify(tables), 0, key, created);
    try { await database().batch([insert, ...claimStatements(s, date, time, tables, id)]); return { id, date, time, service, people, name, phone, notes, status: 'confirmada' as const, tables, version: 0, created_at: created }; }
    catch (e) {
      if (!(e instanceof Error) || !/UNIQUE constraint failed/.test(e.message)) throw e;
      const duplicate = await database().prepare('SELECT * FROM reservations WHERE scope=? AND idempotency_key=?').bind(s, key).first<Record<string, unknown>>(); if (duplicate) return reservationRow(duplicate);
    }
  }
  throw new ApiError('La mesa acaba de ocuparse. Vuelve a consultar las horas.', 409);
}
