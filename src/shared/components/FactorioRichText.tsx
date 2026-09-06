import { Fragment, type ReactNode, useState } from 'react';

import type { FactorioRichTextSegment } from '@/shared/blueprint/factorioRichText';
import { parseFactorioRichText } from '@/shared/blueprint/factorioRichText';

type RichTextIconImageProps = {
  candidateUrls: string[];
  name: string;
};

// Cascades through the CDN-then-wiki candidate chain on load failure,
// rendering nothing once every candidate has failed — these come from
// freeform author-typed item/entity names, so an unresolvable one is
// expected occasionally, not an error state worth surfacing.
const RichTextIconImage = ({ candidateUrls, name }: RichTextIconImageProps) => {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const url = candidateUrls[candidateIndex];

  return url ? (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: onError is an image-load-failure fallback, not a user interaction — there's no keyboard/pointer semantic being skipped here.
    <img
      alt={name}
      className="mx-0.5 inline-block size-4 align-text-bottom"
      onError={() => setCandidateIndex((index) => index + 1)}
      src={url}
    />
  ) : null;
};

// Segments are parsed once from an immutable blueprint title/description
// (ADR-0004) — order and count never change after the initial render, so
// index is a stable key here.
const renderSegments = (segments: FactorioRichTextSegment[]): ReactNode =>
  segments.map((segment, index) => {
    if (segment.type === 'text') {
      // biome-ignore lint/suspicious/noArrayIndexKey: static per-render segment list, see comment above renderSegments
      return <Fragment key={index}>{segment.text}</Fragment>;
    }

    if (segment.type === 'icon') {
      return (
        <RichTextIconImage
          candidateUrls={segment.candidateUrls}
          // biome-ignore lint/suspicious/noArrayIndexKey: static per-render segment list, see comment above renderSegments
          key={index}
          name={segment.name}
        />
      );
    }

    return (
      // biome-ignore lint/suspicious/noArrayIndexKey: static per-render segment list, see comment above renderSegments
      <span key={index} style={{ color: segment.color }}>
        {renderSegments(segment.segments)}
      </span>
    );
  });

type FactorioRichTextProps = {
  text: string;
};

export const FactorioRichText = ({ text }: FactorioRichTextProps) => (
  <>{renderSegments(parseFactorioRichText(text))}</>
);
