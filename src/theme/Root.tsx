import {useEffect, useRef} from 'react';
import type {ReactNode} from 'react';
import {flushSync} from 'react-dom';
import {useHistory, useLocation} from '@docusaurus/router';

/**
 * The page turn.
 *
 * Pressing "Next" lifts the current page off the spine and turns it over.
 *
 * How it works:
 * 1. A capture-phase listener spots clicks on the pagination links.
 * 2. If the browser supports View Transitions, the browser snapshots the old
 *    page, we navigate inside the snapshot window, and the new page turns in.
 * 3. The update callback is async: it waits for the next document's lazy
 *    chunk to mount, so the incoming snapshot is the finished page rather
 *    than a loading state.
 * 4. Without View Transitions, the same motion is applied with plain CSS
 *    classes on the article element.
 *
 * `prefers-reduced-motion` disables the turn entirely — in the browser and
 * in this code.
 */

interface ViewTransition {
  finished: Promise<void>;
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (
    updateCallback: () => void | Promise<void>,
  ) => ViewTransition;
};

const TURN_DURATION = 460;
const FADE_DURATION = 220;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Marks the article on screen so it is not mistaken for the next one.
 */
function markCurrentArticle(): void {
  const current = document.querySelector('.theme-doc-markdown');
  current?.setAttribute('data-turn-current', 'true');
}

/**
 * Resolves once an article that is not the marked one has mounted.
 */
function waitForNextArticle(timeout = 2500): Promise<void> {
  return new Promise((resolve) => {
    const cleanup = () => {
      observer.disconnect();
      window.clearTimeout(timer);
      document
        .querySelector('[data-turn-current]')
        ?.removeAttribute('data-turn-current');
    };

    const findNext = () =>
      document.querySelector('.theme-doc-markdown:not([data-turn-current])');

    const observer = new MutationObserver(() => {
      if (findNext()) {
        cleanup();
        resolve();
      }
    });

    const timer = window.setTimeout(() => {
      cleanup();
      resolve();
    }, timeout);

    if (findNext()) {
      cleanup();
      resolve();
      return;
    }

    observer.observe(document.body, {childList: true, subtree: true});
  });
}

export default function Root({children}: {children: ReactNode}): ReactNode {
  const history = useHistory();
  const location = useLocation();
  const turning = useRef(false);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Only the pagination links turn the page.
      const target = event.target as Element | null;
      if (!target?.closest('.pagination-nav__link')) {
        return;
      }

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = target.closest('a');
      if (!anchor || anchor.hasAttribute('download')) {
        return;
      }

      if (anchor.target && anchor.target !== '_self') {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }
      if (url.pathname === window.location.pathname) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const destination = url.pathname + url.search + url.hash;
      const doc = document as ViewTransitionDocument;
      turning.current = true;

      // Mark the outgoing page before it is replaced.
      markCurrentArticle();

      if (doc.startViewTransition && !prefersReducedMotion()) {
        const transition = doc.startViewTransition(async () => {
          flushSync(() => {
            history.push(destination);
          });
          await waitForNextArticle();
        });

        transition.finished.finally(() => {
          turning.current = false;
        });
        return;
      }

      // Fallback: the same motion, driven by CSS classes.
      const current = document.querySelector(
        '.theme-doc-markdown[data-turn-current]',
      );
      current?.classList.add('page-turn-out');

      history.push(destination);

      void waitForNextArticle().then(() => {
        const next = document.querySelector(
          '.theme-doc-markdown:not([data-turn-current])',
        );
        next?.classList.add('page-turn-in');
        window.setTimeout(() => {
          next?.classList.remove('page-turn-in');
          turning.current = false;
        }, TURN_DURATION);
      });
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [history]);

  // Every other navigation gets a short fade.
  useEffect(() => {
    if (turning.current) {
      return;
    }

    const article = document.querySelector('.theme-doc-markdown');
    if (!article) {
      return;
    }

    article.classList.add('page-fade-in');
    const timer = window.setTimeout(() => {
      article.classList.remove('page-fade-in');
    }, FADE_DURATION + 60);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return <>{children}</>;
}
