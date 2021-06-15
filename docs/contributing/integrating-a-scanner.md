---
# SPDX-FileCopyrightText: 2021 iteratec GmbH
#
# SPDX-License-Identifier: Apache-2.0

title: "Overview"
---

In the *secureCodeBox* we created new *Custom Resource Definitions* (CRD) for Kubernetes to manage scanners (*ScanType*) and hooks (see [Custom Resource Definitions](/docs/api/crds)).
To add a new Scanner you need to add a new *ScanType* (see [ScanType](/docs/api/crds/scan-type)) and a parser for its results.

The directory structure of a scanner Helm Chart will look something like this:

```bash
scanners/nmap
├── cascading-rules
│   └── ...
├── Chart.yaml
├── examples
│   ├── demo-app-ssh
│   │   ├── findings.yaml
│   │   ├── nmap-results.xml
│   │   └── scan.yaml
│   └── ...
├── parser
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── parser.js
│   ├── parser.test.js
│   └── __testFiles__
│       └── ...
├── README.md
├── README.md.gotmpl
├── scanner
│   ├── wrapper.sh
│   └── Dockerfile
├── templates
│   ├── cascading-rules.yaml
│   ├── nmap-parse-definition.yaml
│   └── nmap-scan-type.yaml
└── values.yaml
```

To create a new Helm Chart for your scanner you can use the following command (replace *new-scanner* with the name of the scanner):

```bash
helm create new-scanner
```

This command will create a new directory named *new-scanner* and some template files provided by `helm` to simplify the creation of Helm Charts (see [Helm | Getting Started](https://helm.sh/docs/chart_template_guide/getting_started/)).

The following pages describe the purpose of all files and how to configure them.
