---
# SPDX-FileCopyrightText: 2021 iteratec GmbH
#
# SPDX-License-Identifier: Apache-2.0

title: values.yaml
---

The `values.yaml` is also created by `helm create new-scanner`.
Most of these generated fields are not necessary for the *secureCodeBox*.
In the following we will describe the important fields.
The final `values.yaml` will look something like this:

```yaml
image:
  repository: docker.io/securecodebox/scanner-nmap
  tag: null

parserImage:
  repository: docker.io/securecodebox/parser-nmap
  tag: null

scannerJob:
  ttlSecondsAfterFinished: null

  resources: {}
     resources:
       requests:
         memory: "256Mi"
         cpu: "250m"
       limits:
         memory: "512Mi"
         cpu: "500m"

  env: []

  extraVolumes: []

  extraVolumeMounts: []

  extraContainers: []

  securityContext:
    runAsNonRoot: true
    readOnlyRootFilesystem: true
    allowPrivilegeEscalation: false
    privileged: false
    capabilities:
      drop:
        - all
```

## image

The `image` field contains the container image and tag used for the scanner.
This could be the official image of the scanner but in some cases a custom image is needed.
Usually the `tag` of the image is `null` and will default to the charts `appVersion`.
See below how to use a local docker image.
For WPScan the official image can be used so the `image` field looks like this:

```yaml
image:
  repository: wpscanteam/wpscan
  tag: null
```

## parserImage

The `parserImage` field specifies the container image with the parser for the scanner.
This will always be a custom image containing the Parser SDK and the parser (see Parser SDK).
Like in `image` the `tag` will default to the charts `appVersion` and should be `null` in `values.yaml`.
For WPScan `parserImage` looks like this:

```yaml
parserImage:
  repository: docker.io/securecodebox/parser-wpscan
  tag: null
```

## scannerJob

`scannerJob` defines multiple properties for the Scan Job including resources, environment variables, volumes and security context.
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

### ttlSecondsAfterFinished

Defines how long the scanner job after finishing will be available (see: [TTL Controller for Finished Resources | Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/)).

### resources

The `resources` field can limit or request resources for the scan job (see: [Managing Resources For Containers | Kubernetes](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)).
A basic example could be the following:

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### env

Optional environment variables mapped into each scanJob (see: [Define Environment Variables for a Container | Kubernetes](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/)).

### extraVolumes

Optional Volumes mapped into each scanJob (see: [Volumes | Kubernetes](https://kubernetes.io/docs/concepts/storage/volumes/)).

### extraVolumeMounts

Optional VolumeMounts mapped into each scanJob (see: [Volumes | Kubernetes](https://kubernetes.io/docs/concepts/storage/volumes/)).

### extraContainers

Optional additional Containers started with each scanJob (see: [Init Containers | Kubernetes](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/)).

### securityContext

Optional securityContext set on scanner container (see: [Configure a Security Context for a Pod or Container | Kubernetes](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/)).


## Using local images

If you are integrating a new scanner and want to test your scanner and parser image from a local build, you can follow
these steps:

1. Create your parser and scanner Dockerfiles
2. Change the tags in values.yaml file like this:
```yaml
 parser:
  image:
    repository: your-custom-parser
    pullPolicy: IfNotPresent
scanner:
  image:
    repository: your-custom-scanner
    pullPolicy: IfNotPresent
```
3. Build your parser, using the **version** from Chart.yaml (e.g. v3.1.0-alpha1):
```bash
cd your-custom-scanner/parser/
docker build --tag your-custom-parser:(version) . 
```
4. Build your scanner, using the **appVersion** from Chart.yaml (e.g. 1.0.0):
```bash
cd your-custom-scanner/scanner/
docker build --tag your-custom-scanner:(appVersion) . 
```
5. Load both images into your cluster, e.g. using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#loading-an-image-into-your-cluster):
```bash
kind load docker-image your-custom-parser:(version)
kind load docker-image your-custom-scanner:(appVersion)
```
Check images in cluster:
```bash
docker exec -it kind-control-plane crictl images
```
6. When all files are ready, install via helm:
```bash
cd securecodebox/
helm upgrade --install your-custom-scanner scanners/your-custom-scanner
```
