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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`light scroll-smooth ${inter.variable}`} style={{ scrollPaddingTop: "80px" }}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="bg-background-light dark:bg-background-dark font-display text-text-dark dark:text-text-light antialiased overflow-x-hidden min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
