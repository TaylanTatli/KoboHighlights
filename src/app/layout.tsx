import { ThemeProvider } from "@/ThemeProvider";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://hylit.app'),
  title: {
    default: "Hylit | View & Export Kobo, Kindle, KoReader Highlights",
    template: "%s | Hylit",
  },
  description: "Hylit is a free tool designed to extract, view and export highlights from the Kobo (KoboReader.sqlite) and Kindle/KoReader (My Clippings.txt).",
  applicationName: "Hylit",
  authors: [{ name: "Taylan Tatlı" }],
  keywords: [
    "Kobo highlights",
    "Kindle highlights",
    "KoReader highlights",
    "book highlights",
    "highlight viewer",
    "highlight exporter",
    "KoboReader.sqlite",
    "My Clippings.txt",
    "reading notes",
    "book notes",
    "Notion export",
    "Hardcover export",
  ],
  creator: "Taylan Tatlı",
  publisher: "Taylan Tatlı",
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['tr_TR'],
    url: 'https://hylit.app',
    siteName: 'Hylit',
    title: "Hylit | View & Export Kobo, Kindle, KoReader Highlights",
    description: "Hylit is a free tool designed to extract, view and export highlights from the Kobo (KoboReader.sqlite) and Kindle/KoReader (My Clippings.txt).",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hylit - Kobo, Kindle & KoReader Highlight Viewer and Exporter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Hylit | View & Export Kobo, Kindle, KoReader Highlights",
    description: "Hylit is a free tool designed to extract, view and export highlights from the Kobo (KoboReader.sqlite) and Kindle/KoReader (My Clippings.txt).",
    creator: '@tatlitaylan',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://hylit.app',
  },
  category: 'utilities',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: {
      url: '/apple-icon.png',
      sizes: '180x180',
    },
    other: [
        {
          rel: 'icon',
          url: '/android-icon.png',
          sizes: '192x192',
        },
    ]
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="box-border" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <h1 className="sr-only">Hylit: View & Export Kobo, Kindle, KoReader Highlights</h1>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
        <Script
          defer
          src="/stats/script.js"
          data-website-id="ddd8d923-df01-4324-a3de-448de7658876"
        ></Script>
      </body>
    </html>
  );
}
