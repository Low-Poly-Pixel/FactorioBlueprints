import { Link } from '@tanstack/react-router'

import { BlueprintSummaryCard } from '../../shared/components/BlueprintSummaryCard'
import type { BlueprintSummary } from './searchBlueprints'

type BlueprintResultCardProps = {
  blueprint: BlueprintSummary
}

export const BlueprintResultCard = ({
  blueprint,
}: BlueprintResultCardProps) => (
  <li>
    <Link
      className="block rounded-md bg-card p-1 transition hover:-translate-y-0.5 hover:bg-[color-mix(in_oklch,var(--card),var(--primary)_15%)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
      params={{ id: blueprint.id }}
      style={{ viewTransitionName: `blueprint-card-${blueprint.id}` }}
      to="/blueprints/$id"
      viewTransition
    >
      <BlueprintSummaryCard blueprint={blueprint} />
    </Link>
  </li>
)
