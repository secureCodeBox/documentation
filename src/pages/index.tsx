// SPDX-FileCopyrightText: 2021 iteratec GmbH
//
// SPDX-License-Identifier: Apache-2.0

import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useThemeContext from "@theme/hooks/useThemeContext";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";
import Accordion from "../components/Accoordion";
import Integration from "../components/Integration";
import Section from "../components/Section";
import styles from "../css/styles.module.scss";
import { Hooks, Scanners } from "../integrations";
import content from "../landingpageContent.js";
import Sections from "../layouts/Sections";

const ScannerIntegrations = () => {
  return (
    <div className="container">
      <h3>Scanners</h3>
      <section className={styles.integrations}>
        {Scanners.map((props, idx) => (
          <Integration key={idx} {...props} />
        ))}
      </section>
    </div>
  );
};

const HookIntegrations = () => {
  return (
    <div className="container">
      <h3>Hooks</h3>
      <section className={styles.integrations}>
        {Hooks.map((props, idx) => (
          <Integration key={idx} {...props} />
        ))}
      </section>
    </div>
  );
};

const ThemedImage = ({ lightImgSrc, darkImgSrc }) => {
  const { isDarkTheme } = useThemeContext();
  return <img src={isDarkTheme ? darkImgSrc : lightImgSrc} />;
};

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig } = context;

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={clsx("hero", styles.heroBanner)}>
        <div className="container">
          <h1>{content.heroBanner.title}</h1>
          <p className={styles.description}>{content.heroBanner.description}</p>
          <Link
            className={clsx(
              "button button--outline button--secondary button--lg",
              styles.getStarted
            )}
            to={useBaseUrl("docs/getting-started/installation")}
          >
            Get Started
          </Link>
        </div>
      </header>
      <main>
        <Sections>
          <Section
            title={content.automatedTesting.title}
            subtitle={content.automatedTesting.description}
            alignment="center"
          >
            <div />
          </Section>
          <Section
            title={content.useCases.title}
            subtitle={content.useCases.description}
          >
            <Accordion
              items={[
                {
                  title: content.useCases.dev.title,
                  content: content.useCases.dev.description,
                },
                {
                  title: content.useCases.ops.title,
                  content: content.useCases.ops.description,
                },
                {
                  title: content.useCases.sec.title,
                  content: content.useCases.sec.description,
                },
              ]}
            />
          </Section>
          <Section
            title={content.goToSolution.title}
            subtitle={content.goToSolution.description}
          >
            <div />
          </Section>
          <Section
            title={content.multiScanner.title}
            subtitle={content.multiScanner.description}
            alignment="center"
          >
            <ScannerIntegrations />
            <HookIntegrations />
          </Section>
          <Section
            title={content.about.title}
            subtitle={content.about.description}
          >
            <div />
          </Section>
          <Section title="Sponsors" alignment="center">
            <div className={styles.partners}>
              <ThemedImage
                lightImgSrc="static/img/Logo_Black.svg"
                darkImgSrc="static/img/Logo_White.svg"
              />
              <ThemedImage
                lightImgSrc="static/img/Logo_Black.svg"
                darkImgSrc="static/img/Logo_White.svg"
              />
              <ThemedImage
                lightImgSrc="static/img/Logo_Black.svg"
                darkImgSrc="static/img/Logo_White.svg"
              />
            </div>
          </Section>
        </Sections>
      </main>
    </Layout>
  );
}

export default Home;
