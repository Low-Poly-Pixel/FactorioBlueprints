import { blueprintCardShellClassName } from '@/shared/components/blueprintCardShell';

const skeletonBlockClassName = 'animate-pulse rounded bg-muted';

const BrowseResultCardSkeleton = () => (
  <li className={`${blueprintCardShellClassName} flex items-center gap-4`}>
    <div className={`size-20 shrink-0 ${skeletonBlockClassName}`} />
    <div className="flex flex-1 flex-col gap-2">
      <div className={`h-5 w-2/5 ${skeletonBlockClassName}`} />
      <div className={`h-4 w-1/4 ${skeletonBlockClassName}`} />
      <div className={`h-4 w-1/3 ${skeletonBlockClassName}`} />
    </div>
  </li>
);

type BrowseResultsSkeletonProps = {
  count: number;
};

export const BrowseResultsSkeleton = ({
  count,
}: BrowseResultsSkeletonProps) => (
  <>
    <span className="sr-only" role="status">
      Loading search results…
    </span>
    <ul aria-hidden="true" className="flex flex-col gap-3">
      {Array.from({ length: count }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static decorative placeholders with no state or reordering — count (mirroring page size) is the only thing that ever changes, so index is a stable key here.
        <BrowseResultCardSkeleton key={index} />
      ))}
    </ul>
  </>
);
