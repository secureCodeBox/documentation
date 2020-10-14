---
title: "ParseDefinition"
---

ParseDefinitions are Custom Resource Definitions (CRD's) used to describe to the secureCodeBox how it can convert a raw finding report (e.g. XML report from nmap) into the generic [secureCodeBox finding format](/docs/api/finding).

ParseDefinitions are generally packaged together with a [ScanType](https://docs.securecodebox.io/docs/crds/scan-type).
A scanType will reference the **name** of a *ParseDefinition* via the [extractResults.type field](/docs/api/crds/scan-type#extractresultstype-required).

## Specification (Spec)

### Image (Required)

`image` is the reference to the parser container image which can transform the raw scan report into findings.

To see how to write parsers and package them into images, checkout the [documentation page on integrating new scanners](docs/contributing/integrating-a-scanner).

### ImagePullSecrets (Optional)

`imagePullSecrets` can be used to integrate private parser images.

## Example

```yaml
apiVersion: execution.securecodebox.io/v1
kind: ParseDefinition
metadata:
  name: zap-json
spec:
  image: docker.io/securecodebox/parser-zap
```
