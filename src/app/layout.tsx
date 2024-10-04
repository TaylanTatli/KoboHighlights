import { ThemeProvider } from "@/ThemeProvider";
import type { Metadata } from "next";
import { ModeToggle } from "./components/DarkModeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "KoboHighlight",
  description: "Extract and display highlights from KoboReader.sqlite file",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="box-border" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ModeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
