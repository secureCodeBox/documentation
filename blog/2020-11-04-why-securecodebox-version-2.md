---
title: Why secureCodeBox Version 2
author: Sven Strittmatter
author_title: Core Developer
author_url: https://github.com/Weltraumschaf
author_image_url: https://www.gravatar.com/avatar/3fe213284598b5cb69009665902c77a1
tags:
  - secureCodeBox
  - architecture
  - v1
  - v2
description: This post tells why we made a major breaking rewrite of secureCodeBox.
image: /img/blog/2020-11-04-orange-reflective-architecture.jpg
draft: true
---

Cover photo by [Alex wong](https://unsplash.com/@killerfvith) on [Unsplash](https://unsplash.com/s/photos/architecture).

In this article I will give you a deeper insight why we decided to make a major breaking rewrite of the *secureCodeBox*. First I'llgive you an overview of the v1 architecture and the rationale behind and outline the problems we stumbled upon using *secureCodeBox* v1 for some years now. Afterwards I introduce you to thenew *secureCodeBox* v2 architecture and the rationale behind.

<!--truncate-->

## Architecture of the Version 1

Let's start with the design goals of v1:

1. It should be possible to easily integrate new scanners.
2. All components should be loosly coupled to easily swap them.
3. The whole deployment should run anywhere (local, VMs, Cloud, etc.) and scale.
4. The definition and implementation of a scan process should be easy.

This is not an exhaustive list of requiremtns for the architecture, but the most important ones. This resulted in a design outlined in the next image:

![Architecture Overview of secureCodeBox version 1](/img/blog/2020-11-04-architecture-v1.png)

This is a simplifed component diagram of the *secureCodeBox* v1. Unimportant components (like reverse proxy, vulnerability management system, etc.) are removed for brevity. So lets dig deeper into theese goals and how they were achieved.

I'll use a wording in thenext sections:

- *Engine*: This is the core component responsible for orchestration of the *securecodeBox* v1 and providing the REST API and UI.
- *Scanner*: This is the component composed of a container with a particular security scanner.

### Easy Integration of New Scanners

There are lot of scanners for security testing out there. So it was necessary to make it possible to integrate them easily. We achieved this by encapsulating each scanner into its own [Docker](https://www.docker.com) container. The basic idea was: If there is a new scanner, just put it inside a Docker container and attach it to the *secureCodeBox*.

Typically these scanners are Linux based command line tools and putting them inside a contianer is the easy part. On the other hand each of these tools have different user interfaces: 

- They use different options, arguments, and config file formats. 
- They vary in what they give as result (print to STDOUT, XML, JSON, etc.). 

So obviously we needed some glue code which translates from the *secureCodeBox Engine* to the command line arguments of the scanner and translates back the results to a unified format the *Engine* can handle. This resulted in the scanner scafolding frameworks ([Ruby](https://github.com/secureCodeBox/ruby-scanner-scaffolding) and [NodeJS](https://github.com/secureCodeBox/nodejs-scanner-scaffolding)) to help with the scanner integration.

### Loosely Coupling

We wanted no tight coupling between the *secureCodeBox* components so we may easily swap one of them without touching everything else. With the apporach of putting every scanner in its own container we did the first step. The second step was a REST API for the *Engine* and the *Scanners*. So we end in a so called [microservices architecture](https://en.wikipedia.org/wiki/Microservices). 

At this point we had to choise between two approaches for integrating the *Scanners*:

1. The *Engine* **pushes** new work to the *Scanner*s, or
2. the *Scanners* **polls** the *Engine* for new work.

We decided to choose the second approach because this simplified the implementation tremendously: The *Engine* must not do bookkeeping which *Scanners* are available, crashed or need to be (re-)started. A *Scanner* registers itself at the *Engine* by polling for work and send back the result when finished. But with the consequence that *Scanners* must run all the time to poll the *Engine*.

### Deployment and Scaling

This design gloal is connected with the first one. As we decided to put each security scaner into its own container, it was not far to seek to put all components into containers and deploy them with [Docker Compose](https://docs.docker.com/compose/). So it was possible to run the *secureCodeBox* local on your machine, on virutal machines or even in any cloud environment. We ran our first production deployment with an early version of [Rancher](https://rancher.com/) on a virtual machine.

### Implementation oft the Scan Process workflows

We needed a way to define our typical scan processes. For example such a process may look like:

1. Scan for open ports.
2. Scan for TLS configuration errors.
3. Scan for outdated webservers.
4. Someone must review the findings.

Very early we stumbled upon [Camunda](https://www.camunda.com) which is a [BPMN](https://en.wikipedia.org/wiki/Business_Process_Model_and_Notation) engine and we thought: "Our scan processes merely looks like such a business processes." We decided to use Camunda in the *Engine* to manage all the workflows. That saved us a lot of time and effort because implementing such a big configurable state machine is no trivial task. Also we were keen of the UI Camunda brings with it to visualize the BPMN. So we built the *Engine* on top of [Spring Boot with Camunda](https://docs.camunda.org/get-started/spring-boot/) and modelled the scans with BPMN.

### Problems with This Design

We used *secureCodeBox* v1 heavily in the last couple of years and encountered that some of our decissions were not the best ones.

#### Lot of Repositories to Release

Due to the fact that we decided to use a microservice architecture we wanted to enforce this by separating the components as much as possible to reduce risk of tight coupling. This resulted in a pattern where we use own repository for each component. This led to the vast number of roundabout a dozen repositories at [GitHub](https://github.com/secureCodeBox). All these repositories needed to be coordinated and aligned for a release which results in a lot of tedious work. Also we now had lot of different places to look for issues and documenting things.

#### Scanners Run All the Time

Abobe I mentioned that we decided to use polling for the coordination of scanners. Firstly it looks reasonable to choose this approach because such a resource handling is hard to implement. But as we used the *securecodeBox* more and more in our projects we realized that cloud is not always that cheap as one would expect: If your containers run all over the time cost may explode. In our case we used the *secureCodeBox* to scan all our company's infrastructure and hence we had hundreds of running scanner containers to spread the load. Due to the fact that they're running all the time and not only when they had work our operational costs rised to much. So in retrospective this architectural choice was not that good.

#### Boilerplateing for Scanner Integration

The integration of new scnaners were not that easy as we assumed. First problem was you have to write lot of boilerplate code to translate from the scan task coming from the eninges API – Remember, above I said that a scanner polls for these tasks by requesting an API endpoint of the engine. - into the approbriate forma tof the scanners CLI. Also you needed to write the translation back from the scanners CLI output to the format the engine can deal with. As if this was not enough you also have to write a BPMN process model which describes the scan and makes it possiblke to integrate it into the BPMN based engine. Turns out: That's to much tedious work. Nobody in the community contributed own scanners. In fact only one of our core commiters did this extra mile and contributed new scanners (thnaks Robert).

#### Heavy Engine with SpringBoot and Camunda

As mentioned above we decided to use the Camunda BPMN engine as core for our engine. We used the ready packaged dependency with Spring Boot because we wanted to provie a REST API for the engine and also add some nice web UI. All of this turned out as a big legacy. First it was a very large code base. If you ever seen a Java based web appliction you know what I mean. Of course reduces Spring Boot a lot of the typical Java boiler plate, but this is also part of the problem: it hides a lot of stuff behind some magic. If you're not familar with Spring Boot you have no clue how all this works. This made it very hard for contributors to fix or extend the engine. And as site note: We discovered that nobody really used the fency web UI. Merely it was only used for convincing business people in meetings.

## Architecture of the Version 2

![Architecture Overview of secureCodeBox version 2](/img/blog/2020-11-04-architecture-v2.png)
