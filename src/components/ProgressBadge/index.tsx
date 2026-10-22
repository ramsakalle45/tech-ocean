import {useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import {onProgressChange, readModule} from '@site/src/utils/progress';
import type {ModuleProgress} from '@site/src/utils/progress';

export interface ProgressBadgeProps {
  /** The key the quiz records progress under. */
  moduleId: string;
  /** Optional text in front of the status, e.g. the module name. */
  label?: string;
}

/**
 * A small mark of how far a reader has got.
 *
 * Reads the same localStorage the quiz writes to, and refreshes whenever a
 * quiz elsewhere on the page finishes. During server rendering it shows
 * nothing at all, so the markup matches on both sides.
 */
export default function ProgressBadge({
  moduleId,
  label,
}: ProgressBadgeProps): ReactNode {
  const [progress, setProgress] = useState<ModuleProgress | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setProgress(readModule(moduleId));
      setReady(true);
    };
    refresh();
    return onProgressChange(refresh);
  }, [moduleId]);

  if (!ready) {
    return null;
  }

  const state = progress?.completed
    ? 'done'
    : progress && progress.attempts > 0
      ? 'attempted'
      : 'new';

  const text = progress?.completed
    ? 'Completed'
    : progress && progress.attempts > 0
      ? `Best ${progress.bestScore}%`
      : 'Not attempted';

  return (
    <span className={`progress-badge progress-badge--${state}`}>
      {label && <span className="progress-badge__label">{label}</span>}
      <span className="progress-badge__status">{text}</span>
    </span>
  );
}
