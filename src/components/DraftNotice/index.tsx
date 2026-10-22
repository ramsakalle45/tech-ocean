import type {ReactNode} from 'react';

export interface DraftNoticeProps {
  children?: ReactNode;
}

/**
 * Marks a chapter that has not been written yet.
 *
 * Drafts stay visible so the roadmap is honest, but they are never
 * mistaken for finished work.
 */
export default function DraftNotice({
  children = 'This chapter is still being written. Corrections and additions are welcome.',
}: DraftNoticeProps): ReactNode {
  return (
    <div className="draft-notice">
      <span className="draft-notice__label">Draft</span>
      <span>{children}</span>
    </div>
  );
}
