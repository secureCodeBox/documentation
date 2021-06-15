---
# SPDX-FileCopyrightText: 2021 iteratec GmbH
#
# SPDX-License-Identifier: Apache-2.0

title: templates (Directory)
---

## new-hook.yaml

This file contains the specification of your new hook. Please take a look at [ScanCompletionHook | secureCodeBox](/docs/api/crds/scan-completion-hook) on how to configure your `ScanCompletionHook`

## Example

```yaml
apiVersion: "execution.securecodebox.io/v1"
kind: ScanCompletionHook
metadata:
  name: {{ include "generic-webhook.fullname" . }}
spec:
  type: ReadOnly
  image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.Version }}"
  env:
    - name: WEBHOOK_URL
      value: {{ .Values.webhookUrl | quote }}```

