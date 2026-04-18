import Link from 'next/link';

// ---------------------------------------------------------------------------
// NotFound — 404 page
// Matches the invitation's cream + serif aesthetic. Server component — no JS.
// ---------------------------------------------------------------------------

export default function NotFound() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{ background: 'linear-gradient(160deg, #FAF6F0 0%, #F5EFE6 100%)' }}
    >
      {/* Inner border frame — mirrors HeroSection */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-[2px] border border-gold-300/35 sm:inset-6"
      />

      {/* Link / page label */}
      <p className="mb-6 font-sans text-[11px] uppercase tracking-[5px] text-warmgray/60">
        404
      </p>

      {/* Gold hairline */}
      <div className="mb-6 h-px w-10 bg-gold-300" />

      {/* Heading */}
      <h1
        className="font-serif font-light text-charcoal"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
      >
        Invitation Not Found
      </h1>

      {/* Subtext */}
      <p className="mx-auto mt-4 max-w-[280px] font-sans text-[14px] leading-relaxed text-warmgray">
        This invitation link may have expired or the address is incorrect.
      </p>

      {/* Separator */}
      <div className="my-8 h-px w-10 bg-gold-300" />

      {/* Back link */}
      <Link
        href="/"
        className="group font-sans text-[12px] uppercase tracking-[3px] text-gold-500 transition-colors hover:text-gold-400"
      >
        View Invitation
        <span className="ml-1 inline-block transition-transform duration-150 group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </main>
  );
}
