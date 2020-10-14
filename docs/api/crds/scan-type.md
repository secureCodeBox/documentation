---
title: "ScanType"
---

The ScanType Custom Resource Definition (CRD) is used to define to the secureCodeBox how a specific scanner can be executed in Kubernetes. The main part of the ScanType is the [JobTemplate](#jobtemplate-required), which contains a Kubernetes Job definition which will be used to construct the scans Job.

## Specification (Spec)

### ExtractResults (Required)

The `extractResults` field contains an object (fields of the object listed below) which describes what types of results this scanType produced and from where these should be extracted.

#### ExtractResults.Type (Required)

The `type` field indicates the type of the file.
Usually a combination of the scanner name and file type. E.g. `nmap-xml`

The type is used to determine which parser would be used to handle this result file.

#### ExtractResults.Location (Required)

The `location` field describes from where the result file can be extracted.
Absolute path on the containers file system.

Must be located in `/home/securecodebox/` so that the result is reachable by the secureCodeBox Lurcher sidecar which performs the actual extraction of the result.
E.g. `/home/securecodebox/nmap-results.xml`

### JobTemplate (Required)

Template of the kubernetes job to create when running the scan.

See: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#job-v1-batch

## Example

```yaml
apiVersion: "execution.securecodebox.io/v1"
kind: ScanType
metadata:
  name: "zap-baseline"
spec:
  extractResults:
    type: zap-json
    location: "/home/securecodebox/zap-results.json"
  jobTemplate:
    spec:
      ttlSecondsAfterFinished: 10
      template:
        spec:
          restartPolicy: Never
          containers:
            - name: zap-baseline
              image: owasp/zap2docker-stable:2.9.0
              command:
                - "zap-baseline.py"
                # Force Zap to always return a zero exit code. k8s would otherwise try to restart zap.
                - "-I"
                - "-J"
                # ZAP Baseline Script doesn't allow absolute paths...
                # Hacky workaround: specify a relative path to the `/zap/wrk` base dir.
                - "../../home/securecodebox/zap-results.json"
```