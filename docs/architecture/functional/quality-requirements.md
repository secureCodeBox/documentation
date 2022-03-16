---
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

title: "Architecture Quality Requirements"
sidebar_label: "Quality Requirements"
---

Below, qualities are described that this project strives for. The qualities are categorized using the [ISO 25010](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010) standard. 

## Quality Tree

| **Category**           | **Quality**          | **Description**                                                      | **Scenario** |
|------------------------|----------------------|----------------------------------------------------------------------|--------------|
| Functional Suitability |                      |                                                                      |              |
| Performance Efficiency | Resource Efficient   | SCB should scale to the available resources                          | SC3          |
|                        | Time Efficient       | Tasks should run parallel to optimize the use of resources           |              |
| Compatibility          |                      |                                                                      |              |
| Usability              | Ease of Integration  | The definition and implementation of a scan process should be easy   | SC4          |
| Reliability            |                      |                                                                      |              |
| Security               |                      |                                                                      |              |
| Maintainability        | Modular              | All components should be loosely coupled to easily swap them         |              |
|                        | Ease of integration  | It should be possible to easily integrate new scanners               |              |
|                        | Ease of Contributing | SCB should be well documented                                        |              |
|                        | Ease of updating     | Third-party software should be carefully chosen, for maintainability | SC1          |
| Portability            | Adaptable            | SCB Should run everywhere (local, VMs, Cloud, etc.)                  | SC2          |



## Quality Scenarios

| **Id** | **Scenario**                                                                                          |
|--------|-------------------------------------------------------------------------------------------------------|
| SC1    | A third-party updates their software with a breaking change. Effort to support this update is minimal |
| SC2    | A company is running SCB in the cloud, due to limited resources on premise                            |
| SC3    | SCB is out of resources and a new scan is initiated. The scan is queued until resources are available |
| SC4    | A scan is easily created and started by writing and loading a config file                             | 
