import { QueryClient } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    // Applies to every navigation that doesn't opt out, including
    // router.history.back()/forward and the browser's own back button —
    // not just Link clicks with viewTransition set explicitly. Without
    // this, "Back to search" on the detail page had no transition at all
    // since it navigates via router.history.back(), which never passes a
    // per-call viewTransition option.
    defaultViewTransition: true,
    context: { queryClient },
  });

  return routerWithQueryClient(router, queryClient);
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
