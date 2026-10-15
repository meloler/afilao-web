import Link from 'next/link';

const policies = [
  ['/privacidad', 'Política de privacidad'],
  ['/cookies', 'Política de cookies'],
  ['/aviso-legal', 'Aviso legal'],
] as const;

export default function LegalFooter({ className = '' }: { className?: string }) {
  return <div className={`legal-footer ${className}`.trim()}>
    <nav aria-label="Información legal">
      {policies.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}
    </nav>
    <p>© {new Date().getFullYear()} AFILAO. Todos los derechos reservados.</p>
  </div>;
}
