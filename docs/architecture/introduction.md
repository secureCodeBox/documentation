---
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

title: "Architecture Introduction"
sidebar_label: "Introduction"
sidebar_position: 1
---

This document describes the secureCodeBox Project (SCB) and is based on the [arc42](https://arc42.org/overview/) architecture documentation template. SecureCodeBox is a Kubernetes based, modularized toolchain for continuous security scans of your software project. Its goal is to orchestrate and easily automate a bunch of security-testing tools out of the box. With secureCodeBox we provide a toolchain for continuous scanning of applications to find the low-hanging fruit issues early in the development process and free the resources of the penetration tester to concentrate on the major security issues.

Initially, the goal of secureCodeBox was to provide a tool for easy integrating security test tools into your CI/CD pipeline to run against your web project. Some years ago we asked ourselves: Why only scan a single project? So a great idea was born: Consider the whole company as a project. Additionally, secureCodeBox can aid penetration testers in the recon and discovery phase of a security assessment. The purpose of secureCodeBox is not to replace the penetration testers or make them obsolete. We strongly recommend to run extensive tests by experienced penetration testers on all your applications.

The following goals have been established for this project:

| **Priority** |                                                                                                                   |
|--------------|-------------------------------------------------------------------------------------------------------------------|
| 1            | The project shall be enhanced by features that are suitable to keep.                                              |
| 2            | The project is scalable and resource efficient (FaaS).                                                            |
| 3            | The project implements additional scanners that are a useful addition for the current suite, limiting redundancy. |
| 4            | The findings are displayed in a navigable way with least amount of duplication.                                   |
| 5            | SecureCodeBox starts new relevant scans in an agile way, based on previous findings.                              |

## Requirements

![Use-case diagram](/img/architecture/UseCaseDiagramSCB.png)

| **Id** | **Requirement**             | **Explanation**                                                    |
|--------|-----------------------------|--------------------------------------------------------------------|
| UC1    | Initiate scans              | Initiating scans in parallel and orchestrating them.               |
| UC1.1  | Initiating subsequent scans | Initiate scans based on pervious results, through cascading rules. |
| UC2    | Parse findings              | Parse findings in a human readable and friendly way.               |

## Quality Goals
Below, the most important qualities are described that this project strives for. The qualities are categorized using the [ISO 25010](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010) standard. Most of these qualities are derived from [this](https://docs.securecodebox.io/blog/2021/07/20/the-architecture-of-securecodebox-v2) blog post. For the entire list of quality-goals see [Quality Requirements](./functional/quality-requirements)

| **Category**           | **Quality**          | **Description**                                                      | **Scenario** |
|------------------------|----------------------|----------------------------------------------------------------------|--------------|
| Maintainability        | Modular              | All components should be loosely coupled to easily swap them         |              |
|                        | Ease of integration  | It should be possible to easily integrate new scanners               |              |
|                        | Ease of Contributing | SCB should be well documented                                        |              |
|                        | Ease of updating     | Third-party software should be carefully chosen, for maintainability | SC1          |
| Portability            | Adaptable            | SCB Should run everywhere (local, VMs, Cloud, etc.)                  | SC2          |
| Performance Efficiency | Resource Efficient   | SCB should scale to the available resources                          | SC3          |
|                        | Time Efficient       | Tasks should run parallel to optimize the use of resources           |              |
| Usability              | Ease of Integration  | The definition and implementation of a scan process should be easy   | SC4          |

### Scenarios

| **Id** | **Scenario**                                                                                          |
|--------|-------------------------------------------------------------------------------------------------------|
| SC1    | A third-party updates their software with a breaking change. Effort to support this update is minimal |
| SC2    | A company is running SCB in the cloud, due to limited resources on premise                            |
| SC3    | SCB is out of resources and a new scan is initiated. The scan is queued until resources are available |
| SC4    | A scan is easily created and started by writing and loading a config file                             |

## Stakeholders

| **Company** | **Name**          | **Role**                 | **GitHub Account**                                 | **Expectations** |
| ----------- | ----------------- | ------------------------ | -------------------------------------------------- | ---------------- |
| iteratec    | Robert Seedorff   | Product Owner            | [@rseerdorff](https://github.com/rseedorff)        |                  |
|             | Sven Strittmatter | Scrum Master & Developer | [@Weltraumschaf](https://github.com/Weltraumschaf) |                  |
|             | Jannik Hollenbach | Core Developer           | [@J12934](https://github.com/J12934)               |                  |
|             | Max Maass         | Core Developer           | [@malexmave](https://github.com/malexmave)         |                  |
|             | Ilyes Ben Dlala   | Core Developer           | [@Ilyesbdlala](https://github.com/Ilyesbdlala)     |                  |
|             | Rami Souai        | Core Developer           | [@RamiSouai](https://github.com/RamiSouai)         |                  |
| Secura      | Ralph Moonen      |                          | N/A                                                |                  |
|             | Sander Maijers    |                          | [@sanmai-NL](https://github.com/sanmai-NL)         |                  |
|             | Jop Zitman        |                          | [@EndPositive](https://github.com/EndPositive)     |                  |
|             | Stijn van Es      | Developer                | [@Stijn-FE](https://github.com/Stijn-FE)           | Contributes      |


## Architecture constraints

| **Constraint** | **Description** |
|----------------|-----------------|
|                |                 |

> Following...

# Context & Scope

SCB is an orchestration platform managing scan jobs and parsing results. The aim of this project is to make automated vulnerability scanning easy and efficient. The diagrams below, illustrate the external factors and the context in which SCB is used.

SCB only manages the scan tasks. The scanning functionality itself is considered out of scope and for this, third-party software is used.

## Business

![Business context diagram](/img/architecture/BusinessContextDiagram.png)

## Technical

![Technical context diagram](/img/architecture/TechnicalContextDiagram.png)

# Solution Strategy

| **Goal/Requirement** | **Architectural Approach** | **Details** |
|----------------------|----------------------------|-------------|
|

> Following...

## Road Map

> Following...
