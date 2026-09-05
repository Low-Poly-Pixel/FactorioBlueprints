import type { ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
};

export const PageContainer = ({ children }: PageContainerProps) => (
  <main className="mx-auto max-w-7xl px-8 py-8">{children}</main>
);
