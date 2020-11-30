---
title: hook.js
---

This File will contain the actual code of your hook.
For JavaScript, we provide a *hook-sdk*.
This *hook-sdk* serves as helper for retrieving findings and as entrypoint for the Dockerfile.

The only function required to be created is the `handle()` function.
This function is called by the *hook-sdk* after scans are finished.
As parameters for `handle()` the *hook-sdk* provides the following:
- [getRawResults()](#getrawresults)
- [getFindings()](#getfindings)
- [updateRawResults()](#updaterawresults)
- [updateFindings()](#updatefindings)
- [scan](#scan)

## getRawResults()

This callback function will provide all raw results to the hook.

## getFindings()

This callback function will provide all findings to the hook as array of findings.

## updateRawResults()

This callback function will enable you to publish desired changes to raw results.

:::caution
If you make changes to some findings you will have to call `updateFindings()` with ***ALL*** findings not just with the ones that have changed or unchanged findings will get lost!
:::

## updateFindings()

This callback function will enable you to publish desired updates to the findings.

:::caution
If you make changes to some findings you will have to call `updateFindings()` with ***ALL*** findings not just with the ones that have changed or unchanged findings will get lost!
:::

## scan

## Example

This is a basic example for the *generic-webhook*
As you can see this hook defines the `handle()` function but only uses `getFindings()` and `scan` provided by the *hook-sdk*.
This is fine because the other parameters are not needed.

Notice that the `handle()` function has to be exported to use in the *hook-sdk*

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
