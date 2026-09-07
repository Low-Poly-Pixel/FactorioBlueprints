import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import type { ReactNode } from 'react';

import { Header } from '@/shared/components/header';
import { TooltipProvider } from '@/shared/components/shadcn/tooltip';
import appCss from '@/styles.css?url';

type RootDocumentProps = {
  children: ReactNode;
};

type RouterContext = {
  queryClient: QueryClient;
};

const RootDocument = ({ children }: RootDocumentProps) => {
  const { queryClient } = Route.useRouteContext();

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            {/* h-screen + overflow-hidden here (and flex-1 + overflow-y-auto
            on PageContainer's <main>) is what keeps the scrollbar scoped to
            just the page's content area — the header/sub-header/footer
            chrome around it never scrolls because it's never inside an
            overflowing box to begin with. */}
            <div className="flex h-screen flex-col overflow-hidden">
              <Header />
              <div className="flex flex-1 flex-col overflow-hidden">
                {children}
              </div>
            </div>
          </TooltipProvider>
        </QueryClientProvider>
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Factorio Blueprints' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600;700&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: RootDocument,
});
