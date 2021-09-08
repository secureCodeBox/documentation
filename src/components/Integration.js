// SPDX-FileCopyrightText: 2021 iteratec GmbH
//
// SPDX-License-Identifier: Apache-2.0

import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useThemeContext from "@theme/hooks/useThemeContext";
import clsx from "clsx";
import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.module.scss";

export default function Integration({ imageUrl, title, usecase, type, path }) {
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
