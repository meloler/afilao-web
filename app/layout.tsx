import type { Metadata } from "next";
import "./globals.css";
import "./afilao-carousel.css";
import "./afilao-entry.css";
import "./afilao-menu.css";
import "./afilao-legal.css";
import { PresentationDemoProvider } from './ui/presentation-demo';

export const metadata: Metadata = {
  title: "Afilao | Bar, tapeo y reservas en Las Palmas",
  description: "Vermut, gildas y tapeo sin pretensiones. La carta y tu mesa en Afilao, Las Palmas de Gran Canaria.",
  robots: { index: false, follow: false },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <PresentationDemoProvider enabled={process.env.AFILAO_PRESENTATION_DEMO === '1' && process.env.VERCEL_ENV === 'preview'}>
          {children}
        </PresentationDemoProvider>
      </body>
    </html>
  );
}
