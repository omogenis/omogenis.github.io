import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">Ομογενείς στην πρώην Σοβιετική Ένωση</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/petition">
            Αναφορά προς την Ελληνική Κυβέρνηση
          </Link>
          </div>
        <p className="hero__subtitle">Греческие соотечественники в странах бывшего Советсткого союза</p>
          <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/petition">
            Петиция к Правительству Греции 
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Сайт соотечественников бывшего Советсткого союза">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
