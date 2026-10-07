import { ApiError, body, checkOrigin, createReservation, database, failure, reservationRow, response, scope } from '../../lib/database';
import { validDate } from '../../lib/domain';
import { notifyRestaurant } from '../../lib/notifications';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) { try { const s = await scope(); const date = new URL(request.url).searchParams.get('date') || ''; if (!validDate(date)) throw new ApiError('Fecha no válida.'); const rows = await database().prepare('SELECT * FROM reservations WHERE scope=? AND date=? ORDER BY time,created_at').bind(s, date).all<Record<string, unknown>>(); return response({ reservations: rows.results.map(reservationRow), demo: true }); } catch (e) { return failure(e); } }
export async function POST(request: Request) { try { checkOrigin(request); const s = await scope(); const value = await body(request); const reservation = await createReservation(s, value); const notification = await notifyRestaurant(reservation); return response({ reservation, notification, demo: true }, 201); } catch (e) { return failure(e); } }
