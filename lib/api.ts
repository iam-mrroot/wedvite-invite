import weddingData from '@/data/wedding.json';

const API_URL = process.env.API_URL ?? '';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WeddingEvent {
  id: string;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  venue_name: string;
  venue_address: string;
  venue_lat: number;
  venue_lng: number;
  /** Optional explicit Google Maps URL — overrides the lat/lng-derived link */
  maps_url?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  greeting?: string;
}

export interface Guest {
  id: string;
  slug: string;
  name: string;
  category_id?: string;
}

export interface WeddingOg {
  image?: string;
  title_personal?: string;
  description_personal?: string;
  title_category?: string;
  description_category?: string;
  title_universal?: string;
  description_universal?: string;
}

export interface Wedding {
  id: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  greeting_default?: string;
  theme?: string;
  og?: WeddingOg;
  config_json?: Record<string, unknown>;
  events: WeddingEvent[];
  categories: Category[];
  guests: Guest[];
}

export type LinkResolution =
  | { type: 'category'; data: Category }
  | { type: 'personal'; data: Guest }
  | { type: 'not_found'; data: null };

// ---------------------------------------------------------------------------
// Local JSON data source
// The entire wedding lives in data/wedding.json — edit that file to update
// names, dates, venues, guests, and categories.
// ---------------------------------------------------------------------------

const localWedding: Wedding = weddingData as Wedding;

export async function fetchWedding(_slug: string): Promise<Wedding | null> {
  return localWedding;
}

export async function resolveSlug(
  _weddingSlug: string,
  urlSlug: string,
): Promise<LinkResolution> {
  const category = localWedding.categories.find((c) => c.slug === urlSlug);
  if (category) return { type: 'category', data: category };

  const guest = localWedding.guests.find((g) => g.slug === urlSlug);
  if (guest) return { type: 'personal', data: guest };

  return { type: 'not_found', data: null };
}

// ---------------------------------------------------------------------------
// Tracking — no-op when API_URL is not configured
// ---------------------------------------------------------------------------

export interface TrackClickPayload {
  wedding_id: string;
  category_id?: string;
  guest_id?: string;
  link_type: 'UNIVERSAL_LINK' | 'CATEGORY_LINK' | 'PERSONAL_LINK';
  user_agent?: string;
}

export async function trackClick(data: TrackClickPayload): Promise<void> {
  if (!API_URL) return;
  try {
    await fetch(`${API_URL}/api/track/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    // fire-and-forget
  }
}

// ---------------------------------------------------------------------------
// RSVP — POSTs to API_URL when set, otherwise returns a simulated success
// so the form works fully standalone without a backend.
// ---------------------------------------------------------------------------

export async function submitRsvp(
  weddingSlug: string,
  rsvpData: object,
): Promise<Response | null> {
  if (!API_URL) {
    // Standalone mode: log locally and simulate a 200 OK
    console.log('[RSVP standalone]', JSON.stringify(rsvpData, null, 2));
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }
  try {
    return await fetch(`${API_URL}/api/weddings/${weddingSlug}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rsvpData),
    });
  } catch {
    return null;
  }
}
