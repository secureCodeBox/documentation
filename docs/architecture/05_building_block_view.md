---
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

title: "Building Block View "
sidebar_label: "Building Block View "
sidebar_position: 5
---
# Building Block View {#section-building-block-view}

This section describes the static view of building blocks for _secureCodeBox_. We use the common pattern in architecture to describe the building blocks starting from the context boundary diagram from section [System Scope and Context](/docs/architecture/system_scope_and_context). The context boundary diagram is a blackbox view of _secureCodeBox_. Here we go one level deeper and describe the _secureCodeBox_ as whitebox system and describe all contained components as blackbox. If necessary we drill-down for each component for another whitebox view which describes its components as blackboxes. This proces of drill-down is done for each component and as deep as necessary.

To keep this part short and only as complicated as needed, we base our documentation on the [C4][C4] model for visualizing software architecture. This model suggest to drill down four levels. 

1. _Context level_ overview, displaying the context in which the application is used. 
2. _Containers level_ broadly describes the different data streams. 
3. _Components level_ describing the different components and the interactions between them. 
4. _Code level_ which will consist of class and/or database diagrams.

The first context level as suggested by C4 is covered by the previous section [System Scope and Context](/docs/architecture/system_scope_and_context).

## Whitebox Overall System {#_whitebox_overall_system}

This part describes all components contained in the _secureCodeBox_ on the _container level_ of the C4 model. In this context container does not necessarily mean container in the manner of OS-level virtualization, such as Docker or Podman. This term is used more open as [Simon Brown describes in his talk about this model][C4-talk].

### Overview Diagram

![building blocks whitebox level one](/img/docs/architecture/building-blocks-whitebox-level-1.png)

### Contained Building Blocks

| Name         | Description                                                                              |
|:-------------|:-----------------------------------------------------------------------------------------|
| _Engine_     | The main component for scheduling scans.                                                 |
| _Hooks_      | A mechanism to hook into the processing of findings.                                     |
| _Hook SDK_   | Software development kit to help with writing custom _hooks_.                            |
| _ScanType_   | _Custom resources_ to declare all available scans (e.g. Nmap, Nikto, Nuclei, Zap, etc.). |
| _Parser SDK_ | Software development kit to help with writing custom _parsers_.                          |
| _Lurker_     | Sidecar container to collect the raw findings of a scanner tool.                         |

### Important Interfaces

| Name             | Description                                                              |
|:-----------------|:-------------------------------------------------------------------------|
| _Kubernetes API_ | _secureCodeBox_ is highly integrated with the [Kubernetes API][k8s-api]. |
| _S3 API_         | _secureCodeBox_ uses the [Amazon S3 API][s3-api] to persist all data.    |

### Component Blackbox Views

### Important Interfaces Blackbox Views

#### Kubernetes API {#_kubernetes_api}

##### Purpose/Responsibility

:::note
Not documented yet.
:::

##### Interface(s)

:::note
Not documented yet.
:::

#### S3 API {#_s3_api}

##### Purpose/Responsibility

:::note
Not documented yet.
:::

##### Interface(s)

:::note
Not documented yet.
:::

[C4]:       https://c4model.com/
[C4-talk]:  https://youtu.be/x2-rSnhpw0g
[k8s-api]:  https://kubernetes.io/docs/concepts/overview/kubernetes-api/
[s3-api]:   https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html
