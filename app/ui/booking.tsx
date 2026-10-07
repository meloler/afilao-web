'use client';
import { useEffect, useRef, useState } from 'react';
import { CalendarDays, Check, ChevronLeft, Minus, Plus, X } from 'lucide-react';
import { addDays, dateLabel, Service, today, nextOpenDate } from '../lib/domain';
export default function Booking({ open, close }: { open: boolean; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [stage, setStage] = useState<'mesa' | 'datos' | 'hecho'>('mesa');
  const [date, setDate] = useState(nextOpenDate());
  const [people, setPeople] = useState(2);
  const [service, setService] = useState<Service>('comida');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [reference, setReference] = useState('');
  const [refresh, setRefresh] = useState(0);
  const key = useRef('');
  useEffect(() => { if (open) { setStage('mesa'); setError(''); dialog.current?.showModal(); } else dialog.current?.close(); document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  useEffect(() => {
    if (!open || stage !== 'mesa') return;
    const controller = new AbortController(); setLoading(true); setTime(''); setNotice('');
    fetch(`/api/availability?date=${date}&people=${people}&service=${service}`, { signal: controller.signal })
      .then(async r => { const data = await r.json() as { error?: string; message?: string; slots: { time: string; available: boolean }[] }; if (!r.ok) throw new Error(data.error); return data; }).then(data => { setSlots(data.slots); setNotice(data.message || ''); })
      .catch(e => { if (e.name !== 'AbortError') { setSlots([]); setError(e.message || 'No podemos consultar las mesas. Inténtalo de nuevo.'); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [open, date, people, service, stage, refresh]);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(''); key.current ||= crypto.randomUUID();
    try {
      const response = await fetch('/api/reservations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date, people, service, time, name, phone, notes, idempotencyKey: key.current }) });
      const data = await response.json() as { error?: string; reservation: { id: string } };
      if (!response.ok) { if (response.status === 409) { setStage('mesa'); setRefresh(r => r + 1); key.current = ''; } throw new Error(data.error); }
      setReference(data.reservation.id.slice(0, 8).toUpperCase()); setStage('hecho'); key.current = '';
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar. Tus datos siguen aquí; puedes volver a intentarlo.'); } finally { setSaving(false); }
  }
  return <dialog ref={dialog} className="booking-dialog" onCancel={close} onClick={e => { if (e.target === dialog.current) close(); }} aria-labelledby="booking-title"><div className="booking-inner">
    <div className="dialog-top"><span className="condensed">AFILAO / TU MESA</span><button className="icon-button" onClick={close} aria-label="Cerrar reserva"><X size={24} /></button></div><p className="demo-note">Modo prueba. No se realiza una reserva real.</p>
    {stage === 'mesa' && <><h2 id="booking-title">PILLA<br />MESA.</h2><p className="booking-intro">Tú trae hambre. Lo demás lo ponemos aquí.</p><label className="field-label" htmlFor="booking-date">¿Cuándo te vienes?</label><div className="date-input"><CalendarDays size={21} /><input id="booking-date" type="date" value={date} min={today()} max={addDays(today(), 45)} onChange={e => { if (e.target.value) setDate(e.target.value); }} required /></div><div className="people-line"><div><span className="field-label">¿Cuántos sois?</span><small>Hasta 6 en esta prueba</small></div><div className="stepper"><button onClick={() => setPeople(p => p - 1)} disabled={people <= 1} aria-label="Un comensal menos"><Minus size={20} /></button><output aria-live="polite">{people}</output><button onClick={() => setPeople(p => p + 1)} disabled={people >= 6} aria-label="Un comensal más"><Plus size={20} /></button></div></div><div className="service-switch" role="group" aria-label="Servicio"><button aria-pressed={service === 'comida'} onClick={() => setService('comida')}>Comida</button><button aria-pressed={service === 'cena'} onClick={() => setService('cena')}>Cena</button></div><p className="field-label">Elige la hora <span className="muted">(hora canaria)</span></p><div className="time-grid" aria-busy={loading}>{loading ? <p className="loading-line">Buscando mesas…</p> : slots.map(slot => <button key={slot.time} disabled={!slot.available} aria-pressed={time === slot.time} onClick={() => setTime(slot.time)}>{slot.time}</button>)}</div>{!loading && slots.length > 0 && slots.every(s => !s.available) && <p className="form-message">No hay hueco para esa fecha. Prueba otro día o servicio.</p>}{notice && <p className="form-message" role="status">{notice}</p>}{error && <div className="form-message" role="alert">{error}<button onClick={() => setRefresh(r => r + 1)}>Volver a consultar</button></div>}<button className="button full" disabled={!time || loading} onClick={() => { setStage('datos'); setError(''); key.current = ''; }}>Continuar</button><p className="fine-print">Horarios y distribución provisionales para probar el recorrido.</p></>}
    {stage === 'datos' && <><button className="back-button" onClick={() => setStage('mesa')}><ChevronLeft size={18} /> Cambiar mesa</button><h2 id="booking-title">¿A NOMBRE<br />DE QUIÉN?</h2><div className="booking-summary"><strong>{dateLabel(date)}</strong><span>{time} h / {people} {people === 1 ? 'persona' : 'personas'}</span></div><form onSubmit={submit}><label className="field-label" htmlFor="guest-name">Nombre</label><input className="text-input" id="guest-name" autoComplete="given-name" required maxLength={80} value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" /><label className="field-label" htmlFor="guest-phone">Teléfono <span className="muted">(opcional en la prueba)</span></label><input className="text-input" id="guest-phone" type="tel" autoComplete="tel" maxLength={24} value={phone} onChange={e => setPhone(e.target.value)} placeholder="Puedes dejarlo vacío" /><label className="field-label" htmlFor="guest-notes">¿Algo que debamos saber? <span className="muted">(opcional)</span></label><textarea className="text-input" id="guest-notes" rows={2} maxLength={400} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Una petición para la mesa…" /><p className="fine-print">Usa datos de prueba. Se guardan para revisar el panel de mesas. Esta versión no envía mensajes al bar.</p>{error && <p className="form-message" role="alert">{error}</p>}<button className="button full" disabled={saving} type="submit">{saving ? 'Guardando…' : 'Probar la reserva'}</button></form></>}
    {stage === 'hecho' && <div className="booking-success"><div className="success-mark"><Check size={32} /></div><h2 id="booking-title">ASÍ DA<br />GUSTO.</h2><p>Tu reserva de prueba está guardada.</p><div className="booking-summary"><strong>{name}</strong><span>{dateLabel(date)} / {time} h</span><span>{people} {people === 1 ? 'persona' : 'personas'}</span><small>Referencia {reference}</small></div><p className="demo-note">Es una simulación: no tienes una mesa reservada ni hemos enviado un correo.</p><button className="button full" onClick={close}>Listo, volver al bar</button></div>}
  </div></dialog>;
}

