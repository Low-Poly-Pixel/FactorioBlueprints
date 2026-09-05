import { Check, Copy, X } from 'lucide-react';

import type { CopyState } from './CopyBlueprintStringButton';

type CopyBlueprintStringIconProps = {
  state: CopyState;
};

export const CopyBlueprintStringIcon = ({
  state,
}: CopyBlueprintStringIconProps) => {
  if (state === 'copied') {
    return <Check aria-hidden="true" className="size-4" />;
  }
  if (state === 'failed') {
    return <X aria-hidden="true" className="size-4" />;
  }
  return <Copy aria-hidden="true" className="size-4" />;
};
