import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://immodelo.fr"),
  title: {
    default: "Immodelo - Estimation immobilière au Mans",
    template: "%s | Immodelo",
  },
  description:
    "Obtenez rapidement l\u2019estimation de votre bien immobilier au Mans gr\u00e2ce à Immodelo.",
  keywords: [
    "estimation immobilière",
    "Le Mans",
    "agence immobilière",
    "maison",
  ],
  openGraph: {
    title: "Immodelo - Estimation immobilière au Mans",
    description:
      "Expertise locale pour estimer et vendre votre bien au Mans et en périphérie.",
    url: "https://immodelo.fr",
    siteName: "Immodelo",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Immodelo - Estimation immobilière au Mans",
    description:
      "Obtenez rapidement l\u2019estimation de votre bien immobilier au Mans gr\u00e2ce à Immodelo.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  alternates: {
    canonical: "/",
  },
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#content"
          className="sr-only focus:not-sr-only absolute top-2 left-2 z-50 rounded bg-white p-2 text-sm text-gray-800 shadow"
        >
          Aller au contenu principal
        </a>
        <main id="content" className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
