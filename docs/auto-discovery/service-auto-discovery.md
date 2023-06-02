---
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

title: "Service AutoDiscovery"
sidebar_label: "Service AutoDiscovery"
path: "docs/auto-discovery/service-auto-discovery"
sidebar_position: 2
---

The Service AutoDiscovery will create a scheduled scan with the given parameters (see [readme](https://github.com/secureCodeBox/secureCodeBox/blob/main/auto-discovery/kubernetes/README.md) for config options) for each Kubernetes service it detects. (It is possible to scan APIs that require authentication, see the [ZAP Advanced](../scanners/zap-advanced.md) documentation).
The Service AutoDiscovery is enabled by default but can be disabled manually.

The Service AutoDiscovery will ignore services where the underlying pods do not serve http(s). It does this by checking for open ports `80, 443, 3000, 5000, 8000, 8443, 8080`. It is also sufficient to name the ports `http` or `https` when a different port is used than the ports specified above.
Services without a matching port number or name are currently ignored.

### Setup
[Zap-advanced](/docs/scanners/zap-advanced) is the scanner that is used by the Service AutoDiscovery. It has to be installed in the same namespace as the containers that you wish to scan. The following steps will install zap-advanced in the `default` namespace:
```bash
helm upgrade --install zap-advanced secureCodeBox/zap-advanced
```
We also have to enable Service AutoDiscovery. This is done through the `config.serviceAutoDiscovery.enabled` parameter in the helm chart. It goes as follows:

```bash
helm upgrade --namespace securecodebox-system --install auto-discovery-kubernetes secureCodeBox/auto-discovery-kubernetes --set config.serviceAutoDiscovery.enabled=true
```
### Rollout
AutoDiscovery has three modes of operation:
* enabled-per-namespace (default) : scans every container in an enabled namespace
* enabled-per-resource :  scans every enabled container
* all (scans every container in the whole cluster!)
  
These modes can be set via the `config.resourceInclusion` parameter in the helm chart:
```bash
helm upgrade --namespace securecodebox-system --install auto-discovery-kubernetes secureCodeBox/auto-discovery-kubernetes --set config.resourceInclusion.mode="enabled-per-resource"
```
The default mode is `enabled-per-namespace`.

Depending on the resourceInclusionMode one has to annotate each namespace or Kubernetes resource for which the AutoDiscovery should be enabled. If `all` is used nothing has to be annotated as everything will be scanned (Which is not recommended unless you know what you're doing). These modes ease the gradual rollout to your cluster.

To enable the AutoDiscovery for a namespace/resource one has to annotate it with `securecodebox.io/auto-discovery: "true"`:

Annotation for a namespace is done as follows. Here the default namespace is annotated:
```bash
kubectl annotate namespace default auto-discovery.securecodebox.io/enabled=true
```
Annotation for a resource is done as follows. Here the deployment `juice-shop` in the namespace `default` is annotated.
It is done by adding the annotation to the chart values, which is then passed to the deployment template. This results into the pod containing the service/deployment always having the annotation. The process may be different in your case:

```bash
cat <<EOF | helm upgrade --install juice-shop secureCodeBox/juice-shop  --values -
annotations: {
      "auto-discovery.securecodebox.io/enabled": "true",
}
EOF
```
You should now see a ZAP-advanced [ScheduledScan](/docs/api/crds/scheduled-scan) created for juice-shop or any other service that you have annotated.
```bash
$ kubectl get scheduledscans.execution.securecodebox.io 
NAME                                                             TYPE                INTERVAL   FINDINGS
juice-shop-service-port-3000                                     zap-advanced-scan   168h0m0s   5
```