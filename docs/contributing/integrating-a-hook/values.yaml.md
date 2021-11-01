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

image:
  # image.tag - defaults to the charts version
  # image.repository -- Hook image repository
  repository: docker.io/securecodebox/generic-webhook
  # parserImage.tag -- Parser image tag
  # @default -- defaults to the charts version
  tag: null
```

## image

The `image` field specifies the Docker image that is used for your hook.
The `repository` specifies Registry and Namespace and `tag` defines the desired image tag.
These are the only mandatory fields for a hook to work.

## ENVs and Volumes

If your hook needs some additional information like an URL (`webhookUrl`) in the example above you need to provide an option to specify them in your `values.yaml` (See: [ScanCompletionHook | secureCodeBox](/docs/api/crds/scan-completion-hook)).

:::info
Currently only ENVs are supported for hooks but we are working on supporting Volumes in the future as well.
:::

## Priority

You can specify the priority of the hook with `hook.priorty`.
By default, this priority should be zero since they regard deployment-specific configurations which the secureCodeBox team does not manage.
