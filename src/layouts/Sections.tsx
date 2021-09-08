// SPDX-FileCopyrightText: 2021 iteratec GmbH
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";

const Sections = ({ children }: { children: React.ReactNode }) => (
  <div>
    {React.Children.map(children, (child, idx) => (
      <div
        style={{
          backgroundColor: idx % 2 == 0 ? "#E2E2E2" : "white",
          padding: "0.5em 3em",
        }}
      >
        {child}
      </div>
    ))}
  </div>
);
export default Sections;
