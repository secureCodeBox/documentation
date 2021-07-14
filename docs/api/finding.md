---
# SPDX-FileCopyrightText: 2021 iteratec GmbH
#
# SPDX-License-Identifier: Apache-2.0

title: "Finding"
---

All scanners integrated in the secureCodeBox create findings objects.
In secureCodeBox v3 the Findings comply with the following JSON Schema (Draft-04).

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
        "tcp_ip_stack_layer":{
          "type": "string",
          "description": "TCP/IP Reference Model Layer that the Finding fits into.",
          "nullable": true,
          "enum": [
            "LINK",
            "INTERNET",
            "TRANSPORT",
            "APPLICATION"
          ]
        },
        "osi_layer": {
          "description": "OSI Layer the finding fits into. This will be replaced by the field tcp_ip_stack_layer in secureCodeBox v3.",
          "type": "string",
          "enum": [
            "NETWORK_INTERFACE",
            "NETWORK",
            "TRANSPORT",
            "APPLICATION",
            "NOT_APPLICABLE",
            "PRESENTATION"
          ]
        },
        "severity": {
          "description": "Indicates the severity of the finding.",
          "type": "string",
          "enum": [
            "INFORMATIONAL",
            "LOW",
            "MEDIUM",
            "HIGH",
            "CRITICAL",
            "UNKNOWN"
          ]
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
        "parsed_at"
      ]
    }
  }
}
```

An example findings object is shown below:

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
