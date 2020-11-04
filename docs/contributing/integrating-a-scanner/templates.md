---
title: templates (Directory)
---

The `templates` direcory contains multiple files and dirs per default.
Those are not needed and should be deleted.
For the *secureCodeBox* we will need files for the `ScanType`, `ParseDefinition` and `CascadingRule`.
Please replace *new-scanner* with the name of your scanner for the following files.

### new-scanner-scan-type.yaml

This file contains the Specification of your `ScanType`.
Please take a look at [ScanType | secureCodeBox](/docs/api/crds/scan-type) on how to configure your `ScanType`.

### new-scanner-parse-definition.yaml

This file contains the ParseDefinition of your scanner.
Please take a look at [ParseDefinitino | secureCodeBox](/docs/api/crds/parse-definition) on how to configure your `ParseDefinition`.

### cascading-rules.yaml

The `CascadingRules` define under which conditions your scanner will be run after other scanners.
Please take a look at [CascadingRule | secureCodeBox](/docs/api/crds/cascading-rule) on how to configure your `CascadingRules`.
The CascadingRules are not directly in the /templates directory as their curly bracket syntax clashes with helms templates.
We import them as raw files to avoid these clashes as escaping them is even more messy.
Your `cascading-rules.yaml` should look like the following:

```yaml
{{ range $path, $_ :=  .Files.Glob  "cascading-rules/*" }}
# Include File
{{ $.Files.Get $path }}
# Separate multiple files
---
{{ end }}
```

