import { useRouter } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

import type { BlueprintDetail } from '@/api/getBlueprintDetail.functions';
import type { ResolvedBlueprintTreeNode } from '@/shared/blueprint/icons';
import { BlueprintSummaryCard } from '@/shared/components/BlueprintSummaryCard';
import {
  blueprintCardShellClassName,
  getBlueprintCardViewTransitionName,
} from '@/shared/components/blueprintCardShell';
import { FactorioRichText } from '@/shared/components/FactorioRichText';
import { PageContainer } from '@/shared/components/PageContainer';
import { Button } from '@/shared/components/shadcn/button';
import { BlueprintTree } from './BlueprintTree';
import { CopyBlueprintStringButton } from './CopyBlueprintStringButton';
import { outlineAccentButtonClassName } from './outlineAccentButtonClassName';
import { ViewRawStringButton } from './ViewRawStringButton';

type BlueprintDetailPageProps = {
  blueprint: BlueprintDetail;
};

const panelClassName = 'mt-4 rounded-md bg-card p-4';
const sectionHeadingClassName = 'font-semibold text-foreground';

// The tree's root is always the page's own blueprint/book, with its real
// entries (if any) nested underneath — previously a book skipped straight
// to its children as the top-level rows, which meant the book containing
// them never appeared in its own Contents section at all, only in the
// hero card above it. Every other entity kind still has no real children,
// so it's just a single leaf under itself.
const getContentsTreeNodes = (
  blueprint: BlueprintDetail,
): ResolvedBlueprintTreeNode[] => [
  {
    children:
      blueprint.entityKind === 'blueprint_book' ? blueprint.children : [],
    entityKind: blueprint.entityKind,
    exportString: blueprint.exportString,
    icons: blueprint.icons,
    title: blueprint.title,
  },
];

export const BlueprintDetailPage = ({
  blueprint,
}: BlueprintDetailPageProps) => {
  const router = useRouter();

  return (
    <PageContainer>
      <Button
        className={`mb-4 ${outlineAccentButtonClassName}`}
        onClick={() => router.history.back()}
        size="sm"
        variant="outline"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to search
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
          {blueprint.description ? (
            <FactorioRichText text={blueprint.description} />
          ) : (
            'No description provided.'
          )}
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
};
