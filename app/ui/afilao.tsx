'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CalendarDays, AtSign as Instagram, MapPin, Utensils } from 'lucide-react';
import Booking from './booking';
import PhotoCarousel from './photo-carousel';
const dishes = [
  ['Para abrir boca', [['Gilda clásica de anchoa', '2,80'], ['Gilda matrimonio anchoa y boquerón', '3'], ['Brioche de anchoa y queso Idiazabal', '4'], ['Tabla de quesos canarios', '9'], ['Cecina de vaca 100 gr', '9']]],
  ['Fresco, fresco', [['Ensaladilla de bonito', '8'], ['Tomates aliñados, salmorejo y burrata', '10']]],
  ['De los que vuelven', [['Croqueta de cecina', '2,50'], ['Croqueta de pescado', '2,50'], ['Papas mojo bravas', '8'], ['Tortilla de papa', '9'], ['Tortilla de papa con callos y morros', '14']]],
  ['Aquí hay cocina', [['Guiso de callos y morros', '12'], ['Alcachofas a la plancha', '12'], ['Zarajos con mojo rojo', '12'], ['Albóndigas en salsa', '12'], ['Entrecot madurado, piquillos y papas', '24']]],
] as const;
export default function Afilao() {
  const [booking, setBooking] = useState(false);
  return <><a className="skip-link" href="#principal">Ir al contenido</a><div className="preview-note">Web en pruebas. No admite reservas reales.</div><header className="site-header"><Link href="/" aria-label="Afilao, inicio"><img className="wordmark" src="/assets/logo.webp" width="228" height="43" alt="AFILAO" /></Link><nav aria-label="Principal"><a href="#carta">La carta</a><a href="https://www.instagram.com/afilao.bar/" target="_blank" rel="noreferrer" className="instagram-link" aria-label="Afilao en Instagram"><Instagram size={23} /></a><button className="header-book" onClick={() => setBooking(true)}>Reservar mesa</button></nav></header><main id="principal">
    <section className="hero" aria-labelledby="hero-title"><div className="hero-copy"><p className="condensed hero-kicker">BAR. TAPEO. SIN PRETENSIONES.</p><h1 id="hero-title">PORTARSE<br />REGULAR.</h1><p className="hero-description">Vermut, gildas y cosas bien hechas.<br />Tú pon la compañía.</p><div className="hero-actions"><button className="button" onClick={() => setBooking(true)}><CalendarDays size={21} /> Reservar mesa</button><a className="text-link" href="#carta">Antes, la carta</a></div><div className="hero-location"><MapPin size={17} /><span>Las Palmas de Gran Canaria</span></div></div></section>
    <section className="food-section" aria-labelledby="food-title"><div className="food-title"><h2 id="food-title">POCO CUENTO.<br />MUCHO TAPEO.</h2><p>Una gilda, otra ronda.<br />Y ya que estamos, algo de comer.</p></div><PhotoCarousel /></section>
    <section className="menu-section" id="carta" aria-labelledby="menu-title"><div className="menu-heading"><h2 id="menu-title">LA CARTA.</h2><p>Para picar. Para compartir. Para repetir.</p></div><div className="menu-groups">{dishes.map(([group, items]) => <div className="menu-group" key={group}><h3>{group}</h3><dl>{items.map(([name, price]) => <div key={name}><dt>{name}</dt><dd>{price}<span> €</span></dd></div>)}</dl></div>)}</div><div className="menu-foot"><a href="/assets/carta.webp" target="_blank" rel="noreferrer" className="text-link">Ver la carta original</a><p>Precios de la carta facilitada por el local.</p></div></section>
    <section className="bar-section" aria-labelledby="bar-title"><div className="bar-copy"><h2 id="bar-title">TU PRÓXIMO<br />«UNA Y PA CASA».</h2><p>El más afilao del barrio.<br />De miércoles a domingo. Con y sin reserva.</p><dl className="opening-hours"><div><dt>Miércoles a sábado</dt><dd>13:30 a 00:00</dd></div><div><dt>Domingos</dt><dd>13:30 a 18:00</dd></div></dl><a className="location-link" href="https://share.google/JZ3DVxkvwo0PcfZZr" target="_blank" rel="noreferrer"><MapPin size={22} /><span>Cómo llegar<br /><small>Las Palmas de Gran Canaria</small></span></a><a className="location-link" href="https://www.instagram.com/afilao.bar/" target="_blank" rel="noreferrer"><Instagram size={22} /><span>@afilao.bar<br /><small>Lo que se cuece, en Instagram.</small></span></a></div></section>
  </main><footer className="site-footer"><img src="/assets/logo.webp" width="228" height="43" alt="AFILAO" /><p>Bar. Tapeo. Sin pretensiones.</p></footer><nav className="mobile-dock" aria-label="Reserva y carta"><button onClick={() => setBooking(true)}><CalendarDays size={20} /> Reservar mesa</button><a href="#carta"><Utensils size={20} />Carta</a></nav><Booking open={booking} close={() => setBooking(false)} /></>;
}


