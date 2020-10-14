---
title: "CascadingRule"
---

## Specification (Spec)

CascadingRules are Custom Resource Definitions (CRD's) used to define how Scans can be started automatically based on the results of previous Scans. This lets you run large exploratory scans and automatically start more in depth scans on the targets found by the initial scans.

You can find a more concrete example on how this works in the [network scanning how-to](/docs/how-tos/scanning-networks).

### Matches (Required)

### Matches.AnyOf (Required)

The `matches.anyOf` fields consists of a list of objects / hashes.
These objects are compared using a partial deep comparison, meaning that all field of the object must exactly match the finding.

If multiple anyOf rules are specified at least one must match the finding. 
If multiple rules are matching, the CascadingRule will still only create one scan.

### ScanSpec (Required)

Contains the [spec of the Scan](/docs/api/crds/scan#specification-spec) which is supposed to be started of the a finding matches the CascadingRule.

The `scanType` and the entries in the `parameters` list  can use [mustache](https://mustache.github.io/mustache.5.html) templates to refer to fields of the finding the cascadingRule has been applied to. The finding is passed in directly into the mustache templating call, so that fields of the findings can be directly referenced. E.g. the location can be directly referred to by: `{{location}}`.

For convenience a helper object has been added to the mustache call under the `$` shorthand.

This helper object has the following attributes:

- `$.hostOrIP` returns either the hostname (if available) or the hostname of the current finding.

## Example

```yaml
apiVersion: "cascading.securecodebox.io/v1"
kind: CascadingRule
metadata:
  name: "zap-http"
  labels:
    securecodebox.io/invasive: non-invasive
    securecodebox.io/intensive: medium
spec:
  matches:
    anyOf:
      - category: "Open Port"
        attributes:
          service: http
          state: open
      - category: "Open Port"
        attributes:
          service: https
          state: open
  scanSpec:
    scanType: "zap-baseline"
    parameters: ["-t", "{{attributes.service}}://{{$.hostOrIP}}"]
```
