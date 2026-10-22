import type {ReactNode} from 'react';

export interface FigureProps {
  src: string;
  /** Required. Describe the image for readers who cannot see it. */
  alt: string;
  /** The printed caption under the plate. */
  caption?: string;
  /** Intrinsic width, used to avoid layout shift. */
  width?: number;
  height?: number;
}

/**
 * A figure set into the page as a printed plate.
 */
export default function Figure({
  src,
  alt,
  caption,
  width,
  height,
}: FigureProps): ReactNode {
  return (
    <figure className="figure">
      <div className="figure__image">
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={src} alt={alt} width={width} height={height} loading="lazy" />
      </div>
      {caption ? (
        <figcaption className="figure__caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
