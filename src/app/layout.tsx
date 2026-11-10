import type { Metadata } from 'next';
import './globals.css';
import { ClimateProvider } from '@/lib/context/ClimateContext';

export const metadata: Metadata = {
  title: 'ClimateAI Maharashtra | AI Climate Commitment Verification Platform',
  description:
    'An elite enterprise climate intelligence and accountability platform connecting municipal commitments with independent environmental evidence for Mumbai and Pune.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="h-full bg-background text-charcoal-900 antialiased selection:bg-emerald-100 selection:text-forest-900">
        <ClimateProvider>{children}</ClimateProvider>
      </body>
    </html>
  );
}

