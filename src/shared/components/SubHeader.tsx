import type { ReactNode } from 'react';

type SubHeaderProps = {
  children: ReactNode;
};

export const SubHeader = ({ children }: SubHeaderProps) => (
  <div
    className="border-border border-b bg-surface"
    style={{ viewTransitionName: 'sub-header' }}
  >
    <div className="mx-auto flex max-w-7xl items-center gap-2 px-8 min-h-14">
      {children}
    </div>
  </div>
);
