import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import "./globals.css";

// Brand fonts are self-hosted from the brand kit (SIL OFL, licenses in app/fonts).
const display = localFont({
  src: [
    { path: "./fonts/ArchivoExpanded-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/ArchivoExpanded-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const body = localFont({
  src: [
    { path: "./fonts/Archivo-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Archivo-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Archivo-SemiBold.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

const mono = localFont({
  src: [
    { path: "./fonts/PlexMono-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/PlexMono-SemiBold.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Real AI results, built on your data`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    images: ["/brand/social-card-template.png"],
    type: "website",
  },
  // Keep the preview out of search until launch.
  robots: site.isPreview ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#08111F",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
