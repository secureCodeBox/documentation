---
title: parser (Directory)
---
 
This directory contains the parser for your scanner to transform the results of your scanner to *Findings* (see: [Finding | secureCodeBox](/docs/api/finding)).

## Dockerfile

For the parser we use multi-stage builds (see: [Multi-Stage Builds](https://www.docker.com/blog/multi-stage-builds/))
For our JavaScript Parser SDK the Dockerfile should look like this:

```dockerfile
ARG baseImageTag
FROM node:12-alpine as build
RUN mkdir -p /home/app
WORKDIR /home/app
COPY package.json package-lock.json ./
RUN npm ci --production

FROM securecodebox/parser-sdk-nodejs:${baseImageTag:-latest}
WORKDIR /home/app/parser-wrapper/parser/
COPY --from=build --chown=app:app /home/app/node_modules/ ./node_modules/
COPY --chown=app:app ./parser.js ./parser.js
```

## Parsing SDK

To create a parser for your scanner you will have to execute the following steps in the parser directory:

### Create a new package.json (using `npm init`)

Your `package.json` should look something like this:

```json
{
  "name": "nmap-parser",
  "version": "1.0.0",
  "description": "Parses result files for the type: 'nmap-xml'",
  "main": "",
  "scripts": {},
  "keywords": [],
  "author": "iteratec GmbH",
  "license": "Apache-2.0",
  "dependencies": {
    "lodash": "^4.17.20",
    "xml2js": "^0.4.23"
  },
  "devDependencies": {}
}
```

### Install The Dependencies

If you need additional dependencies you can install them via `npm install`

### Write Your Parser

Create a `parser.js` file and update the parser function of the Parser SDK. A starting point would be:

```javascript
async function parse(fileContent) {
    return [];
}
```
After your scanner has finished, the Parser SDK will retrieve the output results and call your custom parse function `parse`. The SDK expects a finding object as specified in [Finding | secureCodeBox](/docs/api/finding). The `id` field can be omitted, as it will be added by the Parser SDK.

### Write Tests for Your Parser

Please provide some tests for your parser in the `parser.test.js` file.
If you need additional files for your test please save these in the `__testFiles__` directory. Please take a look at [Integration Tests | secureCodeBox](/docs/contributing/integrating-a-scanner/integration-tests) for more information.
