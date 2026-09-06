import { useState } from 'react';

import { Button } from '@/shared/components/shadcn/button';
import { CopyBlueprintStringIcon } from './CopyBlueprintStringIcon';

type CopyBlueprintStringButtonProps = {
  exportString: string;
};

export type CopyState = 'idle' | 'copied' | 'failed';

const copyStates: CopyState[] = ['idle', 'copied', 'failed'];

const feedbackResetDelayMs = 2000;

const labelByState: Record<CopyState, string> = {
  idle: 'Copy Blueprint String',
  copied: 'Copied!',
  failed: 'Copy failed',
};

// copied: same green as the Upgrade Planner entity-kind color (--success).
// failed: same red as Button's own destructive variant (--destructive) —
// matched by hand since destructive has no text-*-foreground token of its
// own, just literal text-white (see shadcn/button.tsx).
const buttonClassNameByState: Record<CopyState, string> = {
  idle: '',
  copied: 'bg-success text-success-foreground hover:bg-success/90',
  failed: 'bg-destructive text-white hover:bg-destructive/90',
};

export const CopyBlueprintStringButton = ({
  exportString,
}: CopyBlueprintStringButtonProps) => {
  const [state, setState] = useState<CopyState>('idle');

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(exportString);
      setState('copied');
    } catch {
      setState('failed');
    }
    setTimeout(() => setState('idle'), feedbackResetDelayMs);
  };

  return (
    <>
      <Button
        aria-label={labelByState[state]}
        className={buttonClassNameByState[state]}
        onClick={handleClick}
      >
        <span className="grid overflow-hidden">
          {copyStates.map((labelState) => (
            <span
              aria-hidden="true"
              className={`col-start-1 row-start-1 flex items-center gap-2 transition-all duration-300 ease-out ${state === labelState ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'}`}
              key={labelState}
            >
              <CopyBlueprintStringIcon state={labelState} />
              {labelByState[labelState]}
            </span>
          ))}
        </span>
      </Button>
      <span aria-live="polite" className="sr-only">
        {state === 'copied' && 'Blueprint string copied to clipboard'}
        {state === 'failed' && 'Copying the blueprint string failed'}
      </span>
    </>
  );
};
