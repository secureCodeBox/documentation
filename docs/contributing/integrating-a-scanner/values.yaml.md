---
title: values.yaml
---

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

## image

The `image` field contains the Docker Image and Tag used for the scanner.
This could be the official Image of the scanner but in some cases a custom Image is needed.
Usually the `tag` of the Image is `null` and will default to the charts `appVersion`.
For WPScan the official image can be used so the `image` field looks like this:

```yaml
image:
  repository: wpscanteam/wpscan
  tag: null
```

## parserImage

The `parserImage` field specifies the Docker Image with the parser for the scanner.
This will always be a custom Image containing the Parser SDK and the parser (see Parser SDK).
Like in `image` the `tag` will default to the charts `appVersion` and should be `null` in `values.yaml`.
For WPScan `parserImage` looks like this:

```yaml
parserImage:
  repository: docker.io/securecodebox/parser-wpscan
  tag: null
```

## scannerJob

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

### ttlSecondsAfterFinished

Defines how long the scanner job after finishing will be available (see: [TTL Controller for Finished Resources | Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/)

### resources

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


