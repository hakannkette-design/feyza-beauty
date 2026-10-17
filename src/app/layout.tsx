import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Feyza Nur | Dükkan",
  manifest: "/manifest.json",
  themeColor: "#d4af37",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr"><head><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap" rel="stylesheet" /></head><body>{children}</body></html>
  );
}