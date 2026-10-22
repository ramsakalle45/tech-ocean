#!/usr/bin/env node
/**
 * Validates every quiz.json in docs/.
 *
 * A quiz with a broken answer index or a missing explanation is worse than
 * no quiz at all, so this fails the build rather than the reader's
 * afternoon. Run it with `npm run validate:quizzes`.
 *
 * Usage: node scripts/validate-quizzes.js [docs-dir]
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.resolve(ROOT, process.argv[2] ?? 'docs');

const QUESTION_TYPES = new Set([
  'mcq',
  'multi',
  'truefalse',
  'code-output',
  'sql-fill',
]);

/** Every quiz.json under the docs folder. */
function findQuizzes(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...findQuizzes(full));
    } else if (entry.name === 'quiz.json') {
      found.push(full);
    }
  }
  return found;
}

function isString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateQuiz(file, quiz) {
  const problems = [];
  const where = path.relative(ROOT, file);
  const moduleDir = path.dirname(file);

  if (typeof quiz !== 'object' || quiz === null || Array.isArray(quiz)) {
    return [`${where}: the file must contain a JSON object`];
  }

  if (!isString(quiz.title)) {
    problems.push(`${where}: "title" must be a non-empty string`);
  }

  if (quiz.passMark !== undefined) {
    if (
      typeof quiz.passMark !== 'number' ||
      !Number.isFinite(quiz.passMark) ||
      quiz.passMark < 0 ||
      quiz.passMark > 100
    ) {
      problems.push(`${where}: "passMark" must be a number between 0 and 100`);
    }
  }

  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    problems.push(`${where}: "questions" must be a non-empty array`);
    return problems;
  }

  const seenIds = new Set();

  quiz.questions.forEach((question, index) => {
    const at = `${where}: question ${index + 1}`;

    if (typeof question !== 'object' || question === null) {
      problems.push(`${at} must be an object`);
      return;
    }

    if (!isString(question.id)) {
      problems.push(`${at} needs a non-empty "id"`);
    } else if (seenIds.has(question.id)) {
      problems.push(`${at} repeats the id "${question.id}"`);
    } else {
      seenIds.add(question.id);
    }

    if (!QUESTION_TYPES.has(question.type)) {
      problems.push(
        `${at} has an unknown type "${question.type}" — expected one of ${[...QUESTION_TYPES].join(', ')}`,
      );
      return;
    }

    if (!isString(question.question)) {
      problems.push(`${at} needs a non-empty "question"`);
    }

    if (!isString(question.explanation)) {
      problems.push(`${at} needs a non-empty "explanation"`);
    }

    const {options, answer} = question;

    switch (question.type) {
      case 'mcq': {
        if (!Array.isArray(options) || options.length < 2) {
          problems.push(`${at} needs at least two "options"`);
          break;
        }
        if (options.some((option) => !isString(option))) {
          problems.push(`${at} has an empty "option"`);
        }
        if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) {
          problems.push(
            `${at} has the answer ${JSON.stringify(answer)}, which is not an index of its options`,
          );
        }
        break;
      }

      case 'multi': {
        if (!Array.isArray(options) || options.length < 2) {
          problems.push(`${at} needs at least two "options"`);
          break;
        }
        if (options.some((option) => !isString(option))) {
          problems.push(`${at} has an empty "option"`);
        }
        if (!Array.isArray(answer) || answer.length === 0) {
          problems.push(`${at} needs an array of correct option indices`);
          break;
        }
        const unique = new Set(answer);
        if (unique.size !== answer.length) {
          problems.push(`${at} lists the same option twice`);
        }
        for (const index of answer) {
          if (!Number.isInteger(index) || index < 0 || index >= options.length) {
            problems.push(
              `${at} has the answer index ${JSON.stringify(index)}, which is out of range`,
            );
          }
        }
        break;
      }

      case 'truefalse': {
        if (typeof answer !== 'boolean') {
          problems.push(`${at} needs a boolean "answer"`);
        }
        break;
      }

      case 'code-output': {
        if (!isString(answer)) {
          problems.push(`${at} needs the expected output as a string`);
        }
        if (!isString(question.code)) {
          problems.push(`${at} needs the "code" to run`);
        }
        break;
      }

      case 'sql-fill': {
        if (!isString(answer)) {
          problems.push(`${at} needs the expected answer as a string`);
        }
        if (!isString(question.template)) {
          problems.push(`${at} needs the "template" with the blank in it`);
        }
        break;
      }

      default:
        break;
    }

    if (question.topicRef !== undefined) {
      if (!isString(question.topicRef)) {
        problems.push(`${at} has a "topicRef" that is not a string`);
      } else {
        const stem = question.topicRef.replace(/\.mdx$/, '');
        const candidates = [
          path.join(moduleDir, `${stem}.mdx`),
          path.join(moduleDir, `${stem.replace(/^\d+-/, '')}.mdx`),
        ];
        if (!candidates.some((candidate) => fs.existsSync(candidate))) {
          problems.push(
            `${at} points at the topic "${question.topicRef}", which does not exist next to the quiz`,
          );
        }
      }
    }
  });

  return problems;
}

function main() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`[quizzes] No docs folder at ${DOCS_DIR}`);
    process.exit(1);
  }

  const files = findQuizzes(DOCS_DIR).sort();
  const problems = [];

  for (const file of files) {
    let quiz;
    try {
      quiz = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
      problems.push(`${path.relative(ROOT, file)}: is not valid JSON — ${error.message}`);
      continue;
    }
    problems.push(...validateQuiz(file, quiz));
  }

  if (problems.length > 0) {
    console.error(`[quizzes] ${problems.length} problem(s) found:\n`);
    for (const problem of problems) {
      console.error(`  ✗ ${problem}`);
    }
    console.error('');
    process.exit(1);
  }

  const total = files.reduce((count, file) => {
    const quiz = JSON.parse(fs.readFileSync(file, 'utf8'));
    return count + (quiz.questions?.length ?? 0);
  }, 0);

  console.log(
    `[quizzes] ${files.length} quiz file(s), ${total} question(s) — all valid`,
  );
}

main();
