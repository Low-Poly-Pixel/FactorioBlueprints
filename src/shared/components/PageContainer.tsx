import type { ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
};

export const PageContainer = ({ children }: PageContainerProps) => (
  <main className="scrollbar-gutter-both flex-1 overflow-y-auto">
    <div className="mx-auto max-w-7xl px-8 py-6">{children}</div>
  </main>
);
