import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const volumes = [
  {
    name: 'Python',
    to: '/docs/python',
    blurb: 'Syntax to the GIL',
    detail: 'Basics · Intermediate · Advanced · Interview',
  },
  {
    name: 'SQL',
    to: '/docs/sql',
    blurb: 'Queries to query plans',
    detail: 'Basics · Intermediate · Advanced · Interview',
  },
  {
    name: 'GenAI',
    to: '/docs/genai',
    blurb: 'Tokens to production',
    detail: 'Foundations · LLMs · RAG · Production · Interview',
  },
  {
    name: 'System Design',
    to: '/docs/system-design',
    blurb: 'Scaling to case studies',
    detail: 'Fundamentals · Building Blocks · Case Studies · Interview',
  },
];

/** The book cover. */
export default function Home(): ReactNode {
  return (
    <Layout
      title="Ram's Dev Ocean"
      description="A free, open-source book on Python, SQL, GenAI and System Design, with an assessment at the end of every module.">
      <main className={styles.cover}>
        <div className={styles.coverInner}>
          <p className={styles.kicker}>An open book</p>

          <h1 className={styles.title}>
            <span className={styles.titleMain}>Ram&rsquo;s</span>
            <span className={styles.titleMain}>Dev Ocean</span>
          </h1>

          <div className={styles.rule} aria-hidden="true" />

          <p className={styles.tagline}>
            Python, SQL, GenAI and System Design — from the very beginning to
            interview level, with a short assessment at the end of every
            module.
          </p>

          <ul className={styles.shelf}>
            {volumes.map((volume) => (
              <li key={volume.name} className={styles.slot}>
                <Link to={volume.to} className={styles.spine}>
                  <span className={styles.spineBand} aria-hidden="true" />
                  <span className={styles.spineTitle}>{volume.name}</span>
                </Link>
                <p className={styles.spineBlurb}>{volume.blurb}</p>
                <p className={styles.spineDetail}>{volume.detail}</p>
              </li>
            ))}
          </ul>

          <p className={styles.actions}>
            <Link className={styles.cta} to="/docs/intro">
              Begin reading
            </Link>
            <Link className={styles.ctaSecondary} to="/docs/contributing">
              Contribute a chapter
            </Link>
          </p>

          <p className={styles.colophon}>
            Free and open source · MIT for code · CC BY-SA 4.0 for content
          </p>
        </div>
      </main>
    </Layout>
  );
}
