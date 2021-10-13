---
# SPDX-FileCopyrightText: 2021 iteratec GmbH
#
# SPDX-License-Identifier: Apache-2.0

title: "Scan"
---

The Scan Custom Resource Definition (CRD) lets you define how a specific scan should be configured.
The secureCodeBox Operator will then use this specification to execute the scan.

## Specification (Spec)

### ScanType (Required)

The `scanType` references the **name** of a [ScanType Custom Resource](/docs/api/crds/scan-type/).

### Parameters (Required)

`parameters` is a string array of command line flags which are passed to the scanner.

These usually contain scanner specific configurations and target specification.

### Env (Optional)

`env` lets you pass in custom environment variables to the scan container.
This can be useful to pass in secret values like login credentials scanner require without having to define them in plain text.

Env has the same API as "env" property on Kubernetes Pods. 

See:
- [Documentation](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/)
- [API Reference](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#envvar-v1-core)

### Cascades (Optional)

`cascades` let you start new scans based on the results of the current scan.

The cascades config in the scans spec contains [Kubernetes Label Selectors](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#labelselector-v1-meta) which allow you to select which [CascadingRule](https://docs.securecodebox.io/docs/api/crds/cascading-rule) are allowed to be used by the cascading logic.

Furthermore, in the cascade config you can specify whether cascading scan should inherit the parent's labels (`inheritLabels`) and annotations (`inheritAnnotations`). If not specified, the options will be considered as `true`.

To use cascades you'll need to have the [CombinedScan hook](https://docs.securecodebox.io/docs/hooks/cascading-scans) installed.

For an example on how they can be used see the [Scanning Networks HowTo](https://docs.securecodebox.io/docs/how-tos/scanning-networks)

## Metadata

Metadata is a standard field on Kubernetes resources. It contains multiple relevant fields, e.g. the name of the resource, its namespace and a `creationTimestamp` of the resource. See more on the [Kubernetes Docs]https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/) and the [Kubernetes API Reference](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta))

## Status

Defines the observed state of a Scan. This will be filled by Kubernetes.
It contains (see: [Go Type ScanStatus](https://github.com/secureCodeBox/secureCodeBox/blob/main/operator/apis/execution/v1/scan_types.go#L49))

* `State`: State of the scan (See: [secureCodeBox | ScanControler](https://github.com/secureCodeBox/secureCodeBox/blob/main/operator/controllers/execution/scans/scan_controller.go#L105))
* `FinishedAt`: Time when scan, parsers and hooks for this scan are marked as 'Done'
* `ErrorDescription`: Description of an Error (if there is one)
* `RawResultType`: Determines which kind of ParseDefinition will be used to turn the raw results of the scanner into findings
* `RawResultFile`: Filename of the result file of the scanner. e.g. `nmap-result.xml`
* `FindingDownloadLink`: Link to download the finding json file from. Valid for 7 days
* `RawResultDownloadLink`: RawResultDownloadLink link to download the raw result file from. Valid for 7 days
* `Findings`: FindingStats (See [Go Type FindingStats](https://github.com/secureCodeBox/secureCodeBox/blob/main/operator/apis/execution/v1/scan_types.go#L89))
* `ReadAndWriteHookStatus`: Status of the Read and Write Hooks

## Example

```yaml
apiVersion: "execution.securecodebox.io/v1"
kind: Scan
status: # Set during runtime. Do not edit via values.yaml etc. 
metadata:
  name: "nmap-scanme.nmap.org"
spec:
  scanType: "nmap"
  parameters:
    # Use nmap's service detection feature
    - "-sV"
    - scanme.nmap.org
  env:
    - name: TEST_ENV
      valueFrom:
        secretKeyRef:
          key: secret-name
          name: zap-customer-credentials
    - name: GREETING
      value: "Hello from the secureCodeBox :D"
  cascades:
    inheritLabels: false
    inheritAnnotations: true
    matchLabels:
      securecodebox.io/intensive: light
    matchExpression:
      key: "securecodebox.io/invasive"
      operator: In
      values: [non-invasive, invasive]
```
