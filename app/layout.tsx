import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atlas powieści",
  description: "Interaktywna mapa myśli do projektowania książek, trylogii, postaci i fabuł."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
