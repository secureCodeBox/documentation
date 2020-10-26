---
title: "Integrating a new Scanner"
---

> 🔧 Documentation Coming Soon

In the *secureCodeBox* we created new *Custom Resource Definitions* (CRD) for Kubernetes to manage scanners (*ScanType*) and hooks (see [Custom Resource Definitions](/docs/api/crds)).
To add a new Scanner you need to add a new *ScanType* (see [ScanType](/docs/api/crds/scan-type)) and a parser for its results.

To create a new Helm Chart for your scanner you can use the following command (replace *new-scanner* with the name of the scanner):

```bash
helm create new-scanner
```

This command will create a new directory named *new-scanner* and some template files provided by `helm` to simplify the creation of Helm Charts (see [Helm | Getting Started](https://helm.sh/docs/chart_template_guide/getting_started/)). 

## Chart.yaml

The `Chart.yaml` is a basic description of your scanner helm chart and will look something like the following:

```yaml
apiVersion: v2
name: new-scanner
description: A Helm chart for Kubernetes

# A chart can be either an 'application' or a 'library' chart.
#
# Application charts are a collection of templates that can be packaged into versioned archives
# to be deployed.
#
# Library charts provide useful utilities or functions for the chart developer. They're included as
# a dependency of application charts to inject those utilities and functions into the rendering
# pipeline. Library charts do not define any templates and therefore cannot be deployed.
type: application

# This is the chart version. This version number should be incremented each time you make changes
# to the chart and its templates, including the app version.
# Versions are expected to follow Semantic Versioning (https://semver.org/)
version: 0.1.0

# This is the version number of the application being deployed. This version number should be
# incremented each time you make changes to the application. Versions are not expected to
# follow Semantic Versioning. They should reflect the version the application is using.
appVersion: 1.16.0
```

### apiVersion

The `apiVersion` sets the used Chart API version of Helm.
You won't have to change this field.

### name

The `name` field should be set to the name of the scanner.
You won't have to change this field.

### description

Please change the `description` field to explain the basic purpose of your scanner.
For *WPScan* the `description` would be:

```yaml
description: A Helm chart for the WordPress security scanner that integrates with the secureCodeBox. 
```

### version and appVersion

The fields for `version`  will be set automatically by our release process.
The `appVersion` should be set to the Version of the scanner. If the scanner does not use versions please use `latest`.
Please set both values:

```yaml
version: latest
appVersion: latest
```

### kubeVersion

The `kubeVersion` references the version of kubernetes that is required to run your Helm Chart.
Please add `kubeVersion` with the value `">=v1.11.0-0"`

```yaml
kubeVersion: ">=v1.11.0-0"
```

### keywords

The `keywords` field makes it possible to specify a list of keywords about this project.
For the WPScan `keywords` would look the following:

```yaml
keywords:
  - security
  - wpscan
  - wordpress
  - scanner
  - secureCodeBox
```

### home

The `home` field should be set to the home page of the project.
For WPScan this would be:

```yaml
home: https://docs.securecodebox.io/docs/scanners/WPScan
```

### icon

The `icon` field should be set to the URL to a SVG or PNG (if existing).
For WPScan `icon` would look the following:

```yaml
icon: https://docs.securecodebox.io/img/integrationIcons/WPScan.svg
```

### sources

The `sources` field should be set the the URL of the *secureCodeBox* repository:

```yaml
sources:
  - https://github.com/secureCodeBox/secureCodeBox
```

### maintainers

The `maintainers` field should contain the following values:

```yaml
maintainers:
  - name: iteratec GmbH
  - email: secureCodeBox@iteratec.com
```

## values.yaml

The `values.yaml` is also created by `helm create new-scanner`.
It should look something like this:

```yaml

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: false
  annotations: {}
    # kubernetes.io/ingress.class: nginx
    # kubernetes.io/tls-acme: "true"
  hosts:
    - host: chart-example.local
      paths: []
  tls: []
  #  - secretName: chart-example-tls
  #    hosts:
  #      - chart-example.local

resources: {}
  # We usually recommend not to specify default resources and to leave this as a conscious
  # choice for the user. This also increases chances charts run on environments with little
  # resources, such as Minikube. If you do want to specify resources, uncomment the following
  # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
  # limits:
  #   cpu: 100m
  #   memory: 128Mi
  # requests:
  #   cpu: 100m
  #   memory: 128Mi

autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 100
  targetCPUUtilizationPercentage: 80
  # targetMemoryUtilizationPercentage: 80

nodeSelector: {}

tolerations: []

affinity: {}
```

Most of these generated fields are not necessary for the *secureCodeBox*. In the following we will describe the important fields.

### image

The `image` field contains the Docker Image and Tag used for the scanner.
This could be the official Image of the scanner but in some cases a custom Image is needed.
Usually the `tag` of the Image is `null` and will default to the charts `appVersion`.
For WPScan the official image can be used so the `image` field looks like this:

```yaml
image:
  repository: wpscanteam/wpscan
  tag: null
```

### parserImage

The `parserImage` field specifies the Docker Image with the parser for the scanner.
This will always be a custom Image containing the Parser SDK and the parser (see Parser SDK).
Like in `image` the `tag` will default to the charts `appVersion` and should be `null` in `values.yaml`.
For WPScan `parserImage` looks like this:

```yaml
parserImage:
  repository: docker.io/securecodebox/parser-wpscan
  tag: null
```

### scannerJob

`scannerJob` defines multiple properties for the Scan Job including resources, evironment variables, volumes and security context.
A basic `scannerJob` could look like the following.

```yaml
scannerJob:
  ttlSecondsAfterFinished: null
  resources: {}
  env: []
  extraVolumes: []
  extraVolumeMounts: []
  extraContainers: []
  securityContext: {}
  ```

#### ttlSecondsAfterFinished

Defines how long the scanner job after finishing will be available (see: [TTL Controller for Finished Resources | Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/)

#### resources

The `resources` field can limit or request resources for the scan job (see: [Managing Resources For Containers | Kubernetes](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/))
An basic example could be the following:

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

#### env

Optional environment variables mapped into each scanJob (see: [Define Environment Variables for a Container | Kubernetes](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/)).

#### extraVolumes

Optional Volumes mapped into each scanJob (see: [Volumes | Kubernetes](https://kubernetes.io/docs/concepts/storage/volumes/)).

#### extraVolumeMounts

Optional VolumeMounts mapped into each scanJob (see: [Volumes | Kubernetes](https://kubernetes.io/docs/concepts/storage/volumes/)).

#### extraContainers

Optional additional Containers started with each scanJob (see: [Init Containers | Kubernetes](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/)).

#### securityContext

Optional securityContext set on scanner container (see: [Configure a Security Context for a Pod or Container | Kubernetes](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/)).

## templates

The `templates` direcory contains multiple files and dirs per default.
Those are not needed and should be deleted.
For the *secureCodeBox* we will need files for the `ScanType`, `ParseDefinition` and `CascadingRule`.
Please replace *new-scanner* with the name of your scanner for the following files.

### new-scanner-scan-type.yaml

This file contains the Specification of your `ScanType`.
Please take a look at [ScanType | secureCodeBox](/docs/api/crds/scan-type) on how to configure your `ScanType`.

### new-scanner-parse-definition.yaml

this file contains the ParseDefinition of your scanner.
Please take a look at [ParseDefinitino | secureCodeBox](/docs/api/crds/parse-definition) on how to configure your `ParseDefinition`.

### cascading-rules.yaml

The `CascadingRules` define under which conditions your scanner will be run after other scanners.
Please take a look at [CascadingRule | secureCodeBox](/docs/api/crds/cascading-rule) on how to configure your `CascadingRules`.

> ✍ **Following...**

## Parsing SDK

1. Install the dependencies `npm install`
2. Update the parser function here: `./parser/parser.js`
3. Update the parser tests here: `./parser/parser.test.js`
4. Run the test suite: `npm test`

