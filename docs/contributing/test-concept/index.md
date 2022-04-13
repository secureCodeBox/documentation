---
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

title: "Testing Concept"
sidebar_label: "Introduction"
sidebar_position: 1
---

## Introduction
In this section we will go over how the different modules (scanner/hook/operator) of secureCodeBox are tested. 
We will present how each modules implements unit and integration tests.
* [Operator](/docs/test-concept/operator-test)
* [Scanner](/docs/test-concept/scanner-test)
* [Hook](/docs/test-concept/hook-test)
  
We use Make as a basis for our testing framework. The Makefiles expect additional software to be installed:
git, node + npm, docker, kind, kubectl, helm and [yq](https://github.com/mikefarah/yq/).
