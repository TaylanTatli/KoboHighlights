import { ThemeProvider } from "@/ThemeProvider";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "KoboHighlights",
  description:
    "KoboHighlights is a web application designed to extract and display highlights from the KoboReader.sqlite file.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
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
