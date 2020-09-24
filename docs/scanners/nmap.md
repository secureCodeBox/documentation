---
title: "Nmap"
path: "scanners/nmap"
category: "scanner"
type: "Network"
state: "released"
appVersion: "7.80"
usecase: "Network discovery and security auditing"
---

![Nmap logo](https://nmap.org/images/sitelogo.png)

Nmap ("Network Mapper") is a free and open source (license) utility for network discovery and security auditing. Many systems and network administrators also find it useful for tasks such as network inventory, managing service upgrade schedules, and monitoring host or service uptime.

To learn more about the Nmap scanner itself visit [nmap.org].

<!-- end -->

## Deployment

The Nikto ScanType can be deployed via helm:

```bash
helm upgrade --install nmap ./scanners/nmap/
```

## Nmap Configuration

The nmap scan target is set via the targets location of the securityTest. The target should be a Hostname or an IP Address.

Additional nmap scan features can be configured via the parameter attribute. For a detailed explanation to which parameters are available refer to the [Nmap Reference Guide](https://nmap.org/book/man.html). All parameters are supported, but be careful with parameters that require root level rights, as these require additional configuration on the ScanType to be supported.

Some useful example parameters listed below:

- `-p` xx: Scan ports of the target. Replace xx with a single port number or
  a range of ports.
- `-PS`, `-PA`, `-PU` xx: Replace xx with the ports to scan. TCP SYN/ACK or
  UDP discovery.
- `-sV`: Determine service and version info.
- `-O`: Determine OS info. **Note:** This requires the the user to be run as root or the system capabilities to be extended to allow nmap to send raw sockets. See more information on [how to deploy the secureCodeBox nmap container to allow this](https://github.com/secureCodeBox/scanner-infrastructure-nmap/pull/20) and the [nmap docs about priviliged scans](https://secwiki.org/w/Running_nmap_as_an_unprivileged_user)
- `-A`: Determine service/version and OS info.
- `-script` xx: Replace xx with the script name. Start the scan with the given script.
- `--script` xx: Replace xx with a coma-separated list of scripts. Start the scan with the given scripts.




## Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### demo-app-ssh



<Tabs
defaultValue="scan"
values={[
    { label: "Scan", value: "scan" },
    { label: "Findings", value: "findings" },
]}>

<TabItem value="scan">

```yaml
apiVersion: "execution.experimental.securecodebox.io/v1"
kind: Scan
metadata:
  name: "nmap-ssh-demo-cluster-internal"
spec:
  scanType: "nmap"
  parameters:
    # Internal cluster is blocking our ping probes, therefore we skip them
    - "-Pn"
    # Service Detection enabled
    - "-sV"
    # Actual Service Address will depend on you cluster and namespace configuration. 🤷‍
    - "dummy-ssh.demo-apps.svc"

```

</TabItem>

<TabItem value="findings">

```yaml
[
    {
        "name": "ssh",
        "description": "Port 22 is open using tcp protocol.",
        "category": "Open Port",
        "location": "tcp://10.102.131.102:22",
        "osi_layer": "NETWORK",
        "severity": "INFORMATIONAL",
        "attributes": {
            "port": 22,
            "state": "open",
            "ip_address": "10.102.131.102",
            "mac_address": null,
            "protocol": "tcp",
            "hostname": "dummy-ssh.demo-apps.svc",
            "method": "probed",
            "operating_system": null,
            "service": "ssh",
            "serviceProduct": "OpenSSH",
            "serviceVersion": "7.2p2 Ubuntu 4ubuntu2.8",
            "scripts": null
        },
        "id": "e4898564-07b6-4593-9496-5db7fb125c51"
    },
    {
        "name": "Host: dummy-ssh.demo-apps.svc",
        "category": "Host",
        "description": "Found a host",
        "location": "dummy-ssh.demo-apps.svc",
        "severity": "INFORMATIONAL",
        "osi_layer": "NETWORK",
        "attributes": {
            "ip_address": "10.102.131.102",
            "hostname": "dummy-ssh.demo-apps.svc",
            "operating_system": null
        },
        "id": "584bc8ff-d6e0-48a0-9e58-40f8247b90f3"
    }
]
```

</TabItem>

</Tabs>

### demo-juice-shop



<Tabs
defaultValue="scan"
values={[
    { label: "Scan", value: "scan" },
    { label: "Findings", value: "findings" },
]}>

<TabItem value="scan">

```yaml
apiVersion: "execution.experimental.securecodebox.io/v1"
kind: Scan
metadata:
  name: "nmap-juice-shop-cluster-internal"
spec:
  scanType: "nmap"
  parameters:
    # Internal cluster is blocking our ping probes, therefore we skip them
    - "-Pn"
    # Service Detection enabled
    - "-sV"
    # Actual Service Address will depend on you cluster and namespace configuration. 🤷‍
    - juice-shop.demo-apps.svc.cluster.local

```

</TabItem>

<TabItem value="findings">

```yaml
[
    {
        "name": "http",
        "description": "Port 3000 is open using tcp protocol.",
        "category": "Open Port",
        "location": "tcp://10.111.199.4:3000",
        "osi_layer": "NETWORK",
        "severity": "INFORMATIONAL",
        "attributes": {
            "port": 3000,
            "state": "open",
            "ip_address": "10.111.199.4",
            "mac_address": null,
            "protocol": "tcp",
            "hostname": "juice-shop.demo-apps.svc.cluster.local",
            "method": "probed",
            "operating_system": null,
            "service": "http",
            "serviceProduct": "Node.js Express framework",
            "serviceVersion": null,
            "scripts": null
        },
        "id": "a9ec9f11-4cfa-461b-85c0-57ea31162112"
    },
    {
        "name": "Host: juice-shop.demo-apps.svc.cluster.local",
        "category": "Host",
        "description": "Found a host",
        "location": "juice-shop.demo-apps.svc.cluster.local",
        "severity": "INFORMATIONAL",
        "osi_layer": "NETWORK",
        "attributes": {
            "ip_address": "10.111.199.4",
            "hostname": "juice-shop.demo-apps.svc.cluster.local",
            "operating_system": null
        },
        "id": "080d888a-a9bc-4c74-8d03-c4c6cc40238d"
    }
]
```

</TabItem>

</Tabs>

### local-network



<Tabs
defaultValue="scan"
values={[
    { label: "Scan", value: "scan" },
    { label: "Findings", value: "findings" },
]}>

<TabItem value="scan">

```yaml
apiVersion: "execution.experimental.securecodebox.io/v1"
kind: Scan
metadata:
  name: "nmap-local-network"
spec:
  scanType: "nmap"
  parameters:
    # Actual IP will depend on you network config. 🤷‍
    - 192.168.178.0/24

```

</TabItem>

<TabItem value="findings">

```yaml
[
  {
    "name": "Host: fritz.box",
    "category": "Host",
    "description": "Found a host",
    "location": "fritz.box",
    "severity": "INFORMATIONAL",
    "osi_layer": "NETWORK",
    "attributes": {
      "ip_address": "192.168.178.1",
      "hostname": "fritz.box",
      "operating_system": null
    },
    "id": "e0752104-b144-469c-92b7-1fdbc8fe7bd7"
  },
  {
    "name": "domain",
    "description": "Port 53 is open using tcp protocol.",
    "category": "Open Port",
    "location": "tcp://192.168.178.1:53",
    "osi_layer": "NETWORK",
    "severity": "INFORMATIONAL",
    "attributes": {
      "port": 53,
      "state": "open",
      "ip_address": "192.168.178.1",
      "mac_address": null,
      "protocol": "tcp",
      "hostname": "fritz.box",
      "method": "table",
      "operating_system": null,
      "service": "domain",
      "serviceProduct": null,
      "serviceVersion": null,
      "scripts": null
    },
    "id": "fc3477a1-f939-4082-87da-cb9ecd839ba4"
  },
  {
    "name": "http",
    "description": "Port 80 is open using tcp protocol.",
    "category": "Open Port",
    "location": "tcp://192.168.178.1:80",
    "osi_layer": "NETWORK",
    "severity": "INFORMATIONAL",
    "attributes": {
      "port": 80,
      "state": "open",
      "ip_address": "192.168.178.1",
      "mac_address": null,
      "protocol": "tcp",
      "hostname": "fritz.box",
      "method": "table",
      "operating_system": null,
      "service": "http",
      "serviceProduct": null,
      "serviceVersion": null,
      "scripts": null
    },
    "id": "e7a47bc6-4a14-4e94-b3c2-04e8ea6bde5e"
  },
  {
    "name": "https",
    "description": "Port 443 is open using tcp protocol.",
    "category": "Open Port",
    "location": "tcp://192.168.178.1:443",
    "osi_layer": "NETWORK",
    "severity": "INFORMATIONAL",
    "attributes": {
      "port": 443,
      "state": "open",
      "ip_address": "192.168.178.1",
      "mac_address": null,
      "protocol": "tcp",
      "hostname": "fritz.box",
      "method": "table",
      "operating_system": null,
      "service": "https",
      "serviceProduct": null,
      "serviceVersion": null,
      "scripts": null
    },
    "id": "a7a12bb6-bb33-469e-9f30-2e91b280ffcd"
  },
  {
    "name": "sip",
    "description": "Port 5060 is open using tcp protocol.",
    "category": "Open Port",
    "location": "tcp://192.168.178.1:5060",
    "osi_layer": "NETWORK",
    "severity": "INFORMATIONAL",
    "attributes": {
      "port": 5060,
      "state": "open",
      "ip_address": "192.168.178.1",
      "mac_address": null,
      "protocol": "tcp",
      "hostname": "fritz.box",
      "method": "table",
      "operating_system": null,
      "service": "sip",
      "serviceProduct": null,
      "serviceVersion": null,
      "scripts": null
    },
    "id": "ebf2f79e-415c-4837-8a68-d60070b1befa"
  },
  {
    "name": "unknown",
    "description": "Port 8089 is open using tcp protocol.",
    "category": "Open Port",
    "location": "tcp://192.168.178.1:8089",
    "osi_layer": "NETWORK",
    "severity": "INFORMATIONAL",
    "attributes": {
      "port": 8089,
      "state": "open",
      "ip_address": "192.168.178.1",
      "mac_address": null,
      "protocol": "tcp",
      "hostname": "fritz.box",
      "method": "table",
      "operating_system": null,
      "service": "unknown",
      "serviceProduct": null,
      "serviceVersion": null,
      "scripts": null
    },
    "id": "cf956977-0aa7-4d90-b993-37e8b35b2265"
  },
  {
    "name": "intermapper",
    "description": "Port 8181 is open using tcp protocol.",
    "category": "Open Port",
    "location": "tcp://192.168.178.1:8181",
    "osi_layer": "NETWORK",
    "severity": "INFORMATIONAL",
    "attributes": {
      "port": 8181,
      "state": "open",
      "ip_address": "192.168.178.1",
      "mac_address": null,
      "protocol": "tcp",
      "hostname": "fritz.box",
      "method": "table",
      "operating_system": null,
      "service": "intermapper",
      "serviceProduct": null,
      "serviceVersion": null,
      "scripts": null
    },
    "id": "c3c1f244-1961-4194-8b91-5d117907b854"
  },
  {
    "name": "Host: foobars-iPhone.fritz.box",
    "category": "Host",
    "description": "Found a host",
    "location": "foobars-iPhone.fritz.box",
    "severity": "INFORMATIONAL",
    "osi_layer": "NETWORK",
    "attributes": {
      "ip_address": "192.168.178.21",
      "hostname": "foobars-iPhone.fritz.box",
      "operating_system": null
    },
    "id": "53eca5bd-cf96-4aaf-a6ce-55a4ff84a4b3"
  },
  {
    "name": "iphone-sync",
    "description": "Port 62078 is open using tcp protocol.",
    "category": "Open Port",
    "location": "tcp://192.168.178.26:62078",
    "osi_layer": "NETWORK",
    "severity": "INFORMATIONAL",
    "attributes": {
      "port": 62078,
      "state": "open",
      "ip_address": "192.168.178.21",
      "mac_address": null,
      "protocol": "tcp",
      "hostname": "foobars-iPhone.fritz.box",
      "method": "table",
      "operating_system": null,
      "service": "iphone-sync",
      "serviceProduct": null,
      "serviceVersion": null,
      "scripts": null
    },
    "id": "23687489-b52a-4fd9-8bae-7a04842b2183"
  }
]

```

</TabItem>

</Tabs>

### localhost



<Tabs
defaultValue="scan"
values={[
    { label: "Scan", value: "scan" },
    { label: "Findings", value: "findings" },
]}>

<TabItem value="scan">

```yaml
apiVersion: "execution.experimental.securecodebox.io/v1"
kind: Scan
metadata:
  name: "nmap-localhost"
spec:
  scanType: "nmap"
  parameters:
    # Note: Localhost here isn't "your" localhost, but the scanner container.
    # This container doesn't have any ports open...
    - localhost

```

</TabItem>

<TabItem value="findings">

```yaml
[
  {
    "name": "Host: localhost",
    "category": "Host",
    "description": "Found a host",
    "location": "localhost",
    "severity": "INFORMATIONAL",
    "osi_layer": "NETWORK",
    "attributes": {
      "ip_address": "127.0.0.1",
      "hostname": "localhost",
      "operating_system": null
    },
    "id": "9dced98c-eab8-4918-9f2d-ffb54df8436b"
  }
]

```

</TabItem>

</Tabs>

### scan.nmap.org



<Tabs
defaultValue="scan"
values={[
    { label: "Scan", value: "scan" },
    { label: "Findings", value: "findings" },
]}>

<TabItem value="scan">

```yaml
apiVersion: "execution.experimental.securecodebox.io/v1"
kind: Scan
metadata:
  name: "nmap-scanme.nmap.org"
spec:
  scanType: "nmap"
  parameters:
    - scanme.nmap.org

```

</TabItem>

<TabItem value="findings">

```yaml
[
  {
    "name": "ssh",
    "description": "Port 22 is open using tcp protocol.",
    "category": "Open Port",
    "location": "tcp://45.33.32.156:22",
    "osi_layer": "NETWORK",
    "severity": "INFORMATIONAL",
    "attributes": {
      "port": 22,
      "state": "open",
      "ip_address": "45.33.32.156",
      "mac_address": null,
      "protocol": "tcp",
      "hostname": "scanme.nmap.org",
      "method": "table",
      "operating_system": null,
      "service": "ssh",
      "serviceProduct": null,
      "serviceVersion": null,
      "scripts": null
    },
    "id": "0903c2b6-b3c3-4fb3-9661-3ce995044fdd"
  },
  {
    "name": "http",
    "description": "Port 80 is open using tcp protocol.",
    "category": "Open Port",
    "location": "tcp://45.33.32.156:80",
    "osi_layer": "NETWORK",
    "severity": "INFORMATIONAL",
    "attributes": {
      "port": 80,
      "state": "open",
      "ip_address": "45.33.32.156",
      "mac_address": null,
      "protocol": "tcp",
      "hostname": "scanme.nmap.org",
      "method": "table",
      "operating_system": null,
      "service": "http",
      "serviceProduct": null,
      "serviceVersion": null,
      "scripts": null
    },
    "id": "6235f66d-a851-4e24-8367-6fd528f71795"
  },
  {
    "name": "msrpc",
    "description": "Port 135 is filtered using tcp protocol.",
    "category": "Open Port",
    "location": "tcp://45.33.32.156:135",
    "osi_layer": "NETWORK",
    "severity": "INFORMATIONAL",
    "attributes": {
      "port": 135,
      "state": "filtered",
      "ip_address": "45.33.32.156",
      "mac_address": null,
      "protocol": "tcp",
      "hostname": "scanme.nmap.org",
      "method": "table",
      "operating_system": null,
      "service": "msrpc",
      "serviceProduct": null,
      "serviceVersion": null,
      "scripts": null
    },
    "id": "831cd5a2-0860-4f11-9727-771f111a3538"
  },
  {
    "name": "netbios-ssn",
    "description": "Port 139 is filtered using tcp protocol.",
    "category": "Open Port",
    "location": "tcp://45.33.32.156:139",
    "osi_layer": "NETWORK",
    "severity": "INFORMATIONAL",
    "attributes": {
      "port": 139,
      "state": "filtered",
      "ip_address": "45.33.32.156",
      "mac_address": null,
      "protocol": "tcp",
      "hostname": "scanme.nmap.org",
      "method": "table",
      "operating_system": null,
      "service": "netbios-ssn",
      "serviceProduct": null,
      "serviceVersion": null,
      "scripts": null
    },
    "id": "eb4cbbda-c303-42c8-851f-6b3759713f85"
  },
  {
    "name": "microsoft-ds",
    "description": "Port 445 is filtered using tcp protocol.",
    "category": "Open Port",
    "location": "tcp://45.33.32.156:445",
    "osi_layer": "NETWORK",
    "severity": "INFORMATIONAL",
    "attributes": {
      "port": 445,
      "state": "filtered",
      "ip_address": "45.33.32.156",
      "mac_address": null,
      "protocol": "tcp",
      "hostname": "scanme.nmap.org",
      "method": "table",
      "operating_system": null,
      "service": "microsoft-ds",
      "serviceProduct": null,
      "serviceVersion": null,
      "scripts": null
    },
    "id": "cee96358-93ea-4b1b-ab69-1bc8220015e6"
  },
  {
    "name": "nping-echo",
    "description": "Port 9929 is open using tcp protocol.",
    "category": "Open Port",
    "location": "tcp://45.33.32.156:9929",
    "osi_layer": "NETWORK",
    "severity": "INFORMATIONAL",
    "attributes": {
      "port": 9929,
      "state": "open",
      "ip_address": "45.33.32.156",
      "mac_address": null,
      "protocol": "tcp",
      "hostname": "scanme.nmap.org",
      "method": "table",
      "operating_system": null,
      "service": "nping-echo",
      "serviceProduct": null,
      "serviceVersion": null,
      "scripts": null
    },
    "id": "4720cb35-87e3-4346-ab63-6434e1384efe"
  },
  {
    "name": "Elite",
    "description": "Port 31337 is open using tcp protocol.",
    "category": "Open Port",
    "location": "tcp://45.33.32.156:31337",
    "osi_layer": "NETWORK",
    "severity": "INFORMATIONAL",
    "attributes": {
      "port": 31337,
      "state": "open",
      "ip_address": "45.33.32.156",
      "mac_address": null,
      "protocol": "tcp",
      "hostname": "scanme.nmap.org",
      "method": "table",
      "operating_system": null,
      "service": "Elite",
      "serviceProduct": null,
      "serviceVersion": null,
      "scripts": null
    },
    "id": "1ceb1c93-e77f-41dc-a3fc-b1d04cec6a5e"
  },
  {
    "name": "Host: scanme.nmap.org",
    "category": "Host",
    "description": "Found a host",
    "location": "scanme.nmap.org",
    "severity": "INFORMATIONAL",
    "osi_layer": "NETWORK",
    "attributes": {
      "ip_address": "45.33.32.156",
      "hostname": "scanme.nmap.org",
      "operating_system": null
    },
    "id": "997e572f-13af-483a-aee6-6ce05e931daf"
  }
]

```

</TabItem>

</Tabs>

