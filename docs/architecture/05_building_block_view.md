---
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

title: "Building Block View "
sidebar_label: "Building Block View "
sidebar_position: 5
---
# Building Block View {#section-building-block-view}

Below, an overview is given of the global design/architecture of _secureCodeBox_. This document is inspired by the [C4][C4] model for visualizing software architecture. Conform this model, this document is split in 4 parts (i.e. levels). First, a _context_ level overview, displaying the context in which the application is used. The second level, _containers_, broadly describes the different data streams. The third level consists of a _components_ overview, describing the different components and the interactions between them. The fourth and final level contains a _code_ overview. Which will consist of class- and database-diagrams.

## Whitebox Overall System {#_whitebox_overall_system}

***Overview Diagram***

![building blocks whitebox level one](/img/docs/architecture/building-blocks-whitebox-level-1.png)

Motivation

:::note
*TODO #21 text explanation*
:::

Contained Building Blocks

| Name         | Description |
|:-------------|:------------|
| _Engine_     | TODO #21    |
| _Hooks_      | TODO #21    |
| _Hook SDK_   | TODO #21    |
| _ScanType_   | TODO #21    |
| _Parser SDK_ | TODO #21    |
| Lurker       | TODO #21    |

Important Interfaces

:::note
*TODO #21 text explanation*
:::

| Name           | Description |
|:---------------|:------------|
| Kubernetes API | ...         |
| S3 API         | ...         |
| Elastic API    | ...         |
| DefectDojo API | ...         |

### Engine Blackbox View {#_engine_blackbox_view}

:::note
*TODO #21

*Purpose/Responsibility*

*Interface(s)*

*(Optional) Quality/Performance Characteristics*

*(Optional) Directory/File Location*

*(Optional) Fulfilled Requirements*

*(optional) Open Issues/Problems/Risks*
:::

### Hooks Blackbox View {#_hooks_blackbox_view}

:::note
*TODO #21

*Purpose/Responsibility*

*Interface(s)*

*(Optional) Quality/Performance Characteristics*

*(Optional) Directory/File Location*

*(Optional) Fulfilled Requirements*

*(optional) Open Issues/Problems/Risks*
:::

### Hook Blackbox View {#_hook_blackbox_view}

:::note
*TODO #21

*Purpose/Responsibility*

*Interface(s)*

*(Optional) Quality/Performance Characteristics*

*(Optional) Directory/File Location*

*(Optional) Fulfilled Requirements*

*(optional) Open Issues/Problems/Risks*
:::

### ScanType Blackbox View {#_scantype_blackbox_view}

:::note
*TODO #21

*Purpose/Responsibility*

*Interface(s)*

*(Optional) Quality/Performance Characteristics*

*(Optional) Directory/File Location*

*(Optional) Fulfilled Requirements*

*(optional) Open Issues/Problems/Risks*
:::

### Parser SDK Blackbox View {#_parser_sdk_blackbox_view}

:::note
*TODO #21

*Purpose/Responsibility*

*Interface(s)*

*(Optional) Quality/Performance Characteristics*

*(Optional) Directory/File Location*

*(Optional) Fulfilled Requirements*

*(optional) Open Issues/Problems/Risks*
:::

### Lurker Blackbox View {#_lurker_blackbox_view}

:::note
*TODO #21

*Purpose/Responsibility*

*Interface(s)*

*(Optional) Quality/Performance Characteristics*

*(Optional) Directory/File Location*

*(Optional) Fulfilled Requirements*

*(optional) Open Issues/Problems/Risks*
:::

### Kubernetes API {#_kubernetes_api}

### S3 API {#_s3_api}

### Elastic API {#_elastic_api}

### DefectDojo API {#_defectdojo_api}

<!--
## Level 2 {#_level_2}

### White Box *building block 1* {#_white_box_emphasis_building_block_1_emphasis}

*white box template*

### White Box *building block 2* {#_white_box_emphasis_building_block_2_emphasis}

*white box template*

...

### White Box *building block m* {#_white_box_emphasis_building_block_m_emphasis}

*white box template*

## Level 3 {#_level_3}

### White Box _building block x.1_ {#_white_box_building_block_x_1}

*white box template*

### White Box _building block x.2_ {#_white_box_building_block_x_2}

*white box template*

### White Box _building block y.1_ {#_white_box_building_block_y_1}

*white box template*
-->

[C4]: https://c4model.com/
