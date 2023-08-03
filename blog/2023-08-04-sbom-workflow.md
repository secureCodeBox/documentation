---
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

title: Developing an SBOM Workflow for the secureCodeBox
author: Lukas Fischer
author_title: Core Developer
author_url: https://github.com/o1oo11oo
author_image_url: https://avatars.githubusercontent.com/u/1590475?v=4
tags:
  - secureCodeBox
  - comparison
  - SBOM
  - CycloneDX
  - SPDX
  - Trivy
  - Syft
  - Dependency-Track
description: We describe our plans to build an SBOM workflow for the secureCodeBox, including an SBOM tool comparison and interoperability troubles.
image: /img/blog/2023-08-21-waterfall.jpg
draft: true
---

![A burning log](/img/blog/2023-08-21-waterfall.jpg)

Cover photo by [Mike Lewis HeadSmart Media](https://unsplash.com/@mikeanywhere) on [Unsplash](https://unsplash.com/photos/waAAaeC9hns).

In [the previous blogpost](/blog/2022/01/18/log4shell) we described how to use scans to find infrastructure affected by _Log4Shell_, but wouldn't it be way more convenient to already have this information available?
_SBOMs_ promise to offer that convenience of only having to look up, where an affected dependency is used, and immediately being able to mitigate it.
This blog post details our plans to integrate an ___SBOM_ creation workflow__ into the _secureCodeBox_ and our troubles with using different tools for it.

<!--truncate-->

## What are SBOMs?

_SBOMs_, or _Software Bills of Material_, are standardized and machine-readable __lists of components__ used in software.
While that would be pretty boring for monolithic applications without external dependencies, modern software often uses hundreds or even thousands of external dependencies, usually installed through the standard package ecosystem of that particular language.
With these kinds of applications, keeping track of what is used where could be as simple as checking the provided list of dependencies, i.e. `package-lock.json` or `Cargo.lock`.
_SBOMs_ __generalize__ this for applications of multiple ecosystems, multiple applications, whole containers or VMs.

As mentioned, _SBOMs_ use standardized formats, [unfortunately with an emphasis on the plural-s of formats](https://xkcd.com/927/).
The two most prolific standards are [_Software Package Data Exchange (SPDX)_](https://spdx.dev/), developed as a Linux Foundation Project and maintained as an ISO standard, and [_CycloneDX_](https://cyclonedx.org/), developed as an [OWASP Foundation](https://owasp.org/) project.
Sometimes [Software Identification (SWID) Tags](https://csrc.nist.gov/projects/Software-Identification-SWID) are also regarded as a format of SBOMs, but their use is a bit diferent and they are not well supported by most tools that work with SBOMs.
There are some differences between _SPDX_ and _CycloneDX_ SBOMs, [documented here](https://docs.google.com/spreadsheets/d/1PIiSYLJHlt8djG5OoOYniy_I-J31UMhBKQ62UUBHKVA/edit).
They can still be converted, for example by using the [CycloneDX CLI](https://github.com/CycloneDX/cyclonedx-cli) or the [cdx2spdx](https://github.com/spdx/cdx2spdx) tool.

## The Goal of This Endeavour

Currently, the _secureCodeBox_ provides a great selection of scanners, to assess the security of your infrastructure.
If instead you want to achieve a detailed overview over the __composition of the infrastructure__, you currently have to reach for other tools.
With this change we intend to leverage the integrations and automations already present in the _secureCodeBox_, to simplify generating SBOMs for all the targets, that could up to now only be scanned for security flaws present at that moment.

That is of course a very ambitious goal.
We intend to first release a minimum viable product of SBOM generation, aimed at a common use-case for the _secureCodeBox_: __container security__.
Combining SBOM creation for containers with the AutoDiscovery makes it a breeze to keep an up-to-date inventory over whole infrastructures.

The following sections describe our search for a good tool to __create SBOMs__, the troubles when combining the created SBOMs with tools that __consume SBOMs__ and the detailed plan for the MVP implementation.

## Possible Tools to Generate SBOMs

Before deciding on a _format_ for the SBOMs, let's take a look at the possible _tools_ we could use to generate them.
The best option would be to generate SBOMs directly __at build-time__.
At that point, all the dependencies of an application are clearly defined and the compiler or some other build tool can simply export a list of them in any format.
Unfortunately, that will __not work__ for our use case, as we want to generate __SBOMs for containers__ that are already running.
Luckily there are tools that allow that as well.
To select a fitting one, the following criteria apply.

### Tool Criteria

- __Which targets__ can SBOMs be created for? Currently we want to support containers, but in the future other targets like files or VMs might be needed as well.
- How can the __containers be accessed__? Not all containers can just be pulled from Docker Hub, so support for private registries is often needed.
- Credential management, how can private registries be accessed?
- SBOM __formats__, are both SPDX and CycloneDX supported, or only one of them?
- SBOM __contents and quality__, does the tool find all dependencies and properly specifies them?
- __Support and ecosystem__ of the tool: widespread use, GitHub activity, documentation quality
- __License__, as we cannot integrate a commercial tool

Of these criteria, checking the _quality_ of an SBOM is not that straightforward.
Confirming if all the dependencies of small demo applications are picked up is possible, but for containers the dependencies also include the OS packes and everything else that the container ships with.
SBOM quality will therefore also depend on the _interoperability_ with SBOM consuming tools.

### SBOM Targets and Testing Environment

To make the tests of the tools comparable, the same images were used as scan targets.
These images are intentionally insecure, so that there are components with known security vulnerabilities which can (and __should__) be found when analyzing the generated SBOMs.
The targets are:

- [`bkimminich/juice-shop:v15.0.0`](https://hub.docker.com/r/bkimminich/juice-shop)
- [`trivy-ci-test`](https://github.com/aquasecurity/trivy-ci-test)
- [A simple .NET-based containerized app](https://github.com/o1oo11oo/test-docker-images/tree/main/dotnet-docker-test)
- [A simple Rust-based containerized app](https://github.com/o1oo11oo/test-docker-images/tree/main/rust-docker-test), using the [cargo auditable](https://github.com/rust-secure-code/cargo-auditable) format

All tools were tested under macOS Ventura 13.5, or, if they did not (or not properly) support macOS, under Ubuntu 22.04.
Unless noted otherwise, the latest available version of the tools were tested.

### Tool List

The following list includes all the free and open source tools I looked at as possible integration for the _secureCodeBox_.
There is also a whole range of premium tools for SBOMs or even full software component analysis workflows, these are not listed here as they are not relevant for our goals.

This list does not cover all details of the compared tools, when it became obvious one is not a good fit I stopped checking the remaining criteria.
It is also not an exhaustive list, there are chances a good tool is missing, just because it does not have the reach of the ones listed.
Now with that out of the way, here is the list.

#### Trivy

[Trivy](https://github.com/aquasecurity/trivy), the "all-in-one open source security scanner", which is [already integrated](/docs/scanners/trivy) as a scanner in the secureCodeBox, also supports creating SBOMs as one of its output types.
Trivy supports scanning a [wide variety of targets](https://aquasecurity.github.io/trivy/v0.44/docs/) and provides SBOM support for most of them.
Other than containers, file system paths, git repositories, or VMs, Trivy also supports generating SBOMs for whole Kubernetes clusters.
The containers can be accessed in many different ways, either through the local Docker Engine, containerd, Podman, direct access to the registry, and also through local files in tar or OCI format.
[Credentials](https://aquasecurity.github.io/trivy/v0.44/docs/advanced/private-registries/) can be supplied either through environment variables, parameters (not recommended because credentials will be readable in the process list and the shell history), in a configuration file or directly to Docker.
There is also support for the AWS, Google and Azure registries.

Example commandline:
```bash
trivy image --format cyclonedx --output results-trivy-juiceshop-v15-cyclonedx.json bkimminich/juice-shop:v15.0.0
```

SBOMs can be generated in either SPDX or CycloneDX formats.
When using CycloneDX, security scanning, which is disabled by default for SBOM outputs, can be reenabled, to include a list of security flaws already in the SBOM itself.
While interesting, it is unclear how useful this is, after all the secureCodeBox already supports [normal trivy container scans](https://www.securecodebox.io/docs/scanners/trivy/), which are integrated far better with the existing hooks.

SBOM quality and content depends on the content of the container.
Trivy supports [many package ecosystems of different languages](https://aquasecurity.github.io/trivy/v0.44/docs/scanner/vulnerability/language/), but might miss applications or dependencies installed in unusual or hard to read ways.
To find the dependencies of Rust binaries for example, Trivy relies on the `Cargo.lock` file being available or the binaries including the dependency information in a linker section according to the [cargo auditable](https://github.com/rust-secure-code/cargo-auditable) format.
In tests with small containers, Trivy was able to reliably pick up dependencies of the main application and OS packages.
For each component and depending on the output format, Trivy tracks among others the name, version, [package url (purl)](https://github.com/package-url/purl-spec) and several custom properties.

Trivy is actively maintained by [Aqua Security](https://www.aquasec.com/), has 18.2k Stars and 1.8k Forks [on GitHub](https://github.com/aquasecurity/trivy) and a very [extensive documentation](https://aquasecurity.github.io/trivy/v0.44/).
It is licensed under the Apache-2.0 license and used by GitLab for their [Container Scanning](https://docs.gitlab.com/ee/user/application_security/container_scanning/) feature.

#### Syft

[Syft](https://github.com/anchore/syft) works very similar to Trivy when it comes to generating SBOMs.
It supports containers, filesystem paths, archives, "and more" although it is not specified what "and more" entails.
This means Trivy supports more targets, which might be interesting long term, but for now Syft is perfectly capable of generating SBOMs for our use case as well.
Syft also supports [many ways](https://github.com/anchore/syft#supported-sources) to access container images, other than direct registry access or through the Docker or Podman daemons, tar archives, OCI or SIF images or plain directories and files are supported.
[Credentails for private registries](https://github.com/anchore/syft#private-registry-authentication) can to be supplied as Docker `config.json`, which can also be shared as a Kubernetes secret.
More advanced options are available according to the [go-containerregistry docs](https://github.com/google/go-containerregistry/tree/main/pkg/authn).

Example commandline:
```bash
syft bkimminich/juice-shop:v15.0.0 -o cyclonedx-json > results-syft-juiceshop-v15-cyclonedx.json
```

The list of supported [SBOM formats](https://github.com/anchore/syft#output-formats) is quite large, there is CycloneDX in xml or json, SPDX in tag-value or json, in version 2.3 or 2.2 and Syft's own format as json.
[Custom formats](https://github.com/anchore/syft#using-templates) can be defined using Go templates.

Regarding the quality of the SBOMs, Syft also has support for [many language ecosystems](https://github.com/anchore/syft#default-cataloger-configuration-by-scan-type) and largely finds the same packages as Trivy.
The difference lies in the way the package details are populated.
Like Trivy, Syft includes name, version, package url and some custom properties, but also [Common Platform Enumerations (CPEs)](https://nvd.nist.gov/products/cpe).
This allows more options for matching packages against different databases.

Syft is actively maintained by [Anchore](https://anchore.com/opensource/) and has 4.5k Stars and 412 Forks [on GitHub](https://github.com/anchore/syft).
The `README.md` file serves as documentation but covers a lot.
Syft is available under the Apache-2.0 license and provides the functionality of the [experimental `docker sbom` command](https://docs.docker.com/engine/sbom/).

#### Tern

[Tern](https://github.com/tern-tools/tern) is a Python-based tool for generating SBOMs for containers.
It uses [skopeo](https://github.com/containers/skopeo) to access container registries, but only supports Docker API compatible registries or querying the local Docker daemon.
So while Skopeo also supports loading tar archives, OCI images or plain directories, Tern does not use these features.
Skopeo also supports [private registries](https://github.com/containers/skopeo#authenticating-to-a-registry), but figuring out how to access that functionality through Tern might require some tinkering.
In addition, Tern can work with Dockerfiles directly, but requires a running Docker daemon to build the images.

Example commandline:
```bash
tern report -f cyclonedxjson -i bkimminich/juice-shop:v15.0.0 -o results-tern-juiceshop-v15-cyclonedx.json
```

SBOM [format support](https://github.com/tern-tools/tern#report-formats) is pretty good, other than CycloneDX (json), SPDX (json and tag-value), custom yaml, html and json formats can be generated.

Unfortunately, the generated SBOMs are quite lacking compared to the ones Trivy or Syft generate.
While Tern finds the distribution and OS packages of the Juice Shop container, not a single nodejs/npm component is included in the output.
Other containers show similar results, only OS packages are listed.
This is pretty unhelpful for creating an inventory of the software running in one's container infrastructure.

Tern is a ["tern-tools"](https://github.com/tern-tools) project with 884 Stars and 185 Forks [on GitHub](https://github.com/tern-tools/tern).
The most active maintainer is Rose Judge, an Open Source Engineer [at VMWare](https://blogs.vmware.com/opensource/author/rose-judge/).
The documentation is provided as markdown documents in the [docs directory](https://github.com/tern-tools/tern/tree/main/docs), while general information can be found in the `README.md` file.
Tern is licensed under a BSD-2-Clause license.

#### Microsoft SBOM Tool

[In 2022](https://devblogs.microsoft.com/engineering-at-microsoft/microsoft-open-sources-software-bill-of-materials-sbom-generation-tool/), Microsoft released [their SBOM generation tool](https://github.com/microsoft/sbom-tool), aptly named "SBOM Tool".
According to `README.md` and [the commandline docs](https://github.com/microsoft/sbom-tool/blob/main/docs/sbom-tool-cli-reference.md) it can generate SBOMs for container images and supports several package ecosystems (through the [Component Detection](https://github.com/microsoft/component-detection) library).
Images seem to be accessed through the running Docker daemon (specifying sha256 hashes of local images with `-di sha256:<hash>` works), but there is no documentation about different usage options, other than specifying an image tag.

Example commandline:
```bash
sbom-tool-linux-x64 generate -m . -pn JuiceShop -pv 15.0.0 -ps BKimminich -nsb https://owasp.org/www-project-juice-shop -di bkimminich/juice-shop:v15.0.0
```

This looks a bit inconvenient compared to the other tools, because there are many more mandatory parameters.
Making the commandline simpler to use is a [known issue](https://github.com/microsoft/sbom-tool/issues/157).
Format support is quite limited, the SBOM tool only supports generating SPDX 2.2 reports in json format.
Not even the full output path is configurable, the SBOM file always gets created as `<ManifestDir>/_manifest/spdx_2.2/manifest.spdx.json`, where `ManifestDir` is the directory supplied with `-m`.

On macOS, analyzing linux containers is unavailable and generated SBOMs contain no entries, other than the information about the target container and the details provided as parameters.
On Linux components are detected, but just like Tern the SBOM Tool fails to find anything but OS packages, in any of the tested containers.
The [Component Detection `README.me`](https://github.com/microsoft/component-detection#readme) clarifies, that the library is "intended to be used at build time", and while the SBOM Tool docs also seem like the tool is supposed to be used at build time, it is never explicitly stated and the [docs mention](https://github.com/microsoft/sbom-tool/blob/main/docs/sbom-tool-cli-reference.md#scan-docker-images-for-dependency-packages) the possibility of generating SBOMs only for containers.
I suspect that analyzing containers is supposed to be combined with analyzing local project files, so the only SBOM-content that needs to come from analyzing the container are the OS packages.
All the dependencies of the containerized applications will already be known from analyzing the build files.

The SBOM Tool and the Component Detection library are both maintained by [Microsoft](https://devblogs.microsoft.com/engineering-at-microsoft/tag/sbom/) and licensed under the MIT license.
The SBOM Tool has 1.2k Stars and 89 Forks [on GitHub](https://github.com/microsoft/sbom-tool).
The documentation could be better, there are only some markdown documents in the [docs directory](https://github.com/microsoft/sbom-tool/tree/main/docs) and the README.md file gives an overview.

Component Detection (and with that, the SBOM Tool) [uses Syft internally to analyze Docker containers](https://github.com/microsoft/component-detection/blob/main/docs/detectors/linux.md).
Since this tool is less convenient to use than Syft, and does not work as well either (for only analyzing containers), it makes more sense to just use Syft directly then.

#### Kubernetes bom

[`bom`](https://github.com/kubernetes-sigs/bom) was created "to create an SBOM for the Kubernetes project", but can be used for other projects and containers as well.
There is no mention of how images are accessed, but it works without connecting to the local Docker daemon.
Other than by specifying image tags, images can also be read from tar archives.

Example commandline:
```bash
bom generate --format json -i bkimminich/juice-shop:v15.0.0 -o results-k8sbom-juiceshop-v15-spdx.json
```

`bom` only generates SPDX 2.3 SBOMs, in either json or tag-value format.
As noted [in the documentation](https://kubernetes-sigs.github.io/bom/tutorials/creating_bill_of_materials/#simplest-use-case-one-package), go dependencies can be included, but no other language ecosystems are supported.
Since it was developed for Kubernetes, [it focuses on Go applications](https://github.com/kubernetes-sigs/bom/issues/256#issuecomment-1491465939).
Finding Go dependencies does not work for containers containing Go applications though, like Tern or the SBOM Tool, `bom` only finds OS packages there.
This makes the generated SBOMs not very useful for our goals.

`bom` is maintained as a [Kubernetes SIGs](https://github.com/kubernetes-sigs) (Special Interes Groups) project.
It has 250 Stars and 31 Forks [on GitHub](https://github.com/kubernetes-sigs/bom).
The documentation is decent, other than some basic usage information in the `README.md` file, there are is a generated [documentation website](https://kubernetes-sigs.github.io/bom/) with some subpages.

#### Others

There are some other open source tools claiming SBOM functionality, but I did not look into them in depth for various reasons.

The [SPDX SBOM Generator](https://github.com/opensbom-generator/spdx-sbom-generator) by [opensbom-generator](https://github.com/opensbom-generator) is developed in Go and supports many different language ecosystems.
It is not a good fit for the secureCodeBox though, because it can only generate SBOMs for build dependencies by reading package files.
It could still be used by analyzing the files contained in the container, but that solution is rather complicated and finicky compared to the tools listed above.

There is an experimental Docker CLI plugin to create SBOMs for containers, called [`docker sbom`](https://docs.docker.com/engine/sbom/).
All it does though, is use Syft internally, which we could also directly use instead.

The CycloneDX project also maintains an SBOM generator which supports multiple ecosystems, called [cdxgen](https://github.com/CycloneDX/cdxgen).
Internally it [uses Trivy](https://github.com/CycloneDX/cdxgen/blob/f91efd77ea296eb103e702d78eac59e05c8eaa6f/binary.js#L296) to [detect OS packages](https://github.com/CycloneDX/cdxgen/issues/38) in containers.

Other than that there is a wide range of non-free tools, which we cannot integrate for licensing reasons.

### Selecting a Tool

From this list, Trivy and Syft are by far the most capable and easiest to use tools.
It is no surprise, that both are already integrated into other projects for SBOM workflows.
As mentioned above, Syft provides the functionality of the [experimental `docker sbom` command](https://docs.docker.com/engine/sbom/).
Trivy is used by GitLab for their [Container Scanning](https://docs.gitlab.com/ee/user/application_security/container_scanning/) feature.

Some of the tools listed here, including Trivy and Syft, come with catalogers for different language and package manager ecosystems.
This enables them to find packages which were not installed through the default package manager of the system.
One remaining problem are packages installed directly as binary, without any kind of package manager.
Especially in containers this is pretty prevalent for the "main software" of a container.
This is a known issue for both Trivy and Syft: [trivy#481](https://github.com/aquasecurity/trivy/issues/481), [trivy#1064](https://github.com/aquasecurity/trivy/issues/1064), [trivy#2839](https://github.com/aquasecurity/trivy/issues/2839), [syft#1197](https://github.com/anchore/syft/issues/1197), [syft#1607](https://github.com/anchore/syft/issues/1607), [syft#1963](https://github.com/anchore/syft/issues/1963).
It seems that Syft's support for those kinds of binaries is slightly better, in the Juice Shop image, only syft detects the actual node binary.

Before selecting one of these two as a tool for the MVP, it makes sense to look at the other side of an SBOM workflow, the consuming side.
One would assume that with a standardized format the combinations of generator and consumer are interchangeable, but as noted above, the SBOMs still vary in content and attributes.

## Possible SBOM Consumers and Interoperability Troubles

Generating SBOMs is a nice first step of the workflow, but at some point you probably want to actually use them for something, and most people would prefer to use something more advanced than grep or a text editor.
There is a good amount of possible tools to work with SBOMs, both the [SPDX](https://spdx.dev/tools-community/) and the [CycloneDX website](https://cyclonedx.org/tool-center/) contain a list.
Most of the analysis tools provide license compliance, so there are not that many to work with them for vulnerability management, which is what we want to focus on for the _secureCodeBox_.

### SBOM Consumers

There are still multiple options for consuming SBOMs when focusing on vulnerabilities.
To integrate one of them with a hook for an SBOM workflow, a continuously running tool as a service is needed.
This list nevertheless contains some tools, that are only usable for one-off analyses.
These were used for general SBOM quality comparisons.

#### Trivy

Since Trivy is primarily a security scanner, it can also scan SBOMs for security vulnerabilities.
Of course generating SBOMs with Trivy just to scan them with Trivy later is not the most interesting use case, especially since the secureCodeBox [already supports Trivy scans](https://www.securecodebox.io/docs/scanners/trivy/).
It does still serve as an interesting baseline, to compare Trivy SBOM scan results to direct Trivy scans.

When directly scanning the Juice Shop image, Trivy detects 23 issues in debian packages and 67 in node packages, some as "fixed" and some as "affected".
Scanning the Juice Shop CycloneDX SBOM returns the same 23 debian issues, but only 51 node vulnerabilities.
Comparing the lists shows that there are fewer reported vulnerabilities for the semver package.
Turns out, that the same version of semver is included multiple times throughout the dependency tree, which gets deduplicated in the produced SBOM, but counted as individual vulnerabilities for the direct scan.
Other than that the same vulnerabilities are reported.
The SPDX SBOM contains all the semver usages and reports 67 node vulnerabilities again.

For the Syft SBOMs, Trivy reports only 8 debian vulnerabilities, all for `openssl`.
The ones for `libc6` and `libssl1.1` are not picked up.
For node 51 vulnerabilities are reported, which is interesting, because Syft does _not_ deduplicate components in its SBOMs, so the same semver versions are listed multiple times.
Trivy also warns about inaccuracies in scans of third party SBOMs, which is unfortunate, after all the point of standards is interoperability.

#### Grype

Compared to Trivy, Syft is only a tool to generate SBOMs, not a security scanner to gain insight from SBOMs or other sources.
Anchore offers a companion application to Syft, called [Grype](https://github.com/anchore/grype), which can then be used to scan SBOMs for vulnerabilities.
Grype can also directly scan container images.

Scanning the same Juice Shop image with Grype directly reveals 87 security vulnerabilities.
The same is true for scanning Syft's json or CycloneDX output.
The SPDX output produces 71 vulnerabilities, the missing ones are again the deduplicated semver issue [GHSA-c2qf-rxjj-qqgw](https://github.com/advisories/GHSA-c2qf-rxjj-qqgw).
Scanning Trivy SBOMs with Grype reveals fewer issues, 56 for both the SPDX and the CycloneDX SBOM.
Other than the missing duplicated semver issue, some glibc CVEs are missing and some OpenSSL vulnerabilities are only found for OpenSSL instead of for OpenSSL and libssl both.

If an SBOM does not contain CPEs, Grype offers to add them to improve vulnerability discovery.
For the Trivy SBOMs this did not increase the amount of vulnerabilities recognized.

#### Dependency-Track

The problem with both those tools is, that they are one-off invocations, consuming a single SBOM.
A continuous SBOM workflow needs a continuosly running service to accept the SBOMs, which then get analyzed regularly and can be checked for components or vulnerabilities.
[OWASP Dependency-Track](https://dependencytrack.org/) is a self hosted service that offers exactly that.
SBOMs can be uploaded through the GUI or by using the API, but only in CycloneDX format, Dependency-Track [does not support SPDX SBOMs](https://github.com/DependencyTrack/dependency-track/discussions/1222).
Support is [planned again](https://github.com/DependencyTrack/dependency-track/issues/1746) in the future, but depends on changes to the SPDX schema.
After the import, Dependency-Track analyzes them and generates lists of components and vulnerabilities.
Which vulnerabilities are recognized depends on the enabled analyzers and vulnerability sources.
By default the Docker deployment I used enabled the Internal Analyzer and the [Sonatype OSS Index](https://ossindex.sonatype.org/) as analyzers (even though [the FAQ says](https://docs.dependencytrack.org/FAQ/#i-expect-to-see-vulnerable-components-but-i-dont) OSS Index is disabled by default) and the [National Vulnerability Database (NVD)](https://nvd.nist.gov/) as data source.
The [best practices](https://docs.dependencytrack.org/best-practices/) recommend to additionally enable the [GitHub Advisory Database](https://github.com/advisories) as data source, which I did for later tests.

For the Juice Shop SBOM, without using the GitHub Advisory Database, Dependency Track finds 35 vulnerabilities in the Trivy SBOM and 83 in the one generated by Syft.
This is a pretty big difference, which has multiple reasons.
First of all, neither [Syft](https://github.com/anchore/syft/issues/931#issuecomment-1114405673) nor [Dependency-Track](https://github.com/DependencyTrack/dependency-track/issues/2151#issuecomment-1322415056) deduplicate packages, so each occurence of semver gets a new vulnerability entry for CVE-2022-25883.
Then again, only Syft's SBOMs contain CPEs, which are needed to find and match vulnerabilities in the NVD.

After enabling the GitHub Advisory Database, Dependency-Track reports 87 vulnerabilities for the Trivy SBOM, and 151 for Syft's.
It is not trivial to compare by which vulnerabilities this exactly differs, because they often have mutliple identifiers, which can lead to [the same vulnerability getting reported multiple times](https://github.com/DependencyTrack/dependency-track/issues/2181).
The counts of the severity categories also changed, but instead of strictly increasing there were more vulnerabilities of lower severity.

#### Others

As an OWASP project, Dependency-Track is a good first choice for an SBOM consumer and shows some of the problems which occur when building a complete SBOM workflow.
There are other tools with similar functionality as well, but at this point selecting the best tool is not necessary.
This is a collection of other possible tools that I did not test but which looked possibly fitting at a first glance, listed here as a reference.

The open source community [DevOps Kung Fu Mafia](https://github.com/devops-kung-fu) develops a tool called [bomber](https://github.com/devops-kung-fu/bomber).
Judging by the description it is very similar to Trivy or Grype, but instead of shipping or building their own combined vulnerability database, bomber directly checks vulnerabilities against either [OSV](https://osv.dev/), [OSS Index](https://ossindex.sonatype.org/) or [Snyk](https://security.snyk.io/).

The [FOSSLight Hub](https://github.com/fosslight/fosslight) lists SBOM support (SPDX only) and vulnerability management as capabilities.
Main usage and features seem to aim at license compliance though.

The Eclipse Foundation provides the software catalogue application [SW360](https://github.com/eclipse-sw360/sw360).
It [lists](https://projects.eclipse.org/projects/technology.sw360) vulnerability management as one of its features and supports both [SPDX](https://github.com/eclipse-sw360/sw360/pull/653) and [CycloneDX](https://github.com/eclipse-sw360/sw360/pull/2015) imports.
There is currently a [discussion](https://github.com/eclipse-sw360/sw360/discussions/2040) going on about using it as an SBOM management tool.

The [KubeClarity](https://github.com/openclarity/kubeclarity) tool by [OpenClarity](https://openclarity.io/) provides Kubernetes, container and filesystem scanning and vulnerability detection.
It uses a pluggable architecture to support multiple scanners and analyzers in a two step process with SBOMs as an intermediate product.
Currently used scanners are Trivy, Syft and Cyclonedx-gomod.
The analyzers are Trivy, Grype and Dependency-Track.

### The Naming Problem

As mentioned multiple times, one of the differences between Trivy's and Syft's SBOMs are the Common Package Enumerations (CPEs) that only Syft includes.
Among package urls (purls), they are a way of uniquely identifying software applications or packages, which is needed to match packages against vulnerabilities listed in a database.
While many databases already include purls as references, the National Vulnerability Database (NVD) does not.
This prevents the vulnerabilities, that are not duplicated to other databases ([like Debian's](https://github.com/DependencyTrack/dependency-track/issues/1827#issuecomment-1195181769)) to get reported.

So if including CPEs improves vulnerability matching, why does Trivy not include them?
Because CPEs are [difficult and inconvenient to work with](https://owasp.org/blog/2022/09/13/sbom-forum-recommends-improvements-to-nvd.html).
Accurately but automatically assigning the correct CPE is not trivial, because the format includes a vendor field, which does not always match the most trivial guess.
This fits closed source software distributed by companies, but not the modern OSS environment of small packages by individual contributors.
There is an official CPE dictionary, which __should__ be used to match components to CPEs, but even with that matching the correct software is not trivial.
For redis for example, it contains among others Anynines redis (`cpe:2.3:a:anynines:redis:2.1.2:*:*:*:*:pivotal_cloud_foundry:*:*`), a product using redis, hiredis (`cpe:2.3:a:redislabs:hiredis:0.14.0:*:*:*:*:*:*:*`), a C client, and the in-memory data store most people would think of (used to be `cpe:2.3:a:pivotal_software:redis:4.0.10:*:*:*:*:*:*:*` but is now `cpe:2.3:a:redislabs:redis:4.0.10:*:*:*:*:*:*:*`).
Since CPEs are centrally managed, they are often only assigned when a vulnerability is reported, so proactively monitoring for vulnerabilities turns into a guessing game.
This describes Syft's strategy of assigning CPEs pretty well, try to generate CPEs [on a best effort basis](https://github.com/anchore/syft/issues/268#issuecomment-741829842), which of course [fails sometimes](https://github.com/DependencyTrack/dependency-track/issues/1871#issuecomment-1208980821).
For Trivy there is an [open issue](https://github.com/aquasecurity/trivy-db/issues/113) to include CPEs, but it does not specifically mention SBOMs.

Because of these problems, [CPEs were already deprecated](https://groups.io/g/dependency-track/topic/74648781#129) by the NVD, with the intention of replacing them by Software Identification Tags (SWID) instead.
Since the migration is currently not moving along, [CycloneDX undeprecated CPEs](https://github.com/CycloneDX/specification/issues/105) again.

Package urls are a more recent naming scheme, which makes automatic assignment a lot easier.
Most other databases either directly support them already (like [OSS Index](https://ossindex.sonatype.org/doc/coordinates) or [Google's OSV](https://github.com/google/osv.dev/issues/64)), or contain the information needed to work with them (like GitHub advisories, but [including them is debated](https://github.com/github/advisory-database/issues/10)).
The most important one that does not is the NVD, which is why there are multiple requests and proposals for purls to get added.

This problem, that there is no unique identifier for software products that works across ecosystems, is known as the _naming problem_ among people working with SBOMs.
There are several proposals for fixing the status quo, which all boil down to "the NVD needs to use pulrs" for at least part of their solution.
The most iportant proposal is [_A Proposal to Operationalize Component Identification for Vulnerability Management_](https://owasp.org/assets/files/posts/A%20Proposal%20to%20Operationalize%20Component%20Identification%20for%20Vulnerability%20Management.pdf), released September last year by a group calling themselves the _SBOM Forum_.
In their statement, they also detail the problems of CPEs and propose using purls for identifying software, but other identifiers for hardware.
[Work is ongoing](https://tomalrichblog.blogspot.com/2023/06/dale-peterson-made-me-miss-dinner-again.html) to improve the NVD but it is a slow process.
Tom Alrich, the [founder of the SBOM Forum](https://securityboulevard.com/2023/03/making-sboms-useful/), regularly informs about updates [on his blog](https://tomalrichblog.blogspot.com/).

### Other Problems with SBOMs

Apart from the naming problem, SBOMs are still not the perfect solution for software composition analysis.
While SBOMs contain information about the software and version used, linux distributions often apply their own patches to the packages they distribute.
These patches regularly include fixes for security vulnerabilities as backports as part of a distributions long term support commitments.
While getting this support is nice, it might lead to false positive vulnerability reports, because either the SBOM does not contain information about the specific distribution version of a package, or the vulnerability database it is matched against only contains information about fixes in the upstream version.

As an example, [according to the NVD](https://nvd.nist.gov/vuln/detail/CVE-2022-4450), `CVE-2022-4450` affects `openssl` starting with `1.1.1` and is fixed in `1.1.1t`.
The Debian advisory though [reports](https://security-tracker.debian.org/tracker/CVE-2022-4450), that a fix has been released for `1.1.1n-0+deb11u4`, which is the version used in the Juice Shop image.
Dependency-Track still reports the vulnerability though.
This means, that for accurate reports, the security advisories of the individual distributions would need to be considered as well, which further complicates the vulnerability mapping.
Dependency-Track has an [open issue](https://github.com/DependencyTrack/dependency-track/issues/1374) about this, so this problem is known as well, but the solution is not straight forward.

Another devil hides in the details: just because a dependency is included, this does not mean, that a vulnerability is actually exploitable through the application using it.
Depending on how deep in a dependency chain some library is included, it could range from trivial to impossible, to trigger the flaw at all.
The application or top-level library using the vulnerable dependency might not even use the affected feature.
SBOMs of course cannot judge that, they only inform about a component being present, which is the only information that consumption systems can rely on.

A possible solution for this problem is a [Vulnerability Exploitability eXchange (VEX)](https://www.cisa.gov/sites/default/files/2023-01/VEX_Use_Cases_Aprill2022.pdf), basically a standardized security advisory.
CycloneDX supports including vulnerability information, which can be used to [build VEX](https://cyclonedx.org/capabilities/vex/).
For applications, this can only be sensibly done by the vendor though, otherwise every consumer would need to individually analyze an application.
For this reason, Tom Alrich also [argues](https://tomalrichblog.blogspot.com/2023/08/playing-pro-ball-vs-keeping-score-at.html), that it would be better for vendors to do these analyses themselves and communicate it to all their users/customers, kind of how security advisories already work, but standardized and integrated into automatic tools.

## Related Content

Chainguard published a [blog post](https://www.chainguard.dev/unchained/a-purl-of-wisdom-on-sboms-and-vulnerabilities) about using _purls_ in SBOMs.
It includes a description of the naming problem and an analysis of Grype as container and SBOM scanner.
The goal was to conclude how many false positives could be eliminated by including purls in the generated SBOMs.
They conclude that around 50-60% could be avoided.

Joseph Hejderup and Henrik Plate compared different tools to generate SBOMs in a case study as part of their presentation [_In SBOMs We Trust: How Accurate, Complete, and Actionable Are They?_](https://fosdem.org/2023/schedule/event/sbom_survey/) at FOSDEM 2023.
They analyze three tools, two generic ones and one generating SBOMs at build-time, and take a more in-depth look at the details and accuracy of the generated SBOMs.
They anonymize the tools they used, but from the list of tools I found as possible options, I suspect that the two generic solutions are Trivy and Syft.

Another comparison of SBOM generation tools is included in Shubham Girdhar's master thesis [Identification of Software Bill of Materials in Container Images](https://www.researchgate.net/publication/363196266_Identification_of_Software_Bill_of_Materials_in_Container_Images).
He compares Syft, Tern, Trivy and [Dagda](https://github.com/eliasgranderubio/dagda), which is not an SBOM tool but a security scanner.

In their article [_A comparative study of vulnerability reporting by software composition analysis tools_](https://doi.org/10.1145/3475716.3475769) ([pdf freely available here](https://nasifimtiazohi.github.io/assets/pdf/esem21.pdf)), Imtiaz, Thorn, and Williams compare vulnerability reporting tools for software supply chain.
Instead of SBOM tools they evaluate OWASP Dependency-Check, Snyk, GitHub Dependabot, Maven Security Versions, npm audit, Eclipse Steady and three unnamed commercial tools.
Their results are very similar to my findings for SBOM workflows, the number of reported vulnerabilities varies a lot, vulnerabilities can be duplicated, and depend on the identifiers used.

Xia et al. released [_An Empirical Study on Software Bill of Materials: Where We Stand and the Road Ahead_](https://doi.org/10.1109/ICSE48619.2023.00219) this year.
In their study, they do not compare SBOM tools, but instead interview "SBOM practitioners" to assess how SBOMs are used today and how that could be improved.
One of their findings is the immaturity of SBOM consumption tools.
Although Dependency-Track is mentioned and used a few times, respondents felt, while it was user-friendly, it was not enterprise-ready.

Interlynk maintains an [SBOM benchmark](https://sbombenchmark.dev/).
They rank SBOMs by calculating their own [quality score](https://github.com/interlynk-io/sbomqs) for them.

For accurately including CPEs in SBOMs, open source mappings between CPEs and purls exist.
Both [SCANOSS](https://github.com/scanoss/purl2cpe) and [nexB](https://github.com/nexB/vulnerablecode-purl2cpe) maintain a dataset.

## Conclusions

Generating SBOMs from containers and automatically, regularly analyzing them for vulnerabilities works, but the results are not as accurate as one would hope.
Generating SBOMs during build time rather than from containers images helps, but is not a workflow we can rely on for the _secureCodeBox_.
Some of the problems, like the naming problem, will get better in the future, but the road there is long and the schedule unclear.

For the _secureCodeBox_, we decided to implement an MVP by using Trivy to generate CycloneDX SBOMs and sending them to Dependency-Track with a [persistence hook](https://www.securecodebox.io/docs/hooks).
Trivy is [already used](https://www.securecodebox.io/docs/scanners/trivy) in the _secureCodeBox_, which makes generating SBOMs and maintenance easier.
Syft SBOMs might be better because of their included CPEs, but they mostly matter for the OS packages of a container.
If we feel that SBOMs with CPEs are needed, and Trivy has not added that feature, we can still integrate Syft in the future.
The _secureCodeBox_ architecture prioritizes configurability and composability, so we are also looking into generating SPDX SBOMs in the future.
