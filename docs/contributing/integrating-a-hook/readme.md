---
title: README.md And README.gotmpl
---

You may have noticed that all our hooks provide a `README.md` as well as a `README.md.gotmpl`.
The reason for this is that we want to provide the documentation of our Helm values directly in our `README.md`.
To avoid the need to do this task manually we use a tool that creates a table with all our values directly from our `values.yaml`.
Therefore there is no need to make any changes on the `README.md` it self.
Every change has to be made in the `README.md.gotmpl` file.

The `README.md.gotmpl` should contain basic information about your hook like its purpose, how it is deployed, how it is configured as well as its Chart configurations generated out of the `values.yaml`.
For example the `README.md.gotmpl` for *WPScan* looks like this:

```markdown
---
title: "Generic WebHook"
category: "hook"
type: "integration"
state: "released"
usecase: "Publishes Scan Findings as WebHook."
---

<!-- end -->
This Hook will make a request to the specified `webhookUrl` containing the findings in its request body.

## Deployment

Installing the Generic WebHook hook will add a ReadOnly Hook to your namespace.
Change `webhookUrl` to your desired endpoint.

helm upgrade --install gwh secureCodeBox/generic-webhook --set webhookUrl="http://example.com/my/webhook/target"

## Chart Configuration

{{ template "chart.valuesTable" . }}
```

If you want to generate the `README.md` out of your `README.md.gotmpl` locally, you can use `helm-docs` (see: [https://github.com/norwoodj/helm-docs/](https://github.com/norwoodj/helm-docs/)).
