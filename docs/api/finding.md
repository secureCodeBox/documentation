---
title: "Finding"
---

## Structure Of A Finding

All scanners integrated in the secureCodeBox create findings objects.
These findings all contain the same set of fields listed in the example below.

```yaml
{
  # Unique uuid4 for the finding
  "id": "e18cdc5e-6b49-4346-b623-28a4e878e154",
  # name contains a short description of the finding
  "name": "Open mysql Port",
  # In depth description, can span multiple paragraphs
  "description": "Port 3306 is open using tcp protocol.",
  # The category is often used to group finding based on their types
  "category": "Open Port",
  # OSI network layer the finding fits into
  "osi_layer": "NETWORK",
  # One of "INFORMATIONAL", "LOW", "MEDIUM", "HIGH"
  "severity": "INFORMATIONAL",
  # Attributes are not standardized. They differ from scanner to scanner
  "attributes": {
    "port": 3306,
    "state": "open",
    "ip_address": "198.51.100.42",
    "mac_address": null,
    "protocol": "tcp",
    "hostname": "example.com",
    "method": "table",
    "operating_system": null,
    "service": "mysql",
    "serviceProduct": null,
    "serviceVersion": null,
    "scripts": null
  },
  # Full url with protocol, port, and path if existing
  "location": "tcp://127.0.0.1:3306",
  "finding_hash": "some-sha256-hash"
}
```

## Hashes of Findings and False Positive Handling

To manage false positives and duplicate findings we need to calculate a Hash over each finding for filtering.
Because scanners define different attributes for their findings we need to specify which attributes are used for the Hash by each parser and each hook that modifies findings.

### How The Hash Is calculated

The hash is calculated using the *sha256* algorithm.
For the calculation of the hash the following properties of all findings have to be included:
- name
- description
- category
- osi_layer
- severity
- attributes
- location

:::info
Notice that `id` is unique for every finding and thus should not be included in the calculation of the hash. Other unique fields need to be ignored as well.
:::

:::caution
The `attributes` are different for every scanner as mentioned above.
This requires that we define which properties are used for the calculation of the hash for each scanner.
Which fields are included in the hash is defined for each scanner in our documentation (See: [secureCodeBox | Scanners](/docs/scanners)).
:::

### Where The Hash Is calculated

Because the hash has to be mutable (See: [GitHub/secureCodeBox | ADR-0007](https://github.com/secureCodeBox/secureCodeBox/blob/main/docs/adr/adr_0007.adoc)), we have to calculate this hash everytime we alter a finding.
This means the hash has to be calculated in the parser for *every* scanner and in *some* of the hooks.

