import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgustinDev - Desarrollo Web y Soluciones Móviles",
  description: "Desarrollo de software a medida, aplicaciones web y móviles.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.svg", type: "image/svg+xml" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AgustinDev",
  },
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`scroll-smooth ${inter.variable}`} style={{ scrollPaddingTop: "80px" }}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
        {/* Explicit fallback tags for maximum browser compatibility */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AgustinDev" />
        <meta name="application-name" content="AgustinDev" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#4b00ad" />
      </head>
      <body className="bg-background-light dark:bg-background-dark font-display text-text-dark dark:text-text-light antialiased overflow-x-hidden min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
