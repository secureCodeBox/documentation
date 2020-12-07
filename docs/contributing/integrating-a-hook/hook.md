---
title: hook.js and hook.test.js
---

## hook.js

This file will contain the actual code of your hook.
For JavaScript, we provide a *hook-sdk*.
This *hook-sdk* serves as helper for retrieving findings and as entrypoint for the Dockerfile.

The only function required to be created is the `handle()` function.
This function is called by the *hook-sdk* after scans are finished.
As parameters for `handle()` the *hook-sdk* provides the following:
- [hook.js](#hookjs)
  - [getRawResults()](#getrawresults)
  - [getFindings()](#getfindings)
  - [updateRawResults()](#updaterawresults)
  - [updateFindings()](#updatefindings)
  - [scan](#scan)
  - [Example](#example)
- [hook.test.js](#hooktestjs)

### getRawResults()

This callback function will provide all raw results to the hook as a promise.

:::caution
When the rawResults are in form of a json file, getRawResults will return the parsed representation of the data, not the json string.
:::

```js
async function handle({
  getRawResults,
}) {
    const result = await getRawResults();
    // outputs string representation of the scan result file
    // e.g. the nmap xml output
    console.log(result);
}
module.exports.handle = handle;
```

### getFindings()

This callback function will provide all findings to the hook as an array of findings wrapped in a promise.

Example:

```js
async function handle({
  getFindings,
}) {
    const findings = await getFindings();
    // logs the findings returned by the parser of the scantype
    console.log(findings);
}
module.exports.handle = handle;
```

### updateRawResults()

This callback function will enable you to publish desired changes to raw results.

:::note
`updateRawResults` is only available in ReadAndWrite hooks.
:::

:::caution
`updateRawResults` operates on the raw results of the scans, this means that the implementation has to be tied to the specific output format of a singular scanner. The updated raw results are also not parsed again by the parsers integrated into the secureCodeBox, making this method only viable if you are using a ReadOnly hook exporting the results into a external system like DefectDojo.

If you want to perform actions on all findings consider using the `updateFindings` hook.
:::

### updateFindings()

This callback function will enable you to publish desired updates to the findings.

:::caution
If you make changes to some findings you will have to call `updateFindings()` with ***ALL*** findings not just with the ones that have changed or unchanged findings will get lost!
:::

### scan

### Example

This is a basic example for the *generic-webhook*
As you can see this hook defines the `handle()` function but only uses `getFindings()` and `scan` provided by the *hook-sdk*.
This is fine because the other parameters are not needed.

:::info
Maybe you notice that in line 5 ENVs are used.
If you also need ENVs or Volumes see INSERT-LINK-HERE.
:::

:::info
Notice that the `handle()` function has to be exported to use in the *hook-sdk*
:::

```js
const axios = require("axios");

async function handle({
  getFindings,
  scan,
  webhookUrl = process.env["WEBHOOK_URL"],
}) {
  const findings = await getFindings();

  console.log(`Sending ${findings.length} findings to ${webhookUrl}`);

  await axios.post(webhookUrl, { scan, findings });
}
module.exports.handle = handle;
```

## hook.test.js

This file should contain some unit test to run against your hook.
