---
title: "ScheduledScan"
---

The ScheduledScan Custom Resource Definition (CRD) lets you define a [Scan](https://docs.securecodebox.io/docs/crds/scan) which gets repeated in a specific time interval. E.g. every 24 hours or every 7 days.

## Specification (Spec)

### Interval (Required)

The `interval` specifies the interval between two scans.

Specified as a [golang duration string](https://golang.org/pkg/time/#ParseDuration).

:::caution 
The biggest duration golang time strings support is **hours**. Longer durations e.g. days / weeks need to specified as multiples of hours.
We plan to improve this in the future, by providing a custom format which also supports days and weeks.
:::

### ScanSpec (Required)

The `scanSpec` contains the specification of the scan which should be repeated.

See the `spec` field of the [Scan CRD](https://docs.securecodebox.io/docs/crds/scan) for all supported attributes.

### SuccessfulJobsHistoryLimit (Optional)

The `successfulJobsHistoryLimit` controls how many completed scans are supposed to be kept until the oldest one will be deleted. 

Defaults to 3 if not set. When set to `0`, scans will be deleted directly after their completion.

:::info 
The `successfulJobsHistoryLimit` applies only to "successful" scans.
Failed jobs currently need to be manually deleted.
We plan to add a `failedJobsHistoryLimit` field in a future release.
:::

## Example

```yaml
apiVersion: "execution.securecodebox.io/v1"
kind: ScheduledScan
metadata:
  name: "nmap-scanme.nmap.org-daily"
spec:
  interval: 24h
  scanSpec:
    scanType: "nmap"
    parameters:
        # Use nmaps service detection feature
        - "-sV"
        - scanme.nmap.org
  historyLimit: 3
```
