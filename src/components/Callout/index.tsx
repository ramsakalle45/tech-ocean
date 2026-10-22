import type {ReactNode} from 'react';

export type CalloutType = 'note' | 'tip' | 'warning' | 'interview';

export interface CalloutProps {
  /** Which kind of note this is. */
  type?: CalloutType;
  /** Overrides the default title for the type. */
  title?: string;
  children: ReactNode;
}

const DEFAULT_TITLES: Record<CalloutType, string> = {
  note: 'Note',
  tip: 'Tip',
  warning: 'Common Mistake',
  interview: 'Interview Corner',
};

/**
 * A marginal note.
 *
 * Types: note, tip, warning, interview. The title is set in the handwriting
 * face; the body stays in the reading face so long notes remain readable.
 */
export default function Callout({
  type = 'note',
  title,
  children,
}: CalloutProps): ReactNode {
  const heading = title ?? DEFAULT_TITLES[type];

  return (
    <aside className={`callout callout--${type}`}>
      <div className="callout__title">{heading}</div>
      <div className="callout__body">{children}</div>
    </aside>
  );
}
