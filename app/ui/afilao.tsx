'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowDownRight, ArrowUpRight, CalendarDays, AtSign as Instagram, MapPin, Utensils } from 'lucide-react';
import Booking from './booking';
const PhotoCarousel = dynamic(() => import('./photo-carousel'), {
  ssr: false,
  loading: () => <div className="afilao-carousel-loading" aria-hidden="true" />,
});
const dishes = [
  ['para-abrir-boca', 'Para abrir boca', [['Gilda clásica de anchoa', '2,80'], ['Gilda matrimonio anchoa y boquerón', '3'], ['Brioche de anchoa y queso Idiazabal', '4'], ['Tabla de quesos canarios', '9'], ['Cecina de vaca 100 gr', '9']]],
  ['fresco', 'Fresco, fresco', [['Ensaladilla de bonito', '8'], ['Tomates aliñados, salmorejo y burrata', '10']]],
  ['los-que-vuelven', 'De los que vuelven', [['Croqueta de cecina', '2,50'], ['Croqueta de pescado', '2,50'], ['Papas mojo bravas', '8'], ['Tortilla de papa', '9'], ['Tortilla de papa con callos y morros', '14']]],
  ['cocina', 'Aquí hay cocina', [['Guiso de callos y morros', '12'], ['Alcachofas a la plancha', '12'], ['Zarajos con mojo rojo', '12'], ['Albóndigas en salsa', '12'], ['Entrecot madurado, piquillos y papas', '24']]],
] as const;
export default function Afilao({ previewOnly = false }: { previewOnly?: boolean }) {
  const [booking, setBooking] = useState(false);
  const [showDock, setShowDock] = useState(false);
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

  return <><a className="skip-link" href="#principal">Ir al contenido</a><div className="preview-note">{previewOnly ? 'Demo interactiva. No se envían reservas al bar.' : 'Web en pruebas. No admite reservas reales.'}</div><main id="principal">
    <section className="entry" ref={entryRef} aria-labelledby="entry-title">
      <p className="entry-tagline">BAR. TAPEO. SIN PRETENSIONES.</p>
      <div className="entry-center">
        <h1 className="entry-brand" id="entry-title"><span className="entry-mark" aria-hidden="true" /><span className="entry-hidden">Afilao, bar y tapeo en Las Palmas</span></h1>
        <nav className="entry-actions" aria-label="Reservas y carta">
          <button className="entry-action entry-action--reserve" type="button" onClick={() => setBooking(true)}>Reservar mesa<ArrowUpRight size={27} aria-hidden="true" /></button>
          <a className="entry-action" href="#carta">Ver la carta<ArrowDownRight size={27} aria-hidden="true" /></a>
        </nav>
      </div>
      <p className="entry-location">LAS PALMAS DE GRAN CANARIA</p>
    </section>
    <section className="food-section" aria-labelledby="food-title"><div className="food-title"><h2 id="food-title">POCO CUENTO.<br />MUCHO TAPEO.</h2><p>Una gilda, otra ronda.<br />Y ya que estamos, algo de comer.</p></div><PhotoCarousel /></section>
    <section className="menu-section" id="carta" aria-labelledby="menu-title" tabIndex={-1}>
      <div className="menu-heading"><h2 id="menu-title">LA CARTA.</h2><p>Para picar. Para compartir. Para repetir.</p></div>
      <nav className="menu-shortcuts" aria-label="Categorías de la carta">
        {dishes.map(([id, group]) => <a href={`#carta-${id}`} key={id}>{group}</a>)}
      </nav>
      <div className="menu-groups">
        {dishes.map(([id, group, items]) => (
          <section className="menu-group" id={`carta-${id}`} aria-labelledby={`carta-${id}-title`} tabIndex={-1} key={id}>
            <h3 id={`carta-${id}-title`}>{group}</h3>
            <dl>{items.map(([name, price]) => <div key={name}><dt>{name}</dt><dd>{price}<span> €</span></dd></div>)}</dl>
          </section>
        ))}
      </div>
      <div className="menu-foot"><a href="/assets/carta.webp" target="_blank" rel="noreferrer" className="text-link">Ver la carta original</a><p>Precios de la carta facilitada por el local.</p></div>
    </section>
    <section className="bar-section" aria-labelledby="bar-title"><div className="bar-copy"><h2 id="bar-title">TU PRÓXIMO<br />«UNA Y PA CASA».</h2><p>El más afilao del barrio.<br />De miércoles a domingo. Con y sin reserva.</p><dl className="opening-hours"><div><dt>Miércoles a sábado</dt><dd>13:30 a 00:00</dd></div><div><dt>Domingos</dt><dd>13:30 a 18:00</dd></div></dl><a className="location-link" href="https://share.google/JZ3DVxkvwo0PcfZZr" target="_blank" rel="noreferrer"><MapPin size={22} /><span>Cómo llegar<br /><small>Las Palmas de Gran Canaria</small></span></a><a className="location-link" href="https://www.instagram.com/afilao.bar/" target="_blank" rel="noreferrer"><Instagram size={22} /><span>@afilao.bar<br /><small>Lo que se cuece, en Instagram.</small></span></a></div></section>
  </main><footer className="site-footer"><img src="/assets/logo.webp" width="228" height="43" alt="AFILAO" /><p>Bar. Tapeo. Sin pretensiones.</p></footer><nav className="mobile-dock" aria-label="Reserva y carta" hidden={!showDock || booking}><button onClick={() => setBooking(true)}><CalendarDays size={20} /> Reservar mesa</button><a href="#carta"><Utensils size={20} />Carta</a></nav><Booking key={booking ? 'open' : 'closed'} open={booking} close={() => setBooking(false)} previewOnly={previewOnly} /></>;
}


