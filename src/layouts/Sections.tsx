// SPDX-FileCopyrightText: 2021 iteratec GmbH
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";

const Sections = ({ children }: { children: React.ReactNode }) => (
  <div>
    {React.Children.map(children, (child, idx) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: idx % 2 == 1 ? "#E2E2E2" : "white",
          padding: "2rem 4rem",
        }}
      >
        <div style={{ maxWidth: "1140px" }}>{child}</div>
      </div>
    ))}
  </div>
);
export default Sections;
