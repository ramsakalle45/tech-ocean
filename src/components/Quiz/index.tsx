import {useCallback, useEffect, useMemo, useState} from 'react';
import type {ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import {
  onProgressChange,
  readModule,
  recordAttempt,
} from '@site/src/utils/progress';
import type {ModuleProgress} from '@site/src/utils/progress';

export type QuestionType =
  | 'mcq'
  | 'multi'
  | 'truefalse'
  | 'code-output'
  | 'sql-fill';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  /** Choices for `mcq` and `multi`. */
  options?: string[];
  /** Index for `mcq`, indices for `multi`, boolean for `truefalse`, text for the rest. */
  answer: number | number[] | boolean | string;
  explanation?: string;
  /** The topic to re-read when this question is missed, e.g. `01-variables`. */
  topicRef?: string;
  /** Source shown for `code-output`. */
  code?: string;
  /** Query with a blank shown for `sql-fill`. */
  template?: string;
}

export interface QuizData {
  title: string;
  /** Percentage needed to pass. Defaults to 70. */
  passMark?: number;
  questions: Question[];
}

export interface QuizProps {
  /** The assessment, usually imported from a sibling `quiz.json`. */
  quiz: QuizData;
  /** Stable key for progress storage, e.g. `python/intermediate/decorators`. */
  moduleId: string;
  /** Overrides the pass mark from the quiz file. */
  passMark?: number;
}

type Phase = 'intro' | 'question' | 'result';

interface Shuffled {
  question: Question;
  options: string[];
  /** The answer rewritten to match the shuffled options. */
  answer: number | number[] | boolean | string;
}

/**
 * Fisher-Yates.
 *
 * Only ever called from an event handler, never during render, so the
 * server-rendered markup and the first client render always agree.
 */
function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Removes the numeric prefix and extension from a topic reference. */
function topicSlug(topicRef: string): string {
  return topicRef.replace(/\.mdx$/, '').replace(/^\d+-/, '');
}

function normalise(text: string): string {
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}

function sameSet(a: number[], b: number[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  const sorted = [...a].sort((x, y) => x - y);
  const other = [...b].sort((x, y) => x - y);
  return sorted.every((value, index) => value === other[index]);
}

/**
 * A module assessment.
 *
 * One question at a time, with the answer and its explanation shown as
 * soon as it is checked. Questions and options are shuffled on every run,
 * the score is kept in the browser, and a pass marks the module complete.
 *
 * The first render is deliberately plain: shuffling and reading storage
 * happen after mount, so the server-rendered page and the first client
 * render are identical.
 */
export default function Quiz({
  quiz,
  moduleId,
  passMark: passMarkProp,
}: QuizProps): ReactNode {
  const passMark = passMarkProp ?? quiz.passMark ?? 70;
  const location = useLocation();

  const [phase, setPhase] = useState<Phase>('intro');
  const [order, setOrder] = useState<Shuffled[]>([]);
  const [position, setPosition] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [text, setText] = useState('');
  const [boolean, setBoolean] = useState<boolean | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [progress, setProgress] = useState<ModuleProgress | null>(null);

  // Read stored progress after mount — never during render.
  useEffect(() => {
    const refresh = () => setProgress(readModule(moduleId));
    refresh();
    return onProgressChange(refresh);
  }, [moduleId]);

  const total = quiz.questions.length;

  const buildOrder = useCallback((): Shuffled[] => {
    return shuffle(quiz.questions).map((question) => {
      const options = question.options ? shuffle(question.options) : [];
      let answer = question.answer;

      if (question.options && typeof question.answer === 'number') {
        // Keep the answer pointing at the right option after shuffling.
        const original = question.answer;
        answer = options.indexOf(question.options[original]);
      } else if (question.options && Array.isArray(question.answer)) {
        const original = question.answer;
        answer = original.map((index) => options.indexOf(question.options![index]));
      }

      return {question, options, answer};
    });
  }, [quiz.questions]);

  const begin = useCallback(() => {
    setOrder(buildOrder());
    setPosition(0);
    setPicked([]);
    setText('');
    setBoolean(null);
    setChecked(false);
    setCorrectCount(0);
    setScore(0);
    setPassed(false);
    setPhase('question');
  }, [buildOrder]);

  const current = order[position];

  const isCorrect = useMemo(() => {
    if (!current || !checked) {
      return false;
    }
    const {answer} = current;
    if (Array.isArray(answer)) {
      return sameSet(picked, answer);
    }
    if (typeof answer === 'boolean') {
      return boolean === answer;
    }
    if (typeof answer === 'number') {
      return picked.length === 1 && picked[0] === answer;
    }
    return normalise(text) === normalise(answer);
  }, [boolean, checked, current, picked, text]);

  const canCheck = useMemo(() => {
    if (!current) {
      return false;
    }
    switch (current.question.type) {
      case 'mcq':
      case 'multi':
        return picked.length > 0;
      case 'truefalse':
        return boolean !== null;
      default:
        return text.trim().length > 0;
    }
  }, [boolean, current, picked.length, text]);

  const check = useCallback(() => {
    if (!canCheck) {
      return;
    }
    setChecked(true);
  }, [canCheck]);

  const next = useCallback(() => {
    const wasCorrect = isCorrect;
    const nextCorrect = wasCorrect ? correctCount + 1 : correctCount;

    if (position + 1 < order.length) {
      setCorrectCount(nextCorrect);
      setPosition(position + 1);
      setPicked([]);
      setText('');
      setBoolean(null);
      setChecked(false);
      return;
    }

    const finalCorrect = nextCorrect;
    const finalScore = order.length
      ? Math.round((finalCorrect / order.length) * 100)
      : 0;
    const didPass = finalScore >= passMark;

    setCorrectCount(finalCorrect);
    setScore(finalScore);
    setPassed(didPass);
    setPhase('result');
    recordAttempt(moduleId, finalScore, passMark);
  }, [correctCount, isCorrect, moduleId, order.length, passMark, position]);

  const topicHref = useCallback(
    (topicRef: string) => {
      // The assessment lives beside its topics, so the topic is a sibling.
      const here = location.pathname.replace(/\/[^/]*\/?$/, '');
      return `${here}/${topicSlug(topicRef)}`;
    },
    [location.pathname],
  );

  if (total === 0) {
    return (
      <div className="quiz quiz--empty">
        <p>This assessment has no questions yet.</p>
      </div>
    );
  }

  if (phase === 'intro') {
    return (
      <section className="quiz" aria-label={quiz.title}>
        <header className="quiz__header">
          <h3 className="quiz__title">{quiz.title}</h3>
          <p className="quiz__meta">
            {total} question{total === 1 ? '' : 's'} · pass mark {passMark}%
          </p>
        </header>

        {progress && progress.attempts > 0 && (
          <p className="quiz__previous">
            {progress.completed ? (
              <>
                You have passed this module — best score{' '}
                <strong>{progress.bestScore}%</strong>.
              </>
            ) : (
              <>
                Previous best <strong>{progress.bestScore}%</strong> across{' '}
                {progress.attempts} attempt
                {progress.attempts === 1 ? '' : 's'}.
              </>
            )}
          </p>
        )}

        <p className="quiz__note">
          Questions are shuffled on every attempt. Progress is kept in this
          browser only.
        </p>

        <button type="button" className="quiz__button" onClick={begin}>
          {progress?.attempts ? 'Retake the assessment' : 'Begin the assessment'}
        </button>
      </section>
    );
  }

  if (phase === 'result') {
    return (
      <section className="quiz" aria-label={quiz.title}>
        <header className="quiz__header">
          <h3 className="quiz__title">{quiz.title}</h3>
        </header>

        <div
          className={`quiz__score ${passed ? 'quiz__score--pass' : 'quiz__score--fail'}`}
        >
          <p className="quiz__score-value">{score}%</p>
          <p className="quiz__score-note">
            {correctCount} of {total} correct — {passed ? 'passed' : 'not passed yet'}
            {passed ? ', and the module is marked complete.' : `. The pass mark is ${passMark}%.`}
          </p>
        </div>

        {progress && (
          <p className="quiz__previous">
            Best score <strong>{progress.bestScore}%</strong> across{' '}
            {progress.attempts} attempt{progress.attempts === 1 ? '' : 's'}.
          </p>
        )}

        <button type="button" className="quiz__button" onClick={begin}>
          Try again
        </button>
      </section>
    );
  }

  if (!current) {
    return null;
  }

  const {question, options, answer} = current;
  const isMulti = question.type === 'multi';
  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  const toggleOption = (index: number) => {
    if (checked) {
      return;
    }
    setPicked((currentPicked) => {
      if (isMulti) {
        return currentPicked.includes(index)
          ? currentPicked.filter((value) => value !== index)
          : [...currentPicked, index];
      }
      return [index];
    });
  };

  return (
    <section className="quiz" aria-label={quiz.title}>
      <header className="quiz__header">
        <h3 className="quiz__title">{quiz.title}</h3>
        <p className="quiz__meta">
          Question {position + 1} of {total}
        </p>
      </header>

      <div
        className="quiz__progress"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={position + 1}
        aria-label="Assessment progress"
      >
        <span
          className="quiz__progress-fill"
          style={{width: `${((position + 1) / total) * 100}%`}}
        />
      </div>

      <p className="quiz__question">{question.question}</p>

      {question.type === 'code-output' && question.code && (
        <pre className="quiz__code">
          <code>{question.code}</code>
        </pre>
      )}

      {question.type === 'sql-fill' && question.template && (
        <pre className="quiz__code">
          <code>{question.template}</code>
        </pre>
      )}

      {(question.type === 'mcq' || question.type === 'multi') && (
        <ul className="quiz__options">
          {options.map((option, index) => {
            const isPicked = picked.includes(index);
            const isAnswer = Array.isArray(answer)
              ? answer.includes(index)
              : answer === index;
            const state = !checked
              ? ''
              : isAnswer
                ? ' quiz__option--right'
                : isPicked
                  ? ' quiz__option--wrong'
                  : '';
            return (
              <li key={`${question.id}-${index}`}>
                <label className={`quiz__option${state}`}>
                  <input
                    type={isMulti ? 'checkbox' : 'radio'}
                    name={`${question.id}-option`}
                    checked={isPicked}
                    disabled={checked}
                    onChange={() => toggleOption(index)}
                  />
                  <span className="quiz__option-letter">
                    {optionLetters[index] ?? index + 1}
                  </span>
                  <span className="quiz__option-text">{option}</span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {question.type === 'truefalse' && (
        <ul className="quiz__options">
          {[true, false].map((value) => {
            const isPicked = boolean === value;
            const isAnswer = answer === value;
            const state = !checked
              ? ''
              : isAnswer
                ? ' quiz__option--right'
                : isPicked
                  ? ' quiz__option--wrong'
                  : '';
            return (
              <li key={String(value)}>
                <label className={`quiz__option${state}`}>
                  <input
                    type="radio"
                    name={`${question.id}-boolean`}
                    checked={isPicked}
                    disabled={checked}
                    onChange={() => setBoolean(value)}
                  />
                  <span className="quiz__option-text">
                    {value ? 'True' : 'False'}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {(question.type === 'code-output' || question.type === 'sql-fill') && (
        <div className="quiz__input">
          <label className="quiz__input-label" htmlFor={`${question.id}-answer`}>
            {question.type === 'sql-fill'
              ? 'Fill the blank'
              : 'What does it print?'}
          </label>
          <input
            id={`${question.id}-answer`}
            type="text"
            className="quiz__input-field"
            value={text}
            disabled={checked}
            onChange={(event) => setText(event.target.value)}
            placeholder={question.type === 'sql-fill' ? 'your answer' : 'the output'}
          />
        </div>
      )}

      {checked && (
        <div
          className={`quiz__feedback ${isCorrect ? 'quiz__feedback--right' : 'quiz__feedback--wrong'}`}
          role="status"
        >
          <p className="quiz__verdict">
            {isCorrect ? 'Correct.' : 'Not quite.'}
          </p>
          {question.explanation && (
            <p className="quiz__explanation">{question.explanation}</p>
          )}
          {!isCorrect && question.topicRef && (
            <p className="quiz__topic-ref">
              <a href={topicHref(question.topicRef)}>
                Re-read this topic
                <span className="quiz__topic-ref-name">
                  {topicSlug(question.topicRef)}
                </span>
              </a>
            </p>
          )}
        </div>
      )}

      <div className="quiz__actions">
        {!checked ? (
          <button
            type="button"
            className="quiz__button"
            onClick={check}
            disabled={!canCheck}
          >
            Check answer
          </button>
        ) : (
          <button type="button" className="quiz__button" onClick={next}>
            {position + 1 < total ? 'Next question' : 'See results'}
          </button>
        )}
      </div>
    </section>
  );
}
