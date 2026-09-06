import { Link } from '@tanstack/react-router';
import { Landmark } from 'lucide-react';
import { Button } from './shadcn/button';

export const Header = () => (
  <header className="flex items-center justify-between overflow-hidden border-border border-b bg-card px-6 py-4">
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
