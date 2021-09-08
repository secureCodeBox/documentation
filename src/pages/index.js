// SPDX-FileCopyrightText: 2021 iteratec GmbH
//
// SPDX-License-Identifier: Apache-2.0

import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useThemeContext from "@theme/hooks/useThemeContext";
import Layout from "@theme/Layout";
import clsx from "clsx";
import PropTypes from "prop-types";
import React from "react";
import { Hooks, Scanners } from "../integrations";
import styles from "./styles.module.scss";

function Integration({ imageUrl, title, usecase, type, path }) {
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
        {title} {type ? `(${type})` : ""}
      </h3>
      <p>{usecase}</p>
    </Link>
  );
}

Integration.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  usecase: PropTypes.string.isRequired,
  type: PropTypes.string,
  path: PropTypes.string.isRequired,
};

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <p className={styles.description}>
            secureCodeBox is an automated and scalable open source solution that
            can be used to integrate various security scanners with a simple and
            lightweight interface.
          </p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--outline button--secondary button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("docs/getting-started/installation")}
            >
              Installation
            </Link>
            <Link
              className={clsx(
                "button button--outline button--secondary button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("docs/getting-started/first-scans")}
            >
              Starting Scans
            </Link>
          </div>
        </div>
      </header>
      <main>
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
