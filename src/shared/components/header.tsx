import { Link } from '@tanstack/react-router';
import { Landmark } from 'lucide-react';

import { GearIcon } from './icons/gear';
import { Button } from './shadcn/button';

export const Header = () => (
  <header className="relative flex items-center justify-between overflow-hidden px-6 py-4 shadow-[0_1px_0_0_var(--border)]">
    <GearIcon className="-top-6 right-32 pointer-events-none absolute -z-10 size-48 text-foreground/10" />
    <Link
      to="/"
      className="flex items-center gap-2 text-xl font-bold text-foreground"
    >
      <Landmark
        aria-hidden="true"
        className="size-6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      Factorio Library
    </Link>
    <Button>Post a Blueprint</Button>
  </header>
);
