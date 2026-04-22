import { SupabaseProvider } from "@/components/supabase-provider";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkiedu.com"),
  title: {
    default: "Sparki Academy — Parent dashboard & tutor",
    template: "%s · Sparki Academy",
  },
  description:
    "COPPA-aligned parent accounts, AI tutor session summaries, and Academy subscription flows for Sparki.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.sparkiedu.com/",
    siteName: "Sparki Academy",
    title: "Sparki Academy",
    description:
      "Parent dashboard, tutor telemetry, and subscription management — companion to the Sparki consumer app.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sparki Academy",
    description: "Parent dashboard and tutor tools for Sparki.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
