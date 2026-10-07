export const DEMO = true;
export const TIME_ZONE = 'Atlantic/Canary';
export const DURATION = 90;
// Opening days confirmed by Juan: Wednesday through Sunday.
export const OPEN_DAYS = [0, 3, 4, 5, 6];
export function isOpenDate(date: string) { return OPEN_DAYS.includes(new Date(`${date}T12:00:00Z`).getUTCDay()); }
export const TABLES = Array.from({ length: 9 }, (_, i) => ({ id: i + 1, capacity: 2, flexibleCapacity: 3 }));
export const TABLE_SEATS_WITH_EXTRA_CHAIR = 3;
export function tablesNeeded(people: number) { return Math.ceil(people / TABLE_SEATS_WITH_EXTRA_CHAIR); }
// Hours, base seating layout and joined-table combinations remain provisional.
export const TIMES = { comida: ['13:30', '14:00', '14:30', '15:00'], cena: ['20:00', '20:30', '21:00', '21:30', '22:00'] };
export function serviceAvailable(date: string, service: Service) { return isOpenDate(date) && !(new Date(`${date}T12:00:00Z`).getUTCDay() === 0 && service === 'cena'); }
export type Service = keyof typeof TIMES;
export type Status = 'confirmada' | 'sentada' | 'completada' | 'cancelada';
export type Reservation = { id: string; date: string; time: string; service: Service; people: number; name: string; phone: string; notes: string; status: Status; tables: number[]; created_at: string };
export function today() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  return ['year', 'month', 'day'].map(key => parts.find(p => p.type === key)?.value).join('-');
}
export function addDays(date: string, count: number) { const d = new Date(`${date}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + count); return d.toISOString().slice(0, 10); }
export function nextOpenDate() { let date = addDays(today(), 1); while (!isOpenDate(date)) date = addDays(date, 1); return date; }
export function dateLabel(date: string, short = false) { return new Intl.DateTimeFormat('es-ES', { timeZone: TIME_ZONE, weekday: short ? undefined : 'long', day: 'numeric', month: short ? 'short' : 'long' }).format(new Date(`${date}T12:00:00Z`)); }
export function minutes(time: string) { const [h, m] = time.split(':').map(Number); return h * 60 + m; }
export function futureSlot(date: string, time: string) {
  if (date > today()) return true; if (date < today()) return false;
  const now = new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date());
  return minutes(time) > minutes(now) + 15;
}
export function validDate(date: string) { if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false; const d = new Date(`${date}T12:00:00Z`); return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === date && date >= today() && date <= addDays(today(), 45); }
export function combinations(people: number, used: Set<number>, preferredTable = 0) {
  const needed = tablesNeeded(people);
  const starts = Array.from({ length: 10 - needed }, (_, i) => i + 1).filter(start => {
    const group = Array.from({ length: needed }, (_, i) => start + i);
    return Math.floor((start - 1) / 3) === Math.floor((start + needed - 2) / 3) && group.every(t => !used.has(t));
  });
  if (preferredTable) starts.sort((a, b) => {
    const aKeeps = a <= preferredTable && preferredTable < a + needed, bKeeps = b <= preferredTable && preferredTable < b + needed;
    return Number(bKeeps) - Number(aKeeps) || Math.abs(a - preferredTable) - Math.abs(b - preferredTable);
  });
  return starts.length ? Array.from({ length: needed }, (_, i) => starts[0] + i) : null;
}
