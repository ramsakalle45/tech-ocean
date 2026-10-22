import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const subjects = [
  {name: 'Python', to: '/docs/python', blurb: 'Syntax to the GIL'},
  {name: 'SQL', to: '/docs/sql', blurb: 'Queries to query plans'},
  {name: 'GenAI', to: '/docs/genai', blurb: 'Tokens to production'},
  {name: 'System Design', to: '/docs/system-design', blurb: 'Scaling to case studies'},
];

/**
 * Phase 1 placeholder cover. Phase 2 replaces this with the leather-and-gold
 * book cover described in the blueprint.
 */
export default function Home(): ReactNode {
  return (
    <Layout
      title="Ram's Dev Ocean"
      description="A free, open-source book on Python, SQL, GenAI and System Design, with an assessment at the end of every module.">
      <main className={styles.cover}>
        <p className={styles.kicker}>An open book</p>
        <h1 className={styles.title}>Ram's Dev Ocean</h1>
        <p className={styles.tagline}>
          Python, SQL, GenAI and System Design — from basics to advanced, with a
          short assessment at the end of every module.
        </p>

        <Link className={styles.cta} to="/docs/intro">
          Start reading
        </Link>

        <ul className={styles.subjects}>
          {subjects.map((s) => (
            <li key={s.name}>
              <Link to={s.to}>
                <strong>{s.name}</strong>
                <span>{s.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </Layout>
  );
}
