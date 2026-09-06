import { ExternalLink } from 'lucide-react';

import { Button } from '@/shared/components/shadcn/button';
import { outlineAccentButtonClassName } from './outlineAccentButtonClassName';

type OpenInBlueprintEditorButtonProps = {
  exportString: string;
};

// The long-standing FBE (fbe.teoxoy.com) was marked unmaintained/deprecated
// by its author. This links to its actively-maintained successor instead:
// FactoryGameFan/factorio-blueprint-editor, deployed at fbe.factorygamefan.com
const getEditorUrl = (exportString: string): string =>
  `https://fbe.factorygamefan.com/?source=${encodeURIComponent(exportString)}`;

export const OpenInBlueprintEditorButton = ({
  exportString,
}: OpenInBlueprintEditorButtonProps) => (
  <Button
    asChild
    className={`shrink-0 ${outlineAccentButtonClassName} p-3.5`}
    onClick={(event) => event.stopPropagation()}
    size="icon-xs"
    variant="outline"
  >
    <a
      aria-label="Open in Factorio Blueprint Editor"
      href={getEditorUrl(exportString)}
      rel="noopener noreferrer"
      target="_blank"
    >
      <ExternalLink aria-hidden="true" />
    </a>
  </Button>
);
