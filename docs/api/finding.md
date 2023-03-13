---
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

title: "Finding"
---

All scanners integrated in the secureCodeBox create a JSON-Array of Findings objects.
The 'findings.json' file that contains these Findings complies with the following JSON Schema (Draft-04).

```yaml
{
  "$schema": "http://json-schema.org/draft-04/schema",
  "type": "array",
  "description": "Array of Findings.",
  "items": {
    "$ref": "#/$defs/finding"
  },
  "$defs": {
    "finding": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "id": {
          "description": "The unique identifier for a Finding according to RFC4122.",
          "type": "string",
          "format": "uuid"
        },
        "identified_at": {
          "description": "Date-Time when the Finding was exactly identified according to ISO8601. This information will often not be present.",
          "type": "string",
          "format": "date-time"
        },
        "parsed_at": {
          "description": "Date-Time when the Finding was parsed according to ISO8601. This information will always be present.",
          "type": "string",
          "format": "date-time"
        },
        "name": {
          "description": "Contains a short description of the Finding.",
          "type": "string"
        },
        "description": {
          "description": "In depth description, can span multiple paragraphs.",
          "type": "string",
          "nullable": true
        },
        "category": {
          "description": "Is often used to group finding based on their types.",
          "type": "string"
        },
        "severity": {
          "description": "Indicates the severity of the finding.",
          "type": "string",
          "enum": [
            "INFORMATIONAL",
            "LOW",
            "MEDIUM",
            "HIGH"
          ]
        },
        "mitigation": {
          "description": "Contains a short description of how to mitigate the issue.",
          "type": "string",
          "nullable": true
        },
        "attributes": {
          "description": "Attributes are not standardized. They differ from Scanner to Scanner.",
          "type": "object"
        },
        "location": {
          "description": "Full URL with protocol, port, and path if existing.",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "id",
        "parsed_at",
        "severity",
        "category",
        "name"
      ]
    }
  }
}
```

An example findings object is shown below:

```yaml
{
  "id": "e18cdc5e-6b49-4346-b623-28a4e878e154",
  "name": "Open mysql Port",
  "description": "Port 3306 is open using tcp protocol.",
  "category": "Open Port",
  "parsed_at": "2021-06-22T12:27:28.153Z",
  "identified_at": "2021-06-22T12:26:54.378Z",
  "mitigation": null,
  "severity": "INFORMATIONAL",
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
  "location": "tcp://127.0.0.1:3306"
}
```
