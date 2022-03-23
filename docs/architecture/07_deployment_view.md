---
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

title: "Deployment View"
sidebar_label: "Deployment View"
sidebar_position: 7
---
# Deployment View {#section-deployment-view}

This section describes the deployment of _secureCodeBox_. We do not cover all possible deployments. We concentrate on the tpo moste scenarios. 

## Cluster Internal Central Scans {#_cluster_internal_central_scans}

Cluster internal security scans with one dedicated namespace. The whole _secureCodeBox_ with all _Scan Types_ are deployed in the same namespace.

### Overview Diagram

![Cluster internal central scans diagram](/img/docs/architecture/deployment-cluster-internal-central-scans.png)

:::note
The _S3 Bucket_, the optional build pipline ([Jenkins][jenkins] is just an example, may be any other CI/CD tool), and the _vulnerability management system_ ([DefectDojo][defectdojo] is just en example, may be any other VMS) are deployd on different nodes in the diagram above. It is also possible to deployt them in the same cluster, on a different cluster, on a bare-metal machine or somewhere in the cloud.
:::

### Motivation

The motivation behind this scenario is to have one central point to accumulate all findings of all scanned namespaces. Typically, this scenario is for a team which want to monitor a whole landscape of applications and services (e.g. a security operations (SOC) team). 

## Cluster/Namespace Internal {#_cluster_namespace_internal}

Cluster internal security scans directly in the business service's namespace. Only the _engine_ (_operator_, _lurker_, _hooks_) are deployd in a central dedicated namespace. The _Scan Types_ are deployd into the namespaces of the scanned application.

:::note
The _S3 Bucket_, the optional build pipline ([Jenkins][jenkins] is just an example, may be any other CI/CD tool), and the _vulnerability management system_ ([DefectDojo][defectdojo] is just en example, may be any other VMS) are deployd on different nodes in the diagram above. It is also possible to deployt them in the same cluster, on a different cluster, on a bare-metal machine or somewhere in the cloud.
:::

### Overview Diagram

![Cluster internal central scans diagram](/img/docs/architecture/deployment-cluster-namespace-internal.png)

### Motivation

The motivation behind this scenario is to provide each development team its own instance of _secureCodeBox_. The common parts like _operator_ is shared, but each team deploys its own _scans_ inside their namespace. Typically, you will use this scenario if you do not want to allow that a team can see the findings of other teams. 


[jenkins]:    https://www.jenkins.io/
[defectdojo]: https://www.defectdojo.org/
