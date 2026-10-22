import type {ReactNode} from 'react';

export interface DropCapProps {
  /** The opening text. Only the first character is given the drop cap. */
  children: ReactNode;
}

/**
 * The opening letter, set large.
 *
 * The letter is wrapped in its own span rather than using `::first-letter`
 * so that a heading, list or code block immediately after the paragraph
 * cannot drag the cap out of alignment.
 */
export default function DropCap({children}: DropCapProps): ReactNode {
  if (typeof children !== 'string' || children.length === 0) {
    return <>{children}</>;
  }

  const [first, ...rest] = children;

  return (
    <>
      <span className="dropcap">{first}</span>
      {rest.join('')}
    </>
  );
}
