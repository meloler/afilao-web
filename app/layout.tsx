import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
