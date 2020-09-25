---
title: "Starting your First Scans"
path: "docs/getting-started/first-scans"
---

Now that you have installed the secureCodeBox, you can start you are close to being able to run you first scans.

Before we can start scans, we need to install their `ScanTypes`, these tell the secureCodeBox Operator how to actually run the scans and how their results can be parsed to create a uniform and consistent finding datamodel. ScanTypes are namespaced [Custom Resource Definitions](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/) in Kubernetes, this lets different teams operating in different namespaces use different Types of scanners and enables them to define their own custom ScanTypes.

## Installing the Nmap ScanType

In this guide we'll use the [Nmap Port & Network Scanner](https://nmap.org), as it is fast and relatively easy to use. We can install the Nmap ScanType via Helm:

```bash
helm install nmap secureCodeBox/nmap
```

To verify or to see which ScanTypes are installed in your current Namespace you can run:

```bash {1}
$ kubectl get scantypes
NAME   IMAGE
nmap   securecodebox/nmap:7.80
```

## Starting a Scan

Now that we have the ScanType installed,we are ready to start our first scan. `Scan` like ScanTypes are also Namespaced CRD's which let you define your own Scans in yaml. This example creates a Nmap Scan which scans the [scanme.nmap.org](http://scanme.nmap.org) host. This scan is equivalent to running `nmap scanme.nmap.org` locally.

:::caution
Please not the terms of usage for the [http://scanme.nmap.org/](http://scanme.nmap.org/) website.
Basically restrict yourself to run portscans and don't run crazy amounts of scans against it.
:::

```yaml title="nmap-scan.yaml"
apiVersion: "execution.securecodebox.io/v1"
kind: Scan
metadata:
  name: "nmap-scanme.nmap.org"
spec:
  scanType: "nmap"
  parameters:
    - scanme.nmap.org
```

You can save the file locally and then run the scan via kubectl:

```bash
kubectl apply -f nmap-scan.yaml
```

The scan is now starting up, you can track its progress using kubectl:

```bash
$ kubectl get scans
NAME                   TYPE   STATE      FINDINGS
nmap-scanme.nmap.org   nmap   Scanning
```

## Monitoring the Scans Execution

When you create the Scan, the secureCodeBox Operator will create a [Kubernetes Job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/) in your namespace in which the scanner, in this case Nmap, gets executed inside a container. Once the scan has completed the container will terminate and no compute resources will be consumed anymore. You can view the status of this job by running:

```bash {1}
kubectl get jobs
NAME                               COMPLETIONS   DURATION   AGE
scan-nmap-scanme.nmap.org-w66rp    1/1           10s        25s
```

You can also view the logs of the container by running, note that your job name will be slightly different, containing a different generated suffix. If your job is still running, the command will stream the scans logs until it has completed:

```bash
$ kubectl logs job/scan-nmap-scanme.nmap.org-w66rp nmap --follow

Starting Nmap 7.80 ( https://nmap.org ) at 2020-09-25 10:50 UTC
Nmap scan report for scanme.nmap.org (45.33.32.156)
Host is up (0.19s latency).
Other addresses for scanme.nmap.org (not scanned): 2600:3c01::f03c:91ff:fe18:bb2f
Not shown: 993 closed ports
PORT      STATE    SERVICE
22/tcp    open     ssh
80/tcp    open     http
135/tcp   filtered msrpc
139/tcp   filtered netbios-ssn
445/tcp   filtered microsoft-ds
9929/tcp  open     nping-echo
31337/tcp open     Elite

Nmap done: 1 IP address (1 host up) scanned in 5.44 seconds

```

Unless you are really quick or your scan took a long time you'll likely also seen that a second job was started:

```bash
$ kubectl get jobs
NAME                               COMPLETIONS   DURATION   AGE
parse-nmap-scanme.nmap.org-sl56z   1/1           14s        15s
scan-nmap-scanme.nmap.org-w66rp    1/1           10s        25s
```

This second jobs takes the result of the Nmap Scan and transforms them into a secureCodeBox specific finding format. These findings share the same basic structure for all integrated scanners, which make it very convenient to analyse them in further steps.

## Viewing the Scan Results

Once this second job has completed you can get a overview on the results by taking another look at the scan:

```bash
$ kubectl get scans
NAME                   TYPE   STATE   FINDINGS
nmap-scanme.nmap.org   nmap   Done    8
```

This scan listing already shows us the total count of findings identified by the scan. You can get a deeper overview by running:

```bash {20-26}
$ kubectl Name:         nmap-scanme.nmap.org
Namespace:    default
Labels:       <none>
Annotations:  API Version:  execution.securecodebox.io/v1
Kind:         Scan
Metadata:
  Creation Timestamp:  2020-09-25T10:50:09Z
  Finalizers:
    s3.storage.securecodebox.io
  Generation:        1
  Resource Version:  46608
  Self Link:         /apis/execution.securecodebox.io/v1/namespaces/default/scans/nmap-scanme.nmap.org
  UID:               fef73c4c-700a-4ad0-96c5-f8319989e9d9
Spec:
  Parameters:
    scanme.nmap.org
  Scan Type:  nmap
Status:
  Finding Download Link:  "...omitted for readability"
  Findings:
    Categories:
      Host:       1
      Open Port:  7
    Count:        8
    Severities:
      Informational:         8
  Finished At:               2020-09-25T10:50:35Z
  Raw Result Download Link:  "...omitted for readability"
  Raw Result File:           nmap-results.xml
  Raw Result Type:           nmap-xml
  State:                     Done
Events:                      <none>
```

This gives us a overview of the results of the scan.
To view the actual findings produced by the scan you can use the download link to download the findings as JSON from Minio / S3.

## Next Steps

### Configure more Involved Nmap Scans

Nmap is a extermly powerful tool, which can be used for much more than just scanning for ports.
You can find more examples of nmap scans, including example findings for these scans on the documentation page of the [Nmap ScanType](/docs/scanners/Nmap).

### Other ScanTypes

Nmap is just one of the many security testing tools integrated into the secureCodeBox, you can find examples and documentation on how to use each of them on their documentation page in the sidebar.

To get started you can also take a look at our more detailed guides:

- [HowTo: Network Scans](/docs/user-guide/scanning-networks)
- [HowTo: Scanning Web Applications](/docs/user-guide/scanning-web-applications)

### Persistence Providers

You can also integrate the secureCodeBox to automatically push the scan results into a external system like [Elasticsearch](/docs/hooks/Elasticsearch) or [DefectDojo (Coming soon)](/docs/hooks/DefectDojo) to better analyse your findings.
