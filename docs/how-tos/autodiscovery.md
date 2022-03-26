---
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

title: "Automatically run scans with Autodiscovery"
sidebar_position: 6
---

## Introduction
It is possible to automatically create scheduled scans for kubernetes entities with the secureCodeBox autodiscovery. There are two availble modes that can be activated if needed. A _service_ and a _container_ autodiscovery.

#### Container Autodiscovery
The container autodiscovery will create a scheduled scan with the given parameters (see configuration options below) for each unique container image in a kubernetes namespace.  
It is currently disabled by default and must be enabled manually.

Assume that a namespace contains two pods that run a `nginx V1.5` container. The container autodiscovery will only create a single scheduled scan for the _nginx_ containers, as both are identical.  
When a third pod inside the namespace is started running a `nginx V1.6` container, the container autodiscovery will create an additional scheduled scan for the `nginx V1.6` container, as it is new and not scanned at this point in time.  
When both `nginx V1.5` pods get deleted the corresponding scheduled scans will also be automatically deleted because the specific container image is no longer present in the namespace.

In other words: The container autodiscovery will create a single scheduled scan for each unique container image (taking specific version number into account) in a given namespace.

If a pod consists of multiple containers, the above described logic will be applied to each container individually.

#### Service Autodiscovery
The service autodiscovery will create a scheduled scan with the given parameters (see configuration options below) for each kubernetetes service it detects.  
The service autodiscovery is enabled by default but can be disabled manually.

The service autodiscovery will ignore services where the underlying pods do not serve http(s). It checks for open ports `80, 443, 3000, 5000, 8000, 8443, 8080`. It is also sufficient to name the ports `http` or `https` when a different port is used than the ports specified above.

## Setup
For the sake of the tutorial, it will be assumed that a Kubernetes cluster and the SCB operator is already up and running. If not, check out the [installation](/docs/getting-started/installation/) for more information.
This tutorial will use the `default` and `securecodebox-system` namespace!

First install `zap-andvanced`and `trivy`:
```bash
helm upgrade --install zap-advanced secureCodeBox/zap-advanced
helm upgrade --install trivy secureCodeBox/trivy
```

Then install the SCB autodiscovery (ContainerAutodiscovery is explicitly enabled in this example):
```bash
helm upgrade --namespace securecodebox-system --install auto-discovery-kubernetes secureCodeBox/auto-discovery-kubernetes --set config.containerAutoDiscovery.enabled=true
```

Then annotate the namespace so that the autodiscovery searches the namespace (see section about resourceInclusionMode):
```bash
kubectl annotate namespace default auto-discovery.securecodebox.io/enabled=true
```

Then install juiceshop as a demo target:
```bash
helm upgrade --install juice-shop secureCodeBox/juice-shop
```

The autodiscovery will create two scheduled scans. One for the juiceshop servcie using `zap`, and one for the juiceship container using `trivy`:
```bash
$ kubectl get scheduled scans
NAME                                                             TYPE                INTERVAL   FINDINGS
juice-shop-service-port-3000                                     zap-advanced-scan   168h0m0s   
scan-juice-shop-at-350cf9a6ea37138b987a3968d046e61bcd3bb18d2ec   trivy               168h0m0s   

```

