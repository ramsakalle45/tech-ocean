import type {ReactNode} from 'react';
import {toRoman} from '@site/src/utils/roman';

export interface ChapterHeaderProps {
  /** Chapter number. Rendered as a Roman numeral. */
  number: number;
  /** Optional title. Usually the page heading already carries it. */
  title?: string;
  /** Small line above the number, e.g. "Module" or "Subject". */
  eyebrow?: string;
}

/**
 * The ornamental marker that opens a chapter.
 *
 * <ChapterHeader number={3} eyebrow="Python" />
 */
export default function ChapterHeader({
  number,
  title,
  eyebrow = 'Chapter',
}: ChapterHeaderProps): ReactNode {
  return (
    <header className="chapter-header">
      <span className="chapter-header__eyebrow">{eyebrow}</span>
      <span className="chapter-header__number">{toRoman(number)}</span>
      <span className="chapter-header__rule" aria-hidden="true" />
      {title ? <span className="chapter-header__title">{title}</span> : null}
    </header>
  );
}
