import { Link } from '@tanstack/react-router';
import type { BlueprintSummary } from '@/api/blueprintRow.server';
import { BlueprintSummaryCard } from '@/shared/components/BlueprintSummaryCard';
import {
  blueprintCardShellClassName,
  getBlueprintCardViewTransitionName,
} from '@/shared/components/blueprintCardShell';

type BlueprintResultCardProps = {
  blueprint: BlueprintSummary;
};

export const BlueprintResultCard = ({
  blueprint,
}: BlueprintResultCardProps) => (
  <li>
    <Link
      className={`block ${blueprintCardShellClassName} border border-border transition hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--card),var(--primary)_20%)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)]`}
      params={{ id: blueprint.id }}
      style={{
        viewTransitionName: getBlueprintCardViewTransitionName(blueprint.id),
      }}
      to="/blueprints/$id"
      viewTransition
    >
      {/* Plain opacity transition via @starting-style rather than
          tw-animate-css's animate-in/fade-in-0 — that utility's "enter"
          keyframe bundles opacity with a transform (translate/scale/rotate)
          and a blur filter into one animation, which was producing a subtle
          shrink alongside the fade. This touches only opacity. */}
      <div className="opacity-100 transition-opacity duration-300 starting:opacity-0">
        <BlueprintSummaryCard blueprint={blueprint} />
      </div>
    </Link>
  </li>
);
