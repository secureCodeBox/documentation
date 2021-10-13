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

### Volumes (Optional)

`volumes` lets you specify Kubernetes volumes that you want to use and make available to the scan container.
Similarly to `env`, it can be used to pass data into a container.
It has to be combined with [`volumeMounts`](#volumemounts-optional) to be useful (see below).
It can also be used in combination with `initContainers` to provision files, VCS repositories, or other content into a scanner - see [`initContainers`](#initcontainers-optional) for an example.

`volumes` has the same API as the `volumes` property on Kubernetes pods.

See:
- [Documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-volume-storage/)
- [API Reference](https://v1-18.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#volume-v1-core)

### VolumeMounts (Optional)

`volumeMounts` let you specify where you want the previously-created volumes to be mounted inside the container.
It is used in combination with [`volumes`](#volumes-optional) (see above).

`volumeMounts` has the same API as the `volumeMounts` property on Kubernetes pods.

See:
- [Documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-volume-storage/)
- [API Reference](https://v1-18.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#volumemount-v1-core)

### InitContainers (Optional)

`initContainers` lets you specify a (set of) container(s) that are run before the scan itself.
You can specify arbitrary containers with any command that you desire.
By default, init containers do not share a file system with the scan job.
If you want to use init containers to provision files or directories for the scan job, you need to explicitly create a volume and mount it to both the init container and the scan job itself (using the [`volumeMounts`](#volumemounts-optional) discussed above).
For example, if you want to download a file that contains a list of scan targets for nmap, you could configure the scan like this:

```yaml
apiVersion: "execution.securecodebox.io/v1"
kind: Scan
metadata:
  name: "nmap-from-web"
spec:
  # Specify a volume that will be used to share files between the containers
  volumes:
    - name: target-list
      emptyDir: {}
  # Mount the volume to the scanner at the path /targets
  volumeMounts:
    - mountPath: "/targets/"
      name: target-list
  # Declare the initContainers
  initContainers:
    # For this, we use only a single init container - you can specify multiple, and they will be executed sequentially
    - name: "download-targets"
      # Use the "busybox" image, which contains wget
      image: busybox
      # Launch wget to download a list of targets and place it in /targets/targets.txt
      command: 
        - wget
        - "https://my.website.tld/targets.txt"
        - "-O"
        - /targets/targets.txt
      # Make the volume used above available to the initContainer as well, at the same path
      volumeMounts:
        - mountPath: "/targets/"
          name: target-list
  # Declare the actual scan you want to perform, using the downloaded file
  scanType: "nmap"
  parameters:
    - "-iL"
    - "/targets/targets.txt"
```

`initContainers` has the same API as the `initContainers` property on Kubernetes pods, which is a list of `container`s.

See:
- [Documentation](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/)
- [API Reference](https://v1-18.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#container-v1-core)

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
