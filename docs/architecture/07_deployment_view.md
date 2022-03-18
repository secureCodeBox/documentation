---
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

title: "Deployment View"
sidebar_label: "Deployment View"
sidebar_position: 7
---
# Deployment View {#section-deployment-view}

This section describes the deployment of _secureCodeBox_.

## Cluster Internal Central Scans {#_cluster_internal_central_scans}

Cluster internal security scans with one dedicated namespace.

***Overview Diagram***

![Cluster internal central scans diagram](/img/docs/architecture/deployment_cluster_internal_central_scans.png)

### Motivation

The motivation behind this scenario is to have one central point to accumulate all findings of all scanned namespaces. Typically, this scenario is for a team which want to monitor a whole landscape of applications and services (e.g. a SOC team). 

## Cluster/Namespace Internal {#_cluster_namespace_internal}

Cluster internal security scans directly in the business service's namespace.

### Motivation

The motivation behind this scenario is to provide each development team its own "instance" of _secureCodeBox_. The common parts like _operator_ is shared, but each team deploys its own _scans_ inside their namespace. Typically, you will use this scenario if you do not want to allow that a team can see the findings of other teams. 

***Overview Diagram***

![Cluster internal central scans diagram](/img/docs/architecture/deployment_cluster_namespace_internal.png)
