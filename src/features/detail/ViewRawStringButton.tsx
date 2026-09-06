import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/shadcn/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/shadcn/dialog';
import { outlineAccentButtonClassName } from './outlineAccentButtonClassName';

type ViewRawStringButtonProps = {
  exportString: string;
};

// No transition on these two, per direct request — unlike Back to search.
const outlineButtonClassName = `${outlineAccentButtonClassName} transition-none`;

export const ViewRawStringButton = ({
  exportString,
}: ViewRawStringButtonProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button className={outlineButtonClassName} variant="outline">
        View Raw String
      </Button>
    </DialogTrigger>
    <DialogContent className="rounded-md border-none bg-card sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Raw Blueprint String</DialogTitle>
      </DialogHeader>
      <pre className="max-h-[60vh] overflow-auto rounded-md bg-background p-3 text-xs break-all whitespace-pre-wrap">
        {exportString}
      </pre>
      <DialogClose asChild>
        <Button
          className={`w-fit justify-self-start ${outlineButtonClassName}`}
          size="sm"
          variant="outline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back
        </Button>
      </DialogClose>
    </DialogContent>
  </Dialog>
);
