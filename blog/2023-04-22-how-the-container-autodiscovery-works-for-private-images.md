---
title: How the Container AutoDiscovery Works for Private Images
author: Jannik Hollenbach
author_title: Core Team Member
author_url: https://infosec.exchange/@jannik
author_image_url: https://avatars.githubusercontent.com/u/13718901?v=4
tags:
  - secureCodeBox
  - AutoDiscovery
  - v4
description: "How the v4 Container AutoDiscovery handles private images"
draft: true
---

At the first introduction of the Container AutoDiscovery we only supported public images.
This was obviously not ideal as this blocks most people from rolling out the auto-discovery.
With the release of secureCodeBox v4 this limitation is lifted as the AutoDiscovery now also works for all images 🚀

In this blog post I'd like to share what the original problem was and how the v4 AutoDiscovery has solved it.

## The Problem

First lets look at an example `Pod` to get same context.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  imagePullSecrets:
    - name: dockerhub-pull-secret
    - name: github-pull-secret
  containers:
    - image: docker.io/securecodebox/foobar:v42
      name: dockerhub-image
    - image: ghcr.io/securecodebox/foobar:v42
      name: github-image
```

This pod consist of two containers. One is pulled from dockerhub and one from github.
To pull the images from registry Kubernetes will use the referenced imagePullSecrets. The secrets contain a `.dockerconfigjson` which has the following format:

```yaml
{ "auths": { "https://index.docker.io/v1/": { "auth": "c3R...zE2" } } }
```

Kubernetes will pick out the secret with a matching registry credential to pull the image.

For this pod the Container AutoDiscovery would create two scans. One for `docker.io/securecodebox/foobar:v42` and one for `ghcr.io/securecodebox/foobar:v42`. For the scan to work it needs to pass in the correct container registry credentials to the scanner (e.g. trivy) so that the scanner can pull the image from the registry.

For more information on imagePullSecrets check out the Kubernetes docs. [Pull an Image from a Private Registry](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)

This is problematic as the AutoDiscovery would need RBAC rights to fetch all secrets on the entire cluster to be able to do this across namespaces, and would also mean that the AutoDiscovery would regularly need to fetch these secrets and parse them. As these are sensitive credentials and with the RBAC requirements we'd also be allowed to read any other secret on the cluster. As we'd like keep the privileges the AutoDiscovery need to a minimum this poses quite a problem to the AutoDiscovery which is why the initial implementation skipped Pods with private images.

## The Solution

To workaround the issue Simon (https://github.com/the-simmon) came up with the following brilliant solution.

When we start container scans for private images the AutoDiscovery will automatically include a init container which mounts all of the references image pull secrets. This init container will then parse the docker config json files and pick out the one with the matching registry. For the credentials it will then create a new (temporary) secret with a username and password attribute. This secret is created with a ownerReference set to the current scan pod so it will be automatically cleaned up by kubernetes when the scan is finished.

The AutoDiscovery also already configured the scan pod to mount the username and password field from this temporary secret as environment variables so the the scanner can easily use the credentials to pull the image from the registry and run it scan.

As the scan is running inside the namespace where the imagePullSecrets are located the secrets are never shared across namespace boundaries and no cluster wide RBAC permissions are needed.
