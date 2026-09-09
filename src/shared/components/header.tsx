import { Link } from '@tanstack/react-router';
import { DraftingCompass } from 'lucide-react';
import { Button } from './shadcn/button';

// TODO: flip this once the Post-a-Blueprint upload feature actually
// exists — right now it's a static button that does nothing when clicked.
const showPostBlueprintButton = false;

export const Header = () => (
  <header
    className="relative overflow-hidden border-border border-b bg-accent"
    style={{ viewTransitionName: 'site-header' }}
  >
    <div className="relative mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
      <DraftingCompass
        aria-hidden="true"
        className="-top-8 pointer-events-none absolute right-0 size-32 text-[color-mix(in_srgb,var(--foreground),var(--accent)_94%)]"
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
    </div>
  </header>
);
