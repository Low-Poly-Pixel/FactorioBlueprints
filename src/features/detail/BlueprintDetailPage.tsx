import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

import type { ResolvedBlueprintTreeNode } from '../../shared/blueprint/icons';
import { BlueprintSummaryCard } from '../../shared/components/BlueprintSummaryCard';
import {
  blueprintCardShellClassName,
  getBlueprintCardViewTransitionName,
} from '../../shared/components/blueprintCardShell';
import { PageContainer } from '../../shared/components/PageContainer';
import { Button } from '../../shared/components/shadcn/button';
import { BlueprintTree } from './BlueprintTree';
import { CopyBlueprintStringButton } from './CopyBlueprintStringButton';
import type { BlueprintDetail } from './getBlueprintDetail';
import { outlineAccentButtonClassName } from './outlineAccentButtonClassName';
import { ViewRawStringButton } from './ViewRawStringButton';

type BlueprintDetailPageProps = {
  blueprint: BlueprintDetail;
};

const panelClassName = 'mt-4 rounded-md bg-card p-4';
const sectionHeadingClassName = 'font-semibold text-foreground';

// A Blueprint Book's "contents" are its real entries. Every other entity
// kind is still structurally one item, so it gets a single self-referencing
// leaf node rather than an empty/hidden Contents section.
const getContentsTreeNodes = (
  blueprint: BlueprintDetail,
): ResolvedBlueprintTreeNode[] =>
  blueprint.entityKind === 'blueprint_book'
    ? blueprint.children
    : [
        {
          children: [],
          entityKind: blueprint.entityKind,
          exportString: blueprint.exportString,
          icons: blueprint.icons,
          title: blueprint.title,
        },
      ];

export const BlueprintDetailPage = ({
  blueprint,
}: BlueprintDetailPageProps) => (
  <PageContainer>
    <Button
      asChild
      className={`mb-4 ${outlineAccentButtonClassName}`}
      size="sm"
      variant="outline"
    >
      <Link to="/" viewTransition>
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to search
      </Link>
    </Button>
    <div
      className={blueprintCardShellClassName}
      style={{
        viewTransitionName: getBlueprintCardViewTransitionName(blueprint.id),
      }}
    >
      <BlueprintSummaryCard blueprint={blueprint} />
    </div>
    <div className={`${panelClassName} flex gap-2`}>
      <CopyBlueprintStringButton exportString={blueprint.exportString} />
      <ViewRawStringButton exportString={blueprint.exportString} />
    </div>
    <div className={panelClassName}>
      <h2 className={sectionHeadingClassName}>Description</h2>
      <p className="mt-1 text-muted-foreground text-sm">
        {blueprint.description ?? 'No description provided.'}
      </p>
    </div>
    <div className={panelClassName}>
      <h2 className={sectionHeadingClassName}>Contents</h2>
      <div className="mt-2">
        <BlueprintTree nodes={getContentsTreeNodes(blueprint)} />
      </div>
    </div>
  </PageContainer>
);
