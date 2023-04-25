---
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

title: "AutoDiscovery Installation & Configuration"
sidebar_label: "Installation & Configuration"
path: "docs/auto-discovery/installation"
sidebar_position: 1
---

## Installation

The secureCodeBox (SCB) AutoDiscovery is packaged as a helm chart. As the AutoDiscovery works by creating (Scheduled)Scan custom resources for the discovered resources it requires the operator to be installed first.

```bash
helm install --namespace securecodebox-system auto-discovery secureCodeBox/auto-discovery
```

## Configuration

The AutoDiscovery chart can be modified by overwriting its default values using helm. See [helm install documentation](https://helm.sh/docs/intro/using_helm/#helm-install-installing-a-package)

The values used by the AutoDiscovery chart are documented in the [AutoDiscovery Readme](https://github.com/secureCodeBox/secureCodeBox/tree/main/auto-discovery/kubernetes#values), or if you prefer the yaml representation in the [default values](https://github.com/secureCodeBox/secureCodeBox/blob/main/auto-discovery/kubernetes/values.yaml)

The config values in the `config` attribute, e.g. `config.serviceAutoDiscovery.enabled`, are used to modify the actual AutoDiscovery behavior.
