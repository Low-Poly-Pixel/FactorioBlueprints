import { createFileRoute, notFound } from '@tanstack/react-router';

import { getBlueprintDetail } from '@/api/getBlueprintDetail.functions';
import { BlueprintDetailPage } from '@/features/detail/BlueprintDetailPage';

export const Route = createFileRoute('/blueprints/$id')({
  loader: async ({ params }) => {
    const blueprint = await getBlueprintDetail({ data: params.id });
    if (!blueprint) {
      throw notFound();
    }
    return blueprint;
  },
  component: () => <BlueprintDetailPage blueprint={Route.useLoaderData()} />,
});
