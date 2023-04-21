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
