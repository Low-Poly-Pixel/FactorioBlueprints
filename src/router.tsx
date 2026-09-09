import { dehydrate, hydrate, QueryClient } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    scrollToTopSelectors: ['main'],
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultViewTransition: true,
    context: { queryClient },
  });

  router.options.dehydrate = () => ({
    dehydratedQueryClient: dehydrate(queryClient),
  });
  router.options.hydrate = (dehydrated) =>
    hydrate(queryClient, dehydrated.dehydratedQueryClient);

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
