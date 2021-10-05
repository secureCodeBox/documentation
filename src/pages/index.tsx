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
import FlipCard from "../components/FlipCard";
import Integration from "../components/Integration";
import RoleCard from "../components/RoleCard";
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

//* In order to use useThemeContext() on the homepage, the main content is separated from the default export due to how "@theme/Layout" works
function HomePage() {
  const { isDarkTheme } = useThemeContext();

  return (
    <>
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
            {content.heroBanner.button}
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
            <div className="row margin-bottom--lg">
              {content.automatedTesting.cards.map((card, idx) => (
                <div
                  className={clsx("col", styles.defaultMarginBottom)}
                  key={`flipcard no${idx}`}
                >
                  <FlipCard {...card} />
                </div>
              ))}
            </div>
          </Section>

          <Section
            title={content.useCases.title}
            subtitle={content.useCases.description}
          >
            <Accordion items={content.useCases.items} />
          </Section>

          <Section
            title={content.goToSolution.title}
            subtitle={content.goToSolution.description}
          >
            <div className="row">
              <div className="col padding-left--xl padding-right--xl margin-bottom--lg">
                <img src={content.goToSolution.image} />
              </div>
              <div className={clsx("col", styles.goToSolutionBulletList)}>
                <ul>
                  {content.goToSolution.list.map((item, i) => (
                    <li key={`bullet nr${i}`}>
                      <label>{item.label}</label>
                      <div>{item.content}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
            subtitle={
              <div>
                {content.about.description}{" "}
                <a href="https://www.iteratec.com/">iteratec</a>.
              </div>
            }
          >
            <div className="row">
              <div className="col col--4">
                <p>{content.about.question}</p>
                <div>
                  <strong>{content.about.buttonHeader}</strong>
                </div>
                <a
                  className="button button--outline button--primary button--md margin-top--lg  margin-bottom--xl"
                  href={`mailto:${
                    content.about.mail.recipient
                  }?subject=${encodeURI(
                    content.about.mail.subject
                  )}&body=${encodeURI(content.about.mail.message)}`}
                >
                  {content.about.button}
                </a>
              </div>
              {content.about.roles.map((role, i) => (
                <div
                  className={clsx("col", styles.defaultMarginBottom)}
                  key={`role nr${i}`}
                >
                  <RoleCard {...role} />
                </div>
              ))}
            </div>
          </Section>

          <Section title={content.sponsors.title} alignment="center">
            <div className="row margin-bottom--lg">
              {content.sponsors.logos.map((item, i) => (
                <div
                  className={clsx(
                    "col",
                    styles.sponsor,
                    styles.defaultMarginBottom
                  )}
                  key={`sponsor nr${i}`}
                >
                  <a href={item.link} target="_blank">
                    <img src={isDarkTheme ? item.srcDark : item.srcLight} />
                  </a>
                </div>
              ))}
            </div>
          </Section>
        </Sections>
      </main>
    </>
  );
}

export default function Main() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description={siteConfig.tagline}
    >
      <HomePage />
    </Layout>
  );
}
