---
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

title: "Container AutoDiscovery"
sidebar_label: "Container AutoDiscovery"
path: "docs/auto-discovery/container-auto-discovery"
sidebar_position: 3
---

The Container AutoDiscovery will create a scheduled scan with the given parameters (see [readme](https://github.com/secureCodeBox/secureCodeBox/blob/main/auto-discovery/kubernetes/README.md) for config options) for each unique container image in a Kubernetes namespace. Currently it is only possible to scan public container images.
It is currently disabled by default and must be enabled manually.

Assume that a namespace contains two pods that run a `nginx v1.5` container. The Container AutoDiscovery will only create a single scheduled scan for the _nginx_ containers, as both are identical.
When a third pod inside the namespace is started running a `nginx v1.6` container, the Container AutoDiscovery will create an additional scheduled scan for the `nginx v1.6` container, as it is not scanned at this point in time. The Container AutoDiscovery will look at the specific version number of each container when it determines if the container should be scanned.
When both `nginx v1.5` pods get deleted the corresponding scheduled scans will also be automatically deleted because the specific container image is no longer present in the namespace.
The scheduled scan for the `nginx v1.6` container will not be deleted, as it is still running in the namespace.

In other words: The Container AutoDiscovery will create a single scheduled scan for each unique container image (taking the specific version number into account) in a given namespace.
If a pod consists of multiple containers, the above described logic will be applied to each container individually.


### Setup
[Trivy](/docs/scanners/trivy) is a container image scanner that is used by the Container AutoDiscovery. It has to be installed in the same namespace as the containers that you wish to scan. The following steps will install trivy in the `default` namespace:
```bash
helm upgrade --install trivy secureCodeBox/trivy
```
We also have to enable container AutoDiscovery. This is done through the `config.containerAutoDiscovery.enabled` parameter in the helm chart. It goes as follows:

```bash
helm upgrade --namespace securecodebox-system --install auto-discovery-kubernetes secureCodeBox/auto-discovery-kubernetes --set config.containerAutoDiscovery.enabled=true
```
### Rollout
AutoDiscovery has three modes of operation:
* enabled-per-namespace (default) : scans every container in an enabled namespace
* enabled-per-resource :  scans every enabled container
* all (scans every container in the whole cluster!)
  
These modes can be set via the `config.resourceInclusion` parameter in the helm chart:
```bash
helm upgrade --namespace securecodebox-system --install auto-discovery-kubernetes secureCodeBox/auto-discovery-kubernetes --set config.resourceInclusion="enabled-per-resource"
```
The default mode is `enabled-per-namespace`.

Depending on the resourceInclusionMode one has to annotate each namespace or Kubernetes resource for which the AutoDiscovery should be enabled. If `all` is used nothing has to be annotated as everything will be scanned (Which is not recommended unless you know what you're doing). These modes ease the gradual rollout to your cluster.

To enable the AutoDiscovery for a namespace/resource one has to annotate it with `securecodebox.io/auto-discovery: "true"`:

```bash
kubectl annotate namespace default auto-discovery.securecodebox.io/enabled=true
```

*** 