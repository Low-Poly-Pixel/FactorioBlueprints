import { ExternalLink } from 'lucide-react';

import { Button } from '../../shared/components/shadcn/button';
import { outlineAccentButtonClassName } from './outlineAccentButtonClassName';

type OpenInBlueprintEditorButtonProps = {
  exportString: string;
};

// The long-standing FBE (fbe.teoxoy.com) was marked unmaintained/deprecated
// by its author. This links to its actively-maintained successor instead:
// FactoryGameFan/factorio-blueprint-editor, deployed at fbe.factorygamefan.com.
// Its `source` param accepts a raw blueprint string directly (anything
// starting with "0" is treated as one, no fetch involved) — verified against
// its own source (packages/editor/src/core/bpString.ts).
const getEditorUrl = (exportString: string): string =>
  `https://fbe.factorygamefan.com/?source=${encodeURIComponent(exportString)}`;

export const OpenInBlueprintEditorButton = ({
  exportString,
}: OpenInBlueprintEditorButtonProps) => (
  <Button
    asChild
    className={`shrink-0 ${outlineAccentButtonClassName}`}
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
