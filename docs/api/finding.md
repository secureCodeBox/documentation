---
# SPDX-FileCopyrightText: 2021 iteratec GmbH
#
# SPDX-License-Identifier: Apache-2.0

title: "Finding"
---

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
  "location": "tcp://127.0.0.1:3306"
}
```
