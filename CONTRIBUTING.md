# Contributing

Thanks for helping. Full guidance lives in [`docs/contributing.mdx`](docs/contributing.mdx)
and is published at `/docs/contributing` on the site.

The short version:

1. Fork the repository and create a branch.
2. Add or edit a file under `docs/`.
3. Run `npm run build` — broken internal links fail the build.
4. Run `npm run validate:quizzes` — a malformed quiz fails too.
5. Open a pull request explaining what changed and why.

## Starting something new

Copy a template rather than writing from scratch:

| Template | What it is for |
| --- | --- |
| `templates/topic.mdx` | A lesson page |
| `templates/assessment.mdx` | A module's assessment page |
| `templates/quiz.json` | The questions for that assessment |

A new topic is one `.mdx` file named `NN-something.mdx` inside the module
folder. The two-digit prefix decides the order, and Docusaurus strips it from
the URL.

## Writing a quiz

A module's questions live in `quiz.json` next to its assessment page:

```json
{
  "title": "Decorators and Generators",
  "passMark": 70,
  "questions": [
    {
      "id": "py-decorators-1",
      "type": "mcq",
      "question": "What does @functools.wraps do on a wrapper function?",
      "options": ["…", "…", "…", "…"],
      "answer": 1,
      "explanation": "Why the right answer is right.",
      "topicRef": "01-decorators"
    }
  ]
}
```

Five question types are supported: `mcq`, `multi`, `truefalse`,
`code-output` and `sql-fill`. Every question needs an `explanation` — the
validator rejects one without it. `topicRef` points at a topic file in the
same folder, and the validator checks it exists.

## Rules that matter

- **One idea per topic.** 5 to 15 minutes of reading.
- **Never deeper than** `subject / level / module / topic`.
- **Two-digit prefixes** control ordering.
- **Every code example must run** as written.
- **Do not copy text** from another site — explain it in your own words.
- **No React needed** to add a topic.

## Commit style

Conventional commits are preferred:

```
docs(python): explain decorator evaluation order
fix(sql): correct window frame example
feat(quiz): support multiple correct answers
```

## Licensing

By contributing you agree that code is released under MIT and written content
under CC BY-SA 4.0.
