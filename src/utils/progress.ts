/**
 * Progress storage.
 *
 * Quiz scores and completion ticks live in the browser and nowhere else —
 * no account, no server, no analytics. The key is namespaced to this site
 * and versioned, so a future change to the format can migrate rather than
 * collide with whatever else is in localStorage.
 *
 * Every function here is safe to call during server rendering: without a
 * browser, reads return empty and writes are dropped.
 */

export interface ModuleProgress {
  /** The module has been passed at least once. */
  completed: boolean;
  /** Best score across attempts, 0–100. */
  bestScore: number;
  /** How many times the assessment has been attempted. */
  attempts: number;
  /** ISO timestamp of the most recent attempt. */
  lastAttemptAt: string;
}

export type ProgressMap = Record<string, ModuleProgress>;

const STORAGE_KEY = 'rams-dev-ocean:progress:v1';

const EMPTY: ModuleProgress = {
  completed: false,
  bestScore: 0,
  attempts: 0,
  lastAttemptAt: '',
};

const listeners = new Set<() => void>();

function hasStorage(): boolean {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined' &&
      window.localStorage !== null
    );
  } catch {
    // Storage can throw in private browsing modes.
    return false;
  }
}

function isModuleProgress(value: unknown): value is ModuleProgress {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.completed === 'boolean' &&
    typeof candidate.bestScore === 'number' &&
    typeof candidate.attempts === 'number' &&
    typeof candidate.lastAttemptAt === 'string'
  );
}

/** Every module's progress. Returns an empty map during server rendering. */
export function readAll(): ProgressMap {
  if (!hasStorage()) {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return {};
    }
    const clean: ProgressMap = {};
    for (const [moduleId, value] of Object.entries(parsed)) {
      if (isModuleProgress(value)) {
        clean[moduleId] = value;
      }
    }
    return clean;
  } catch {
    // Corrupt JSON should not break the page.
    return {};
  }
}

/** One module's progress, or null if it has never been attempted. */
export function readModule(moduleId: string): ModuleProgress | null {
  return readAll()[moduleId] ?? null;
}

/**
 * Record a finished attempt.
 *
 * The best score is kept, never overwritten by a worse one, and the module
 * is only marked complete when the score reaches the pass mark.
 */
export function recordAttempt(
  moduleId: string,
  score: number,
  passMark: number,
): ModuleProgress {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const previous = readModule(moduleId);
  const next: ModuleProgress = {
    completed: previous?.completed === true || clamped >= passMark,
    bestScore: Math.max(previous?.bestScore ?? 0, clamped),
    attempts: (previous?.attempts ?? 0) + 1,
    lastAttemptAt: new Date().toISOString(),
  };

  if (hasStorage()) {
    const all = readAll();
    all[moduleId] = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {
      // Storage full or blocked — the attempt still counts for this session.
    }
  }

  notify();
  return next;
}

/** Forget a module's progress. */
export function clearModule(moduleId: string): void {
  if (!hasStorage()) {
    return;
  }
  const all = readAll();
  delete all[moduleId];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Ignore.
  }
  notify();
}

/**
 * Subscribe to progress changes.
 *
 * Returns an unsubscribe function. Used by the badge so it updates the
 * moment a quiz is finished, wherever it lives on the page.
 */
export function onProgressChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}
