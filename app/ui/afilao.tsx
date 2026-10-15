'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, CalendarDays, MapPin, Utensils } from 'lucide-react';
const loadBooking = () => import('./booking');
const Booking = dynamic(loadBooking, { ssr: false, loading: () => <p className="booking-loading" role="status">Abriendo reservas…</p> });
const PhotoCarousel = dynamic(() => import('./photo-carousel'), {
  ssr: false,
  loading: () => <div className="afilao-carousel-loading" aria-hidden="true" />,
});
const mapsUrl = 'https://www.google.com/maps/place//data=!4m2!3m1!1s0xc40956b3c628299:0xd816de221f6104b7';
export default function Afilao({ previewOnly = false }: { previewOnly?: boolean }) {
  const [booking, setBooking] = useState(false);
  const [showDock, setShowDock] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const photosRef = useRef<HTMLElement>(null);
  const bookingTrigger = useRef<HTMLElement | null>(null);
  const openBooking = () => { bookingTrigger.current = document.activeElement as HTMLElement; setBooking(true); };
  const closeBooking = () => { setBooking(false); requestAnimationFrame(() => bookingTrigger.current?.focus({ preventScroll: true })); };
  const entryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const entry = entryRef.current;
    if (!entry) return;
    const observer = new IntersectionObserver(([observed]) => {
      setShowDock(!observed.isIntersecting);
    });
    observer.observe(entry);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = photosRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShowPhotos(true); observer.disconnect(); }
    }, { rootMargin: '200px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return <><a className="skip-link" href="#principal">Ir al contenido</a><div className="preview-note">{previewOnly ? 'Demo interactiva. No se envían reservas al bar.' : 'Web en pruebas. No admite reservas reales.'}</div><main id="principal">
    <div className="entry-stage"><section className="entry" ref={entryRef} aria-labelledby="entry-title">
      <p className="entry-tagline">BAR. TAPEO. SIN PRETENSIONES.</p>
      <div className="entry-center">
        <h1 className="entry-brand" id="entry-title"><span className="entry-mark" aria-hidden="true" /><span className="entry-hidden">Afilao, bar y tapeo en Las Palmas</span></h1>
        <nav className="entry-actions" aria-label="Reservas y carta">
          <button className="entry-action entry-action--reserve" type="button" onPointerEnter={() => { void loadBooking(); }} onFocus={() => { void loadBooking(); }} onClick={openBooking}>Reservar mesa<ArrowUpRight size={27} aria-hidden="true" /></button>
          <Link className="entry-action" href="/carta">Ver la carta<ArrowUpRight size={27} aria-hidden="true" /></Link>
        </nav>
        <a className="entry-social" href="https://www.instagram.com/afilao.bar/" target="_blank" rel="noopener noreferrer" aria-label="@afilao.bar en Instagram (abre en otra pestaña)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>@afilao.bar<ArrowUpRight size={16} aria-hidden="true" /></a>
      </div>
      <div className="entry-details">
        <dl className="entry-hours" aria-label="Horario"><div><dt>Miércoles a sábado</dt><dd>13:30–00:00</dd></div><div><dt>Domingos</dt><dd>13:30–18:00</dd></div></dl>
        <p className="entry-closed">Lunes y martes descansamos.</p>

        <a className="entry-address" href={mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="C. los Martínez de Escobar, 16, 35007 Las Palmas de Gran Canaria, Las Palmas. Abrir Google Maps en otra pestaña"><MapPin size={18} aria-hidden="true" /><span>C. los Martínez de Escobar, 16<br />35007 Las Palmas de Gran Canaria, Las Palmas</span><ArrowUpRight size={16} aria-hidden="true" /></a>
        <a className="entry-discover" href="#tapeo">Sigue el tapeo <ArrowDownRight size={16} aria-hidden="true" /></a>
      </div>
    </section></div>
    <section id="tapeo" ref={photosRef} className="food-section" tabIndex={-1} aria-labelledby="food-title"><div className="food-title"><h2 id="food-title">POCO CUENTO.<br />MUCHO TAPEO.</h2><p>Una gilda, otra ronda.<br />Y ya que estamos, algo de comer.</p></div>{showPhotos ? <PhotoCarousel /> : <div className="afilao-carousel-loading" aria-hidden="true" />}</section>
  </main><footer className="site-footer"><img src="/assets/logo.webp" width="228" height="43" alt="AFILAO" /><p>Bar. Tapeo. Sin pretensiones.</p></footer><nav className="mobile-dock" aria-label="Reserva y carta" hidden={!showDock || booking}><button onPointerEnter={() => { void loadBooking(); }} onFocus={() => { void loadBooking(); }} onClick={openBooking}><CalendarDays size={20} /> Reservar mesa</button><Link href="/carta"><Utensils size={20} />Carta</Link></nav>{booking && <Booking open close={closeBooking} previewOnly={previewOnly} />}</>;
}


