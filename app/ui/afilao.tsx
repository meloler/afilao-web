'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowDownRight, ArrowUpRight, CalendarDays, AtSign as Instagram, MapPin, Utensils } from 'lucide-react';
const loadBooking = () => import('./booking');
const Booking = dynamic(loadBooking, { ssr: false, loading: () => <p className="booking-loading" role="status">Abriendo reservas…</p> });
const PhotoCarousel = dynamic(() => import('./photo-carousel'), {
  ssr: false,
  loading: () => <div className="afilao-carousel-loading" aria-hidden="true" />,
});
const dishes = [
  ['para-abrir-boca', 'Para abrir boca', [['Gilda clásica de anchoa', 2.9], ['Gilda matrimonio anchoa y boquerón', 3.5], ['Brioche de anchoa y queso Idiazabal', 4], ['Cecina de vaca 50 gr', 9]]],
  ['fresco', 'Fresco, fresco', [['Ensaladilla de bonito', 10], ['Tomates aliñados, salmorejo y burrata', 10]]],
  ['los-que-vuelven', 'De los que vuelven', [['Croqueta de cecina', 2.8], ['Croqueta de pescado', 2.5], ['Papas mojo bravas', 9], ['Tortilla de papa', 10], ['Tortilla de papa con callos y morros', 14]]],
  ['cocina', 'Aquí hay cocina', [['Guiso de callos y morros', 14], ['Alcachofas a la plancha', 12], ['Albóndigas en salsa', 14], ['Entrecot madurado, piquillos y papas', 28]]],
  ['postres', 'Algo dulce', [['Requesón con membrillo', 6], ['Tejas con helado de vainilla', 6]]],
] as const;
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
          <a className="entry-action" href="#carta">Ver la carta<ArrowDownRight size={27} aria-hidden="true" /></a>
        </nav>
      </div>
      <div className="entry-details">
        <dl className="entry-hours" aria-label="Horario"><div><dt>Miércoles a sábado</dt><dd>13:30–00:00</dd></div><div><dt>Domingos</dt><dd>13:30–18:00</dd></div></dl>
        <p className="entry-closed">Lunes y martes descansamos.</p>
        <a className="entry-social" href="https://www.instagram.com/afilao.bar/" target="_blank" rel="noopener noreferrer" aria-label="@afilao.bar en Instagram (abre en otra pestaña)"><Instagram size={18} aria-hidden="true" />@afilao.bar<ArrowUpRight size={16} aria-hidden="true" /></a>
        <a className="entry-address" href={mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="C. los Martínez de Escobar, 16, 35007 Las Palmas de Gran Canaria, Las Palmas. Abrir Google Maps en otra pestaña"><MapPin size={18} aria-hidden="true" /><span>C. los Martínez de Escobar, 16<br />35007 Las Palmas de Gran Canaria, Las Palmas</span><ArrowUpRight size={16} aria-hidden="true" /></a>
        <a className="entry-discover" href="#tapeo">Sigue el tapeo <ArrowDownRight size={16} aria-hidden="true" /></a>
      </div>
    </section></div>
    <section id="tapeo" ref={photosRef} className="food-section" tabIndex={-1} aria-labelledby="food-title"><div className="food-title"><h2 id="food-title">POCO CUENTO.<br />MUCHO TAPEO.</h2><p>Una gilda, otra ronda.<br />Y ya que estamos, algo de comer.</p></div>{showPhotos ? <PhotoCarousel /> : <div className="afilao-carousel-loading" aria-hidden="true" />}</section>
    <section className="menu-section" id="carta" aria-labelledby="menu-title" tabIndex={-1}>
      <div className="menu-heading"><h2 id="menu-title">LA CARTA.</h2><p>Para picar. Para compartir. Para repetir.</p></div>
      <nav className="menu-shortcuts" aria-label="Categorías de la carta">
        {dishes.map(([id, group]) => <a href={`#carta-${id}`} key={id}>{group}</a>)}
      </nav>
      <div className="menu-groups">
        {dishes.map(([id, group, items]) => (
          <section className="menu-group" id={`carta-${id}`} aria-labelledby={`carta-${id}-title`} tabIndex={-1} key={id}>
            <h3 id={`carta-${id}-title`}>{group}</h3>
            <dl>{items.map(([name, price]) => <div key={name}><dt>{name}</dt><dd>{price.toFixed(2).replace('.', "'")}<span>€</span></dd></div>)}</dl>
          </section>
        ))}
      </div>
      <div className="menu-foot"><p>Precios de la carta facilitada por el local.</p></div>
    </section>
  </main><footer className="site-footer"><img src="/assets/logo.webp" width="228" height="43" alt="AFILAO" /><p>Bar. Tapeo. Sin pretensiones.</p></footer><nav className="mobile-dock" aria-label="Reserva y carta" hidden={!showDock || booking}><button onPointerEnter={() => { void loadBooking(); }} onFocus={() => { void loadBooking(); }} onClick={openBooking}><CalendarDays size={20} /> Reservar mesa</button><a href="#carta"><Utensils size={20} />Carta</a></nav>{booking && <Booking open close={closeBooking} previewOnly={previewOnly} />}</>;
}


