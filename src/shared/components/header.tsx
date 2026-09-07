import { Link } from '@tanstack/react-router';
import { DraftingCompass } from 'lucide-react';
import { Button } from './shadcn/button';

// TODO: flip this once the Post-a-Blueprint upload feature actually
// exists — right now it's a static button that does nothing when clicked.
const showPostBlueprintButton = false;

export const Header = () => (
  <header
    className="flex items-center justify-between overflow-hidden border-border border-b bg-accent px-6 py-4"
    style={{ viewTransitionName: 'site-header' }}
  >
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
