import type { Metadata } from 'next';
import { fetchWedding } from '@/lib/api';
import { InvitationPage } from '@/components/InvitationPage';
import { redirect } from 'next/navigation';

// ---------------------------------------------------------------------------
// OG metadata for the universal link
// ---------------------------------------------------------------------------

export async function generateMetadata(): Promise<Metadata> {
  const weddingSlug = process.env.WEDDING_SLUG ?? '';
  const wedding = await fetchWedding(weddingSlug);
  if (!wedding) return {};

  const og = wedding.og ?? {};
  const image = og.image ?? '/og-image.jpg';
  const title       = og.title_universal       ?? `${wedding.bride_name} & ${wedding.groom_name} — Wedding Invitation 💌`;
  const description = og.description_universal ?? `You're invited to celebrate the wedding of ${wedding.bride_name} & ${wedding.groom_name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: image, width: 953, height: 501, alt: `${wedding.bride_name} & ${wedding.groom_name}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function UniversalPage() {
  const weddingSlug = process.env.WEDDING_SLUG ?? '';
  const wedding = await fetchWedding(weddingSlug);

  if (!wedding) {
    redirect('/404');
  }

  return (
    <InvitationPage
      wedding={wedding}
      events={wedding.events}
      linkType="UNIVERSAL_LINK"
    />
  );
}
