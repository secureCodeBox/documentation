import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useThemeContext from '@theme/hooks/useThemeContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import features from '../features.json';
import { Hooks, PersistenceProviders, Scanners } from '../integrations';
import styles from './styles.module.scss';

function Integration({ imageUrl, title, description, type, path }) {
  const { isDarkTheme } = useThemeContext();

  const imgUrl = useBaseUrl(imageUrl);

  return (
    <Link
      className={clsx(
        styles.integration,
        isDarkTheme ? styles.dark : styles.light
      )}
      to={path}
    >
      {imgUrl && (
        <div className="text--center">
          <img className={styles.integrationImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>
        {title} ({type})
      </h3>
      <p>{description}</p>
    </Link>
  );
}

Integration.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  type: PropTypes.string,
  path: PropTypes.string.isRequired,
};

// eslint-disable-next-line react/prop-types
function Feature({ feature }) {
  const { isDarkTheme } = useThemeContext();

  return (
    <div
      // eslint-disable-next-line react/prop-types
      key={feature.title}
      className={clsx(
        'col-12 col-md-3 col-lg-3 mb-2',
        styles.tooltip,
        isDarkTheme ? styles.dark : styles.light
      )}
      // eslint-disable-next-line react/prop-types
      data-tip={feature.description}
    >
      <div className={clsx(styles.feature, styles.hoverable)}>
        {/* eslint-disable-next-line react/prop-types */}
        {feature.image && (
          <div className={styles.featureImage}>
            {/* eslint-disable-next-line react/prop-types */}
            <img src={feature.image} alt={feature.altText} />
          </div>
        )}
        {/* eslint-disable-next-line react/prop-types */}
        <h3 className={styles.featureTitle}>{feature.title}</h3>
        {/* eslint-disable-next-line react/prop-types */}
        <span className={styles.tooltiptext}>{feature.description}</span>
      </div>
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
          {/* TODO: remove description when marketing page is done */}
          <p className={styles.description}>
            secureCodeBox is an automated and scalable open source solution that
            can be used to integrate various security scanners with a simple and
            lightweight interface.
          </p>
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
        {/* TODO: remove features & feature list when marketing page is done & delete features.json & img/features */}
        <div className="container pt-3 pb-2 pt-md-3 pb-md-3">
          <div className={clsx('row', styles.featureContainer)}>
            {features.map((feature, idx) => (
              <Feature key={idx} feature={feature}></Feature>
            ))}
          </div>
        </div>
        {Scanners && Scanners.length > 0 && (
          <div className="container">
            <h2>Scanners</h2>
            <section className={styles.integrations}>
              {Scanners.map((props, idx) => (
                <Integration key={idx} {...props} />
              ))}
            </section>
          </div>
        )}
        {PersistenceProviders && PersistenceProviders.length > 0 && (
          <div className="container">
            <h2>Persistence Providers</h2>
            <section className={styles.integrations}>
              {PersistenceProviders.map((props, idx) => (
                <Integration key={idx} {...props} />
              ))}
            </section>
          </div>
        )}
        {Hooks && Hooks.length > 0 && (
          <div className="container">
            <h2>Hooks</h2>
            <section className={styles.integrations}>
              {Hooks.map((props, idx) => (
                <Integration key={idx} {...props} />
              ))}
            </section>
          </div>
        )}
      </main>
    </Layout>
  );
}

export default Home;
