import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LegalFooter from './legal-footer';

type LegalKind = 'aviso' | 'privacidad' | 'cookies';

const headings: Record<LegalKind, { eyebrow: string; title: string; intro: string }> = {
  aviso: { eyebrow: 'AFILAO · INFORMACIÓN', title: 'Aviso legal', intro: 'Información sobre el titular y las condiciones de uso de esta web.' },
  privacidad: { eyebrow: 'AFILAO · TUS DATOS', title: 'Política de privacidad', intro: 'Qué datos se usan en esta versión de prueba y con qué finalidad.' },
  cookies: { eyebrow: 'AFILAO · TU NAVEGACIÓN', title: 'Política de cookies', intro: 'Información sobre cookies y servicios externos de esta web.' },
};

function PendingOwnerDetails() {
  return <div className="legal-pending" role="note">
    <strong>Información pendiente del titular</strong>
    <p>La razón social o nombre completo del titular, su NIF y un correo electrónico de contacto no constan en los datos facilitados para esta web. Hay que incorporarlos antes de la publicación definitiva o de activar reservas reales.</p>
  </div>;
}

function LegalContent({ kind }: { kind: LegalKind }) {
  if (kind === 'aviso') return <>
    <section><h2>1. Titular de la web</h2><p>El sitio identifica la actividad con el nombre AFILAO. El establecimiento indicado está en C. los Martínez de Escobar, 16, 35007 Las Palmas de Gran Canaria, Las Palmas.</p><PendingOwnerDetails /><p>La información exigida para identificar plenamente al titular y permitir un contacto directo y efectivo debe completarse con sus datos reales. No se publica aquí un teléfono, NIF, razón social ni correo que no hayan sido confirmados.</p></section>
    <section><h2>2. Finalidad y uso</h2><p>Esta web presenta AFILAO, su ubicación, horario, fotografías y carta. La función de reservas está en pruebas: no confirma una mesa real, no avisa al establecimiento y no debe utilizarse para enviar datos personales reales.</p></section>
    <section><h2>3. Propiedad intelectual</h2><p>Los textos, fotografías, marca y demás materiales de AFILAO pertenecen a sus respectivos titulares. No se permite su reutilización fuera de los límites legales sin autorización de quien tenga los derechos.</p></section>
    <section><h2>4. Enlaces externos</h2><p>La web enlaza a Google Maps y a Instagram. Al abrir esos servicios, el usuario pasa a navegar bajo las condiciones y políticas de sus respectivos proveedores.</p></section>
    <section><h2>5. Legislación y contacto</h2><p>El uso del sitio se rige por la normativa española aplicable. Para ejercer derechos o plantear una consulta sobre esta web, debe facilitarse un contacto directo del titular; ese dato está pendiente de confirmar.</p></section>
  </>;

  if (kind === 'privacidad') return <>
    <section><h2>1. Responsable</h2><p>La actividad se presenta bajo el nombre AFILAO y la dirección C. los Martínez de Escobar, 16, 35007 Las Palmas de Gran Canaria, Las Palmas.</p><PendingOwnerDetails /><p>El responsable del tratamiento debe completar su identidad legal y un medio directo de contacto antes de usar esta web para gestionar reservas reales.</p></section>
    <section><h2>2. Datos y finalidad en la demo</h2><p>La web está en pruebas y no recibe reservas reales. Si se completa el formulario de simulación, se pueden introducir nombre, fecha, hora, número de personas, teléfono opcional y notas opcionales. En la demo pública, esos datos se mantienen temporalmente en la memoria de las pestañas abiertas para mostrar el recorrido; no se envían al bar ni se usan para enviar mensajes. No introduzcas datos personales reales.</p></section>
    <section><h2>3. Conservación y servicios conectados</h2><p>La simulación no está destinada a gestionar datos de clientes ni a prestar un servicio de reserva. La demo no guarda el formulario en almacenamiento persistente del navegador y se vacía al cerrar la última pestaña que la mantiene abierta. La aplicación no incorpora analítica ni publicidad. Si se solicita cargar el mapa, el navegador se conecta con Google y transmite los datos técnicos necesarios para servirlo; consulta la <a href="https://policies.google.com/privacy?hl=es" target="_blank" rel="noopener noreferrer">política de privacidad de Google</a>.</p></section>
    <section><h2>4. Derechos</h2><p>La normativa de protección de datos reconoce derechos de acceso, rectificación, supresión, oposición, limitación y, cuando proceda, portabilidad. Para ejercerlos debe contactarse con el responsable. El correo o canal de contacto del titular está pendiente de facilitar. También se puede reclamar ante la <a href="https://www.aepd.es/" target="_blank" rel="noopener noreferrer">Agencia Española de Protección de Datos</a>.</p></section>
    <section><h2>5. Cambios y paso a producción</h2><p>Antes de activar reservas reales habrá que publicar la identidad y contacto del responsable, revisar los datos que se recojan, fijar sus plazos de conservación y actualizar esta política según el tratamiento que se configure.</p></section>
  </>;

  return <>
    <section><h2>1. Uso actual</h2><p>Esta web no usa cookies de analítica ni publicidad. La simulación de reservas conserva los datos temporalmente en memoria mientras están abiertas las pestañas; no utiliza cookies ni almacenamiento persistente para ese recorrido.</p></section>
    <section><h2>2. Mapa de Google</h2><p>El mapa no se conecta automáticamente. Solo se solicita cuando pulsas «Cargar mapa de Google». Al hacerlo, Google puede recibir tu dirección IP e información técnica del navegador y aplicar sus propias cookies o tecnologías. El tratamiento depende de Google y puedes consultar su <a href="https://policies.google.com/technologies/cookies?hl=es" target="_blank" rel="noopener noreferrer">política de cookies</a> y su <a href="https://policies.google.com/privacy?hl=es" target="_blank" rel="noopener noreferrer">política de privacidad</a>.</p><p>También puedes abrir la ubicación directamente en Google Maps desde el enlace de dirección sin cargar el mapa incrustado en esta página.</p></section>
    <section><h2>3. Cambios futuros</h2><p>Si se añaden cookies no esenciales u otros servicios de terceros, esta política deberá actualizarse y se solicitará la elección que corresponda antes de activarlos.</p></section>
  </>;
}

export default function LegalPage({ kind }: { kind: LegalKind }) {
  const content = headings[kind];
  return <main className="legal-page">
    <header className="legal-header"><Link href="/" aria-label="Volver a AFILAO"><img src="/assets/logo.webp" width="228" height="43" alt="AFILAO" /></Link><Link className="legal-back" href="/"><ArrowLeft size={18} /> Volver a la web</Link></header>
    <article className="legal-content"><p className="section-eyebrow">{content.eyebrow}</p><h1>{content.title}</h1><p className="legal-intro">{content.intro}</p><LegalContent kind={kind} /><p className="legal-updated">Última actualización: 15 de octubre de 2026.</p></article>
    <LegalFooter />
  </main>;
}
