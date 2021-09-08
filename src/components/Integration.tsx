// SPDX-FileCopyrightText: 2021 iteratec GmbH
//
// SPDX-License-Identifier: Apache-2.0

import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useThemeContext from "@theme/hooks/useThemeContext";
import clsx from "clsx";
import React from "react";

const igStyles = require("../css/integration.module.scss");
const styles = require("../pages/styles.module.scss");

export default function Integration({
  imageUrl,
  title,
  usecase,
  type,
  path,
}: {
  imageUrl?: string;
  title: string;
  usecase: string;
  type?: string;
  path: string;
}) {
  const { isDarkTheme } = useThemeContext();

  const imgUrl = useBaseUrl(imageUrl);

  return (
    <Link
      className={clsx(
        igStyles.integration,
        isDarkTheme ? styles.dark : styles.light
      )}
      to={path}
    >
      {imgUrl && (
        <div className="text--center">
          <img className={igStyles.integrationImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>
        {title} {type ? `(${type})` : ""}
      </h3>
      <p>{usecase}</p>
    </Link>
  );
}
