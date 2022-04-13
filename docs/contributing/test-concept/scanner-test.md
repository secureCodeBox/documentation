---
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

title: "Scanner Testing"
sidebar_position: 3
---
## Scanner-Test

There are two type of tests: integration-tests and unit tests for the parser.

### Unit Tests for Parser

Each scanner has a parser and each parser has a unit test file. The unit test file is named parser.test.js. In this file the results from parser.js and the folder _snapshots_ are compared. If they are the same, the unit test was successful. A unit test can look like this:

```js
test("parser parses large json result without vulnerable extensions successfully", async () => {
  const fileContent = await readFile(
    __dirname + "/__testFiles__/localhost.json",
    {
      encoding: "utf8",
    }
  );
  const findings = await parse(JSON.parse(fileContent));
  await expect(validateParser(findings)).resolves.toBeUndefined();
  expect(findings).toMatchSnapshot();
});

```

### How to Run a Unit Test

To run a unit-test it suffices to run
```bash
make unit-tests
```
in the scanner directory.

### Integration Tests

Each scanner has a folder with integration tests. For the integration tests we use the function scan. The functions expects as parameter: name of the scanner, scan type, required parameters for the scan and the timeout time.

An integration test for the scanner amass looks like this:

```js
test(
  "amass should find at least 20 subdomains",
  async () => {
    const { count } = await scan(
      "amass-scanner-dummy-scan",
      "amass",
      ["-passive", "-noalts", "-norecursive", "-d", "owasp.org"],
      180
    );
    expect(count).toBeGreaterThanOrEqual(20);
  },
  6 * 60 * 1000
);
```

### How to Run an Integration Test

To run the test it suffices to run:
```bash
make test
```
All previous tests will be deleted and the current test will be run on a clean slate.

