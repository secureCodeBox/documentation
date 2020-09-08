import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';
import styles from './styles.module.css';
import {Scanners, PersistenceProviders, Hooks} from './integrations'

function Integration({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('docs/user')}
            >
              User Guide
            </Link>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('docs/developer')}
            >
              Developer Guide
            </Link>
          </div>
        </div>
      </header>
      <main>
        {/* {Integrations.hooks && Integrations.hooks.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {Integrations.hooks.map((props, idx) => (
                  <Integration key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )} */}
      </main>
    </Layout>
  );
}

export default Home;
