import Link from 'next/link';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Carta | Afilao' };
const dishes = [
  ['para-abrir-boca', 'Para abrir boca', [['Gilda clásica de anchoa', 2.9], ['Gilda matrimonio anchoa y boquerón', 3.5], ['Brioche de anchoa y queso Idiazabal', 4], ['Cecina de vaca 50 gr', 9]]],
  ['fresco', 'Fresco, fresco', [['Ensaladilla de bonito', 10], ['Tomates aliñados, salmorejo y burrata', 10]]],
  ['los-que-vuelven', 'De los que vuelven', [['Croqueta de cecina', 2.8], ['Croqueta de pescado', 2.5], ['Papas mojo bravas', 9], ['Tortilla de papa', 10], ['Tortilla de papa con callos y morros', 14]]],
  ['cocina', 'Aquí hay cocina', [['Guiso de callos y morros', 14], ['Alcachofas a la plancha', 12], ['Albóndigas en salsa', 14], ['Entrecot madurado, piquillos y papas', 28]]],
  ['postres', 'Algo dulce', [['Requesón con membrillo', 6], ['Tejas con helado de vainilla', 6]]],
] as const;
export default function MenuPage() {
  return <><header className="menu-page-header"><Link href="/">← Volver a Afilao</Link><span>BAR. TAPEO. SIN PRETENSIONES.</span></header><main>
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
</main><footer className="menu-page-footer"><Link href="/">Volver al bar</Link></footer></>;
}
