import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';
import { MusicProvider } from '@/components/MusicProvider';
import { MusicToggle } from '@/components/MusicToggle';
import { LoadingScreen } from '@/components/LoadingScreen';
import weddingData from '@/data/wedding.json';

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jost',
  display: 'swap',
});

// ---------------------------------------------------------------------------
// Site config — edit data/wedding.json → "site" to change these
// ---------------------------------------------------------------------------

const site = (weddingData as { site?: Record<string, string> }).site ?? {};

const monogram   = site.loading_monogram ?? `${weddingData.bride_name[0]} & ${weddingData.groom_name[0]}`;
const tagline    = site.loading_tagline;
const tabTitle   = site.tab_title ?? `${weddingData.bride_name} & ${weddingData.groom_name} — Wedding Invitation`;
const tabDesc    = site.tab_description ?? `You're invited to celebrate ${weddingData.bride_name} & ${weddingData.groom_name}'s wedding.`;

// ---------------------------------------------------------------------------
// Viewport
// ---------------------------------------------------------------------------

export const viewport: Viewport = {
  themeColor: '#C9A84C',
};

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  // metadataBase makes relative OG image paths resolve to an absolute URL
  // which WhatsApp, iMessage, and other scrapers require.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3001')
  ),
  title: tabTitle,
  description: tabDesc,
  openGraph: {
    title: tabTitle,
    description: tabDesc,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: tabTitle,
    description: tabDesc,
  },
  robots: {
    index: false,
    follow: false,
  },
};

// ---------------------------------------------------------------------------
// RootLayout
// ---------------------------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${cormorant.variable} ${jost.variable} font-sans antialiased bg-cream text-charcoal`}
      >
        <LoadingScreen monogram={monogram} tagline={tagline} />

        <MusicProvider>
          {children}
          <MusicToggle />
        </MusicProvider>
      </body>
    </html>
  );
}
