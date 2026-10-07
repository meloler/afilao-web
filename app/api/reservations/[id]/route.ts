import { ApiError, body, checkOrigin, claimStatements, database, failure, reservationRow, response, scope, usedTables } from '../../../lib/database';
import { combinations } from '../../../lib/domain';
export const dynamic = 'force-dynamic';
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    checkOrigin(request); const s = await scope(); const { id } = await params; const value = await body(request);
    const row = await database().prepare('SELECT * FROM reservations WHERE id=? AND scope=?').bind(id, s).first<Record<string, unknown>>();
    if (!row) throw new ApiError('No se encuentra esa reserva.', 404);
    const r = reservationRow(row), version = r.version + 1, mutationToken = crypto.randomUUID();
    if (value.version !== r.version) throw new ApiError('La reserva ha cambiado. La agenda se actualizará; vuelve a intentarlo.', 409);
    let results: D1Result[];
    if (value.action === 'status') {
      const transitions: Record<string, string[]> = { confirmada: ['sentada', 'cancelada'], sentada: ['completada', 'cancelada'], completada: [], cancelada: [] };
      if (typeof value.status !== 'string' || !transitions[r.status]?.includes(value.status)) throw new ApiError('Ese cambio de estado no está disponible.');
      const statements = [database().prepare('UPDATE reservations SET status=?,version=?,mutation_token=? WHERE id=? AND scope=? AND version=?').bind(value.status, version, mutationToken, id, s, r.version)];
      if (['cancelada', 'completada'].includes(value.status)) statements.push(database().prepare('DELETE FROM claims WHERE reservation_id=? AND scope=? AND EXISTS (SELECT 1 FROM reservations WHERE id=? AND scope=? AND version=? AND mutation_token=? AND status=?)').bind(id, s, id, s, version, mutationToken, value.status));
      results = await database().batch(statements);
    } else if (value.action === 'table') {
      if (!['confirmada', 'sentada'].includes(r.status)) throw new ApiError('Esta reserva ya está cerrada.');
      const start = Number(value.table), count = Math.ceil(r.people / 2), tables = Array.from({ length: count }, (_, i) => start + i);
      if (!Number.isInteger(start) || start < 1 || start + count > 10 || Math.floor((start - 1) / 3) !== Math.floor((start + count - 2) / 3)) throw new ApiError('Esa combinación de mesas no está permitida en el esquema de prueba.');
      const used = await usedTables(s, r.date, r.time, id); if (tables.some(t => used.has(t))) throw new ApiError('Una de esas mesas está ocupada en ese horario.', 409);
      try { results = await database().batch([
        database().prepare('UPDATE reservations SET tables=?,version=?,mutation_token=? WHERE id=? AND scope=? AND version=?').bind(JSON.stringify(tables), version, mutationToken, id, s, r.version),
        database().prepare('DELETE FROM claims WHERE reservation_id=? AND scope=? AND EXISTS (SELECT 1 FROM reservations WHERE id=? AND scope=? AND version=? AND mutation_token=?)').bind(id, s, id, s, version, mutationToken),
        ...claimStatements(s, r.date, r.time, tables, id, version, mutationToken),
      ]); } catch (e) { if (e instanceof Error && /UNIQUE constraint failed/.test(e.message)) throw new ApiError('Esa mesa acaba de ocuparse. Elige otra.', 409); throw e; }
    } else throw new ApiError('Acción no válida.');
    if (!results[0].meta.changes) throw new ApiError('La reserva ha cambiado. Vuelve a intentarlo.', 409);
    return response({ ok: true });
  } catch (e) { return failure(e); }
}
