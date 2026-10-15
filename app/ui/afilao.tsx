'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, Clock3, MapPin, Utensils } from 'lucide-react';
import LegalFooter from './legal-footer';
import MapEmbed from './map-embed';
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
  const entryStageRef = useRef<HTMLDivElement>(null);
  const entryActionsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const actions = entryActionsRef.current;
    if (!actions) return;
    const observer = new IntersectionObserver(([observed]) => {
      setShowDock(!observed.isIntersecting);
    });
    observer.observe(actions);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const stage = entryStageRef.current;
    const entry = entryRef.current;
    if (!stage || !entry) return;
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const stageBottom = stage.getBoundingClientRect().bottom;
      const exitDistance = Math.max(1, stage.offsetHeight - entry.offsetHeight);
      const progress = Math.max(0, Math.min(1, (window.innerHeight - stageBottom) / exitDistance));
      entry.style.setProperty('--cover-opacity', String(1 - progress));
      entry.style.setProperty('--cover-blur', `${progress * 10}px`);
      entry.style.setProperty('--cover-shift', `${progress * -12}px`);
      entry.style.setProperty('--cover-scale', String(1 - progress * .04));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
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
    <div className="entry-stage" ref={entryStageRef}><section className="entry" ref={entryRef} aria-labelledby="entry-title">
      <p className="entry-tagline">BAR. TAPEO. SIN PRETENSIONES.</p>
      <div className="entry-center">
        <h1 className="entry-brand" id="entry-title"><span className="entry-mark" aria-hidden="true" /><span className="entry-hidden">Afilao, bar y tapeo en Las Palmas</span></h1>
        <nav className="entry-actions" ref={entryActionsRef} aria-label="Reservas y carta">
          <button className="entry-action entry-action--reserve" type="button" onPointerEnter={() => { void loadBooking(); }} onFocus={() => { void loadBooking(); }} onClick={openBooking}>Reservar mesa<ArrowUpRight size={27} aria-hidden="true" /></button>
          <Link className="entry-action" href="/carta">Ver la carta<ArrowUpRight size={27} aria-hidden="true" /></Link>
        </nav>
        <div className="entry-details">
          <dl className="entry-hours" aria-label="Horario"><div><dt>Miércoles a sábado</dt><dd>13:30–00:00</dd></div><div><dt>Domingos</dt><dd>13:30–18:00</dd></div></dl>
          <p className="entry-closed">Lunes y martes cerrado</p>
          <a className="entry-address" href={mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={16} aria-hidden="true" /><span>C. los Martínez de Escobar, 16,<br />35007 Las Palmas de Gran Canaria, Las Palmas</span><ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </div>
      <a className="entry-social" href="https://www.instagram.com/afilao.bar/" target="_blank" rel="noopener noreferrer" aria-label="@afilao.bar en Instagram (abre en otra pestaña)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>@afilao.bar<ArrowUpRight size={16} aria-hidden="true" /></a>
    </section></div>
    <section className="about-section" aria-labelledby="about-title">
      <div className="about-copy">
        <p className="section-eyebrow">UN POCO DE NOSOTROS</p>
        <h2 id="about-title">AFILAO, un bar sin más.<br /><span>Y sin menos.</span></h2>
        <p>Nos gustan las cosas de siempre cuando están bien hechas: una gilda que abre el apetito, una caña fría, una buena tortilla, croquetas, ensaladilla, vinos, vermut y platos para poner en medio y discutir quién se queda con el último bocado.</p>
        <p className="about-emphasis">No hemos venido a inventar el bar.<br />Hemos venido a hacer uno al que apetezca volver.</p>
        <p>Cocina reconocible, alguna que otra vuelta de tuerca y una barra donde venir sin demasiados planes. Porque AFILAO va un poco de eso: sentarte para una rápida y acabar quedándote bastante más de la cuenta.</p>
      </div>
      <div className="about-gallery" aria-label="El equipo y la cocina de Afilao">
        <figure className="about-team"><img src="/assets/nosotros-equipo.webp" width="1440" height="960" alt="El equipo de Afilao trabajando junto al pase de cocina" loading="lazy" decoding="async" /><figcaption>Lo de siempre, hecho con ganas.</figcaption></figure>
        <figure><img src="/assets/nosotros-tortilla.webp" width="950" height="713" alt="Tortilla de papa recién hecha, lista para compartir" loading="lazy" decoding="async" /><figcaption>Para poner en medio.</figcaption></figure>
        <figure><img src="/assets/nosotros-postre.webp" width="950" height="713" alt="Un postre de la casa para alargar la sobremesa" loading="lazy" decoding="async" /><figcaption>Y quedarse un rato más.</figcaption></figure>
      </div>
    </section>
    <section id="tapeo" ref={photosRef} className="food-section" tabIndex={-1} aria-labelledby="food-title"><div className="food-title"><p className="section-eyebrow">MESA, BARRA Y SOBREMESA</p><h2 id="food-title">UNA GILDA.<br />Y OTRA RONDA.</h2><p>De la barra a los platos para compartir. Desliza y mira.</p></div>{showPhotos ? <PhotoCarousel /> : <div className="afilao-carousel-loading" aria-hidden="true" />}</section>
    <section className="back-cover" aria-labelledby="back-cover-title">
      <div className="back-cover-copy"><p className="section-eyebrow">NOS VEMOS EN LA BARRA</p><h2 id="back-cover-title">Una rápida.<br />Ya si eso.</h2><p className="back-cover-address">C/ Los Martínez de Escobar, 16.<br />El resto, mejor venir a comprobarlo.</p><dl className="back-cover-hours"><div><dt><Clock3 size={18} />Miércoles a sábado</dt><dd>13:30–00:00</dd></div><div><dt><Clock3 size={18} />Domingos</dt><dd>13:30–18:00</dd></div><div><dt>Días de descanso</dt><dd>Lunes y martes</dd></div></dl><a className="back-cover-link" href={mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={20} />Abrir en Google Maps<ArrowUpRight size={17} /></a><a className="back-cover-instagram" href="https://www.instagram.com/afilao.bar/" target="_blank" rel="noopener noreferrer">Instagram · @afilao.bar<ArrowUpRight size={16} /></a></div>
      <MapEmbed />
    </section>
  </main><footer className="site-footer"><div className="site-footer-head"><img src="/assets/logo.webp" width="228" height="43" alt="AFILAO" /><p>Bar. Tapeo. Sin pretensiones.</p><Link href="/carta">Ver la carta<ArrowUpRight size={15} /></Link></div><LegalFooter className="site-footer-legal" /></footer><nav className="mobile-dock" aria-label="Acceso rápido a reserva y carta" hidden={!showDock || booking}><button onPointerEnter={() => { void loadBooking(); }} onFocus={() => { void loadBooking(); }} onClick={openBooking}><CalendarDays size={20} /> Reservar mesa</button><Link href="/carta"><Utensils size={20} />Ver la carta</Link></nav>{booking && <Booking open close={closeBooking} previewOnly={previewOnly} />}</>;
}


