---
title: "Scan"
---

The Scan Custom Resource Definition (CRD) lets you define how a speicifc scan should be configured.
The secureCodeBox Operator will then use this specification the execute the scan.

## Specification (Spec)

### ScanType (Required)

The `scanType` references the **name** of a ScanType CRD.

See [ScanType CRD Specification](https://docs.securecodebox.io/docs/crds/scan-type) 

### Parameters (Required)

`parameters` is a string array of command line flags which are passed to the scanner.

These usually contain scanner specifc configurations and target specifcation.

### Env (Optional)

`env` lets you pass in custom environement variables to the scan container.
This can be useful to pass in secret values like login credentials scanner require without having to define them in plain text.

Env has the same api as "env" property on Kubernetes Pods. 

See:
- [Documentation](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/)
- [API Reference](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#envvar-v1-core)

# Cascades (Optional)

`cascades` let you start new scans based on the results of the current scan.

The cascades config in the scans spec contains [Kubernetes Label Selectors](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#labelselector-v1-meta) which allow you to select which allow you to select which [CascadingRule CR's](https://docs.securecodebox.io/docs/crds/cascading-rule) are allowed to be used by the cascading logic.

CascadingScans require to have the CombinedScan hook installed.
See [CascadingScan Hook Documentation](https://docs.securecodebox.io/docs/hooks/Cascading%20Scans)

For an example on how they can be used see the [Scanning Networks HowTo](https://docs.securecodebox.io/docs/how-tos/scanning-networks)

## Example

```yaml
apiVersion: "execution.securecodebox.io/v1"
kind: Scan
metadata:
  name: "nmap-scanme.nmap.org"
spec:
  scanType: "nmap"
  parameters:
    # Use nmaps service detection feature
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
    matchLabels:
      securecodebox.io/intensive: light
    matchExpression:
      key: "securecodebox.io/invasive"
      operator: In
      values: [non-invasive, invasive]
```
