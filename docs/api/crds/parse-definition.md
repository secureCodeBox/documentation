---
# SPDX-FileCopyrightText: 2021 iteratec GmbH
#
# SPDX-License-Identifier: Apache-2.0

title: "ParseDefinition"
---

ParseDefinitions are Custom Resource Definitions (CRD's) used to describe to the secureCodeBox how it can convert a raw finding report (e.g. XML report from nmap) into the generic [secureCodeBox finding format](/docs/api/finding).

ParseDefinitions are generally packaged together with a [ScanType](/docs/api/crds/scan-type/).
A scanType will reference the **name** of a *ParseDefinition* via the [extractResults.type field](/docs/api/crds/scan-type#extractresultstype-required).

## Specification (Spec)

### Image (Required)

`image` is the reference to the parser container image which can transform the raw scan report into findings.

To see how to write parsers and package them into images, check out the [documentation page on integrating new scanners](/docs/contributing/integrating-a-scanner).

### ImagePullSecrets (Optional)

`imagePullSecrets` can be used to integrate private parser images.
This uses the kubernetes default [imagePullSecrets structure](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/).

### TTLSecondsAfterFinished (Optional)

`ttlSecondsAfterFinished` can be used to automatically delete the completed Kubernetes job used to run the parser.
This sets the `ttlSecondsAfterFinished` field on the created job. This requires your cluster to have the [TTLAfterFinished](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/) feature gate enabled in your cluster.

### ScopeLimiterAliases (Optional)

`scopeLimiterAliases` can be used in combination with `scopeLimiter` to create aliases for fields in findings.
The goal of this field is to ensure that the `scopeSelector` can always select an alias, regardless of the underlying representation of the data in a finding.
This field supports Mustache templating and has access to the finding object.

See the [Scope HowTo](/docs/how-tos/scope) for more information.

### Affinity and Tolerations (optional)
[`affinity`](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/) and [`tolerations`](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) can be used to control which nodes the parser is executed on.
The values should be set via Helm values (during install) or by specifying `affinity` and/or `tolerations` in the `Scan` specification.

## Example

```yaml
apiVersion: execution.securecodebox.io/v1
kind: ParseDefinition
metadata:
  name: zap-json
spec:
  image: docker.io/securecodebox/parser-zap
  imagePullSecrets:
  - name: dockerhub-token
  ttlSecondsAfterFinished: 60
  scopeLimiterAliases:
    domain: "{{attributes.host}}"
```
The Parse definition is different when integrating a new scanner. We use specific conventions when adding new ParseDefinitions to the secureCodeBox repository. 
More information can be found on the [templates folder documentation page for integrating new scanners](/docs/contributing/integrating-a-scanner/templates-dir)
