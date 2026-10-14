'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { combinations, DURATION, futureSlot, minutes, Reservation, Service, Status, serviceAvailable, TIMES } from '../lib/domain';

export type DemoReservation = Reservation & { version: number };
export type DemoMutation =
  | { action: 'status'; status: Status }
  | { action: 'table'; table: number }
  | { action: 'edit'; date: string; time: string; service: Service; people: number; name: string; phone: string; notes: string }
  | { action: 'delete' };

type NewDemoReservation = Pick<Reservation, 'date' | 'time' | 'service' | 'people' | 'name' | 'phone' | 'notes'>;
type DemoApi = {
  reservations: DemoReservation[];
  availableSlots: (date: string, service: Service, people: number) => { time: string; available: boolean }[];
  createReservation: (input: NewDemoReservation) => DemoReservation;
  mutateReservation: (id: string, mutation: DemoMutation) => void;
  clear: () => void;
};

type DemoMessage =
  | { type: 'request-snapshot'; from: string }
  | { type: 'snapshot'; from: string; to: string; reservations: DemoReservation[] }
  | { type: 'upsert'; from: string; reservation: DemoReservation }
  | { type: 'remove'; from: string; id: string }
  | { type: 'clear'; from: string };

const channelName = 'afilao-presentation-demo-v1';
const emptyApi: DemoApi = {
  reservations: [],
  availableSlots: () => [],
  createReservation: () => { throw new Error('La simulación solo está disponible en la presentación.'); },
  mutateReservation: () => { throw new Error('La simulación solo está disponible en la presentación.'); },
  clear: () => undefined,
};
const DemoContext = createContext<DemoApi>(emptyApi);

function usedTables(reservations: DemoReservation[], date: string, time: string, exceptId = '') {
  const start = minutes(time);
  return new Set(reservations
    .filter(r => r.id !== exceptId && r.date === date && ['confirmada', 'sentada'].includes(r.status))
    .filter(r => minutes(r.time) < start + DURATION && minutes(r.time) + DURATION > start)
    .flatMap(r => r.tables));
}

function mergeSnapshot(current: DemoReservation[], incoming: DemoReservation[]) {
  const merged = new Map(current.map(r => [r.id, r]));
  for (const row of incoming) {
    const previous = merged.get(row.id);
    if (!previous || row.version >= previous.version) merged.set(row.id, row);
  }
  return Array.from(merged.values());
}

export function PresentationDemoProvider({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const [reservations, setReservations] = useState<DemoReservation[]>([]);
  const reservationsRef = useRef(reservations);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const tabId = useRef('');

  useEffect(() => { reservationsRef.current = reservations; }, [reservations]);

  useEffect(() => {
    if (!enabled || typeof BroadcastChannel === 'undefined') return;
    tabId.current = crypto.randomUUID();
    const channel = new BroadcastChannel(channelName);
    channelRef.current = channel;
    channel.onmessage = (event: MessageEvent<DemoMessage>) => {
      const message = event.data;
      if (!message || message.from === tabId.current) return;
      if (message.type === 'request-snapshot') {
        channel.postMessage({ type: 'snapshot', from: tabId.current, to: message.from, reservations: reservationsRef.current } satisfies DemoMessage);
      } else if (message.type === 'snapshot' && message.to === tabId.current) {
        setReservations(current => mergeSnapshot(current, message.reservations));
      } else if (message.type === 'upsert') {
        setReservations(current => mergeSnapshot(current, [message.reservation]));
      } else if (message.type === 'remove') {
        setReservations(current => current.filter(r => r.id !== message.id));
      } else if (message.type === 'clear') {
        setReservations([]);
      }
    };
    channel.postMessage({ type: 'request-snapshot', from: tabId.current } satisfies DemoMessage);
    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [enabled]);

  const availableSlots = useCallback((date: string, service: Service, people: number) => {
    if (!serviceAvailable(date, service)) return [];
    return TIMES[service].map(time => ({
      time,
      available: futureSlot(date, time) && Boolean(combinations(people, usedTables(reservations, date, time))),
    }));
  }, [reservations]);

  const createReservation = useCallback((input: NewDemoReservation) => {
    if (!serviceAvailable(input.date, input.service) || !TIMES[input.service].includes(input.time) || !futureSlot(input.date, input.time)) {
      throw new Error('Esa fecha u hora no está disponible en esta simulación.');
    }
    const tables = combinations(input.people, usedTables(reservations, input.date, input.time));
    if (!tables) throw new Error('Ya no quedan mesas para esa hora en esta simulación. Prueba otra hora.');
    const row: DemoReservation = {
      ...input,
      id: crypto.randomUUID(),
      status: 'confirmada',
      tables,
      created_at: new Date().toISOString(),
      version: 0,
    };
    setReservations(current => [...current, row]);
    channelRef.current?.postMessage({ type: 'upsert', from: tabId.current, reservation: row } satisfies DemoMessage);
    return row;
  }, [reservations]);

  const mutateReservation = useCallback((id: string, mutation: DemoMutation) => {
    const current = reservations.find(r => r.id === id);
    if (!current) throw new Error('No encontramos esa reserva de prueba.');
    if ('action' in mutation && mutation.action === 'delete') {
      setReservations(rows => rows.filter(r => r.id !== id));
      channelRef.current?.postMessage({ type: 'remove', from: tabId.current, id } satisfies DemoMessage);
      return;
    }

    let updated: DemoReservation;
    if (mutation.action === 'status') {
      updated = { ...current, status: mutation.status, version: current.version + 1 };
    } else if (mutation.action === 'table') {
      const available = combinations(current.people, usedTables(reservations, current.date, current.time, id), mutation.table);
      if (!available || available[0] !== mutation.table) throw new Error('Esa mesa ya está ocupada o no sirve para esta reserva.');
      updated = { ...current, tables: available, version: current.version + 1 };
    } else {
      const { date, time, service, people, name, phone, notes } = mutation;
      if (!serviceAvailable(date, service) || !TIMES[service].includes(time) || !futureSlot(date, time)) throw new Error('Revisa la fecha y la hora de la reserva.');
      const available = combinations(people, usedTables(reservations, date, time, id), current.tables[0]);
      if (!available) throw new Error('No hay mesas libres para esos datos en esta simulación.');
      updated = { ...current, date, time, service, people, name, phone, notes, tables: available, version: current.version + 1 };
    }
    setReservations(rows => rows.map(r => r.id === id ? updated : r));
    channelRef.current?.postMessage({ type: 'upsert', from: tabId.current, reservation: updated } satisfies DemoMessage);
  }, [reservations]);

  const clear = useCallback(() => {
    setReservations([]);
    channelRef.current?.postMessage({ type: 'clear', from: tabId.current } satisfies DemoMessage);
  }, []);

  const value = useMemo(() => ({ reservations, availableSlots, createReservation, mutateReservation, clear }), [reservations, availableSlots, createReservation, mutateReservation, clear]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function usePresentationDemo() { return useContext(DemoContext); }
