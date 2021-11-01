---
# SPDX-FileCopyrightText: 2021 iteratec GmbH
#
# SPDX-License-Identifier: Apache-2.0

title: values.yaml
---

The final `values.yaml` will look something like this:

```yaml
# Default values for dispatcher.
# This is a YAML-formatted file.
# Declare variables to be passed into your templates.

# webhookUrl -- The URL of your WebHook endpoint
webhookUrl: "http://example.com"

hook:
  image:
    # hook.image.repository -- Hook image repository
    repository: docker.io/securecodebox/hook-generic-webhook
    # hook.image.tag -- The image Tag defaults to the charts version if not defined.
    # @default -- defaults to the charts version
    tag: null

  # -- Hook priority. Higher priority Hooks are guaranteed to execute before low priority Hooks.
  priority: null

  # hook.ttlSecondsAfterFinished -- Seconds after which the kubernetes job for the hook will be deleted. Requires the Kubernetes TTLAfterFinished controller: https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/
  ttlSecondsAfterFinished: null
```

## image

The `image` field specifies the Docker image that is used for your hook.
The `repository` specifies Registry and Namespace and `tag` defines the desired image tag.
These are the only mandatory fields for a hook to work.

## Priority

You can specify the priority of the hook with `hook.priorty`.
By default, this priority should be zero since they regard deployment-specific configurations which the secureCodeBox team does not manage.

## Additional Values

If your hook needs some additional information like an URL (`webhookUrl` in the example above), environment variables or volume mounts, you need to provide an option to specify them in your `values.yaml` and access them in the hook implementation (See [templates](docs/contributing/integrating-a-hook/templates-dir) for information on how to access the provided values, and [ScanCompletionHook](/docs/api/crds/scan-completion-hook) for a list of possible keys you can set in the template).
