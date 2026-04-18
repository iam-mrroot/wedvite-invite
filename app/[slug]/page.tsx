import type { Metadata } from 'next';
import { resolveSlug, fetchWedding } from '@/lib/api';
import { InvitationPage } from '@/components/InvitationPage';
import { redirect } from 'next/navigation';

interface Props {
  params: { slug: string };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fill(template: string, name: string) {
  return template.replace(/\{name\}/g, name).replace(/\{category\}/g, name);
}

// ---------------------------------------------------------------------------
// Dynamic OG metadata — each personal/category link gets its own preview
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const weddingSlug = process.env.WEDDING_SLUG ?? '';
  const { slug } = params;

  const [resolution, wedding] = await Promise.all([
    resolveSlug(weddingSlug, slug),
    fetchWedding(weddingSlug),
  ]);

  if (!wedding || resolution.type === 'not_found') return {};

  const og = wedding.og ?? {};
  const image = og.image ?? '/og-image.jpg';
  const images = [{ url: image, width: 1200, height: 630, alt: `${wedding.bride_name} & ${wedding.groom_name}` }];

  let title: string;
  let description: string;

  if (resolution.type === 'personal') {
    const name = resolution.data.name;
    title       = fill(og.title_personal       ?? `You're invited, {name}! 💌`, name);
    description = fill(og.description_personal ?? `Dear {name}, you are warmly invited to the wedding.`, name);
  } else {
    // category link
    const name = resolution.data.name;
    title       = fill(og.title_category       ?? `You're invited! 💌`, name);
    description = fill(og.description_category ?? `You are warmly invited to the wedding.`, name);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images,
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

export default async function SlugPage({ params }: Props) {
  const weddingSlug = process.env.WEDDING_SLUG ?? '';
  const { slug } = params;

  const [resolution, wedding] = await Promise.all([
    resolveSlug(weddingSlug, slug),
    fetchWedding(weddingSlug),
  ]);

  if (!wedding || resolution.type === 'not_found') {
    redirect('/');
  }

  if (resolution.type === 'category') {
    return (
      <InvitationPage
        wedding={wedding}
        events={wedding.events}
        linkType="CATEGORY_LINK"
        categoryId={resolution.data.id}
        customGreeting={resolution.data.greeting}
      />
    );
  }

  // personal link
  return (
    <InvitationPage
      wedding={wedding}
      events={wedding.events}
      linkType="PERSONAL_LINK"
      guestId={resolution.data.id}
      guestName={resolution.data.name}
    />
  );
}
