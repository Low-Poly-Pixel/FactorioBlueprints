import { Link } from '@tanstack/react-router';
import { DraftingCompass } from 'lucide-react';
import { Button } from './shadcn/button';

// TODO: flip this once the Post-a-Blueprint upload feature actually
// exists — right now it's a static button that does nothing when clicked.
const showPostBlueprintButton = false;

export const Header = () => (
  <header
    className="relative flex items-center justify-between overflow-hidden border-border border-b bg-accent px-6 py-4"
    style={{ viewTransitionName: 'site-header' }}
  >
    {/* Brand watermark — a solid (not alpha-blended) tint one step lighter
        than --accent via color-mix, rather than a low-opacity overlay. The
        icon's own overlapping stroke paths made a transparent version look
        inconsistently dark where lines crossed; a flat computed color has
        no compositing to go uneven. */}
    <DraftingCompass
      aria-hidden="true"
      className="-top-8 pointer-events-none absolute right-6 size-32 text-[color-mix(in_srgb,var(--foreground),var(--accent)_94%)]"
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
    <Link
      to="/"
      className="flex items-center gap-2 text-xl font-semi-bold text-foreground"
    >
      <DraftingCompass
        aria-hidden="true"
        className="size-6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      Factorio Blueprints
    </Link>
    {showPostBlueprintButton && <Button>Post a Blueprint</Button>}
  </header>
);
