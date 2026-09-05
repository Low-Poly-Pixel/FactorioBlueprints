import { createFileRoute, notFound } from '@tanstack/react-router'

import { BlueprintDetailPage } from '../features/detail/BlueprintDetailPage'
import { getBlueprintDetail } from '../features/detail/getBlueprintDetail'

export const Route = createFileRoute('/blueprints/$id')({
  loader: async ({ params }) => {
    const blueprint = await getBlueprintDetail({ data: params.id })
    if (!blueprint) {
      throw notFound()
    }
    return blueprint
  },
  component: () => <BlueprintDetailPage blueprint={Route.useLoaderData()} />,
})
