---
title: "SSH"
path: "scanners/ssh_scan"
category: "scanner"
type: "SSH"
state: "released"
appVersion: "0.0.43"
usecase: "SSH Configuration and Policy Scanner"
---

SSH_scan is an easy-to-use prototype SSH configuration and policy scanner, inspired by Mozilla OpenSSH Security Guide, which provides a reasonable baseline policy recommendation for SSH configuration parameters such as Ciphers, MACs, and KexAlgos and much more.

To learn more about the ssh_scan scanner itself visit [ssh_scan GitHub].

<!-- end -->

## Deployment

The SSH_scan ScanType can be deployed via helm.

```bash
helm upgrade --install ssh ./scanners/ssh_scan/
```

## Configuration

The following security scan configuration example are based on the [ssh_scan Documentation], please take a look at the original documentation for more configuration examples.

```bash
ssh_scan v0.0.21 (https://github.com/mozilla/ssh_scan)

Usage: ssh_scan [options]
    -t, --target [IP/Range/Hostname] IP/Ranges/Hostname to scan
    -f, --file [FilePath]            File Path of the file containing IP/Range/Hostnames to scan
    -T, --timeout [seconds]          Timeout per connect after which ssh_scan gives up on the host
    -L, --logger [Log File Path]     Enable logger
    -O, --from_json [FilePath]       File to read JSON output from
    -o, --output [FilePath]          File to write JSON output to
    -p, --port [PORT]                Port (Default: 22)
    -P, --policy [FILE]              Custom policy file (Default: Mozilla Modern)
        --threads [NUMBER]           Number of worker threads (Default: 5)
        --fingerprint-db [FILE]      File location of fingerprint database (Default: ./fingerprints.db)
        --suppress-update-status     Do not check for updates
    -u, --unit-test [FILE]           Throw appropriate exit codes based on compliance status
    -V [STD_LOGGING_LEVEL],
        --verbosity
    -v, --version                    Display just version info
    -h, --help                       Show this message

Examples:

  ssh_scan -t 192.168.1.1
  ssh_scan -t server.example.com
  ssh_scan -t ::1
  ssh_scan -t ::1 -T 5
  ssh_scan -f hosts.txt
  ssh_scan -o output.json
  ssh_scan -O output.json -o rescan_output.json
  ssh_scan -t 192.168.1.1 -p 22222
  ssh_scan -t 192.168.1.1 -p 22222 -L output.log -V INFO
  ssh_scan -t 192.168.1.1 -P custom_policy.yml
  ssh_scan -t 192.168.1.1 --unit-test -P custom_policy.yml
```

[ssh_scan GitHub]: https://github.com/mozilla/ssh_scan
[ssh_scan Documentation]: https://github.com/mozilla/ssh_scan#example-command-line-usage



## Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="demo-app-ssh"
  values={[{"label":"Demo-app-ssh","value":"demo-app-ssh"},{"label":"Example.com","value":"example.com"},{"label":"Localhost","value":"localhost"}]}>
            
            
<TabItem value="demo-app-ssh">
  
<div>

</div>

<Tabs
defaultValue="sc"
values={[
  {label: 'Scan', value: 'sc'}, 
  {label: 'Findings', value: 'fd'},
]}>


<TabItem value="sc">

```yaml

apiVersion: "execution.experimental.securecodebox.io/v1"
kind: Scan
metadata:
  name: "ssh-ssh-demo-cluster-internal"
spec:
  scanType: "ssh-scan"
  parameters:
    - "-t"
    - "dummy-ssh.demo-apps.svc"


```

</TabItem>



<TabItem value="fd">


```yaml

[
    {
        "name": "SSH Service",
        "description": "SSH Service Information",
        "category": "SSH Service",
        "osi_layer": "APPLICATION",
        "severity": "INFORMATIONAL",
        "reference": {},
        "hint": "",
        "location": "dummy-ssh.demo-apps.svc",
        "attributes": {
            "hostname": "dummy-ssh.demo-apps.svc",
            "ip_address": "10.102.131.102",
            "server_banner": "SSH-2.0-OpenSSH_7.2p2 Ubuntu-4ubuntu2.8",
            "ssh_version": 2,
            "os_cpe": "o:canonical:ubuntu:16.04",
            "ssh_lib_cpe": "a:openssh:openssh:7.2p2",
            "compliance_policy": "Mozilla Modern",
            "compliant": false,
            "grade": "D",
            "references": [
                "https://wiki.mozilla.org/Security/Guidelines/OpenSSH"
            ],
            "auth_methods": [
                "publickey",
                "password"
            ],
            "key_algorithms": [
                "curve25519-sha256@libssh.org",
                "ecdh-sha2-nistp256",
                "ecdh-sha2-nistp384",
                "ecdh-sha2-nistp521",
                "diffie-hellman-group-exchange-sha256",
                "diffie-hellman-group14-sha1"
            ],
            "encryption_algorithms": [
                "chacha20-poly1305@openssh.com",
                "aes128-ctr",
                "aes192-ctr",
                "aes256-ctr",
                "aes128-gcm@openssh.com",
                "aes256-gcm@openssh.com"
            ],
            "mac_algorithms": [
                "umac-64-etm@openssh.com",
                "umac-128-etm@openssh.com",
                "hmac-sha2-256-etm@openssh.com",
                "hmac-sha2-512-etm@openssh.com",
                "hmac-sha1-etm@openssh.com",
                "umac-64@openssh.com",
                "umac-128@openssh.com",
                "hmac-sha2-256",
                "hmac-sha2-512",
                "hmac-sha1"
            ],
            "compression_algorithms": [
                "none",
                "zlib@openssh.com"
            ]
        },
        "id": "17ac9886-d083-4c58-8518-557aa3b38d2d"
    },
    {
        "name": "Insecure SSH Key Algorithms",
        "description": "Deprecated / discouraged SSH key algorithms are used",
        "category": "SSH Policy Violation",
        "osi_layer": "NETWORK",
        "severity": "MEDIUM",
        "reference": {},
        "hint": "Remove these key exchange algorithms: diffie-hellman-group14-sha1",
        "location": "dummy-ssh.demo-apps.svc",
        "attributes": {
            "hostname": "dummy-ssh.demo-apps.svc",
            "ip_address": "10.102.131.102",
            "payload": [
                "diffie-hellman-group14-sha1"
            ]
        },
        "id": "650c5ed1-00fb-44e3-933c-515dca4a1eda"
    },
    {
        "name": "Insecure SSH MAC Algorithms",
        "description": "Deprecated / discouraged SSH MAC algorithms are used",
        "category": "SSH Policy Violation",
        "osi_layer": "NETWORK",
        "severity": "MEDIUM",
        "reference": {},
        "hint": "Remove these MAC algorithms: umac-64-etm@openssh.com, hmac-sha1-etm@openssh.com, umac-64@openssh.com, hmac-sha1",
        "location": "dummy-ssh.demo-apps.svc",
        "attributes": {
            "hostname": "dummy-ssh.demo-apps.svc",
            "ip_address": "10.102.131.102",
            "payload": [
                "umac-64-etm@openssh.com",
                "hmac-sha1-etm@openssh.com",
                "umac-64@openssh.com",
                "hmac-sha1"
            ]
        },
        "id": "5b681ed0-b509-400b-bb1e-ae839bb1b766"
    },
    {
        "name": "Discouraged SSH authentication methods",
        "description": "Discouraged SSH authentication methods are used",
        "category": "SSH Policy Violation",
        "osi_layer": "NETWORK",
        "severity": "MEDIUM",
        "reference": {},
        "hint": "Remove these authentication methods: password",
        "location": "dummy-ssh.demo-apps.svc",
        "attributes": {
            "hostname": "dummy-ssh.demo-apps.svc",
            "ip_address": "10.102.131.102",
            "payload": [
                "password"
            ]
        },
        "id": "4485916d-3747-4c16-a730-a9b1146dd9a2"
    }
]

```


</TabItem>


</Tabs>
          
</TabItem>
          
<TabItem value="example.com">
  
<div>

</div>

<Tabs
defaultValue="sc"
values={[
  {label: 'Scan', value: 'sc'}, 
  ,
]}>


<TabItem value="sc">

```yaml

apiVersion: "execution.experimental.securecodebox.io/v1"
kind: Scan
metadata:
  name: "ssh-www.example.com"
  labels:
    company: example
spec:
  scanType: "ssh-scan"
  parameters:
    - "-t"
    - www.example.com
    - "-p"
    - "22222"


```

</TabItem>




</Tabs>
          
</TabItem>
          
<TabItem value="localhost">
  
<div>

</div>

<Tabs
defaultValue="sc"
values={[
  {label: 'Scan', value: 'sc'}, 
  {label: 'Findings', value: 'fd'},
]}>


<TabItem value="sc">

```yaml

apiVersion: "execution.experimental.securecodebox.io/v1"
kind: Scan
metadata:
  name: "ssh-localhost"
  labels:
    company: localhost
spec:
  scanType: "ssh-scan"
  parameters:
    - "-t"
    - localhost


```

</TabItem>



<TabItem value="fd">


```yaml

[
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.0.1",
    "hostname": "fritz.box",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": [

    ],
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:08 +0200",
    "end_time": "2020-05-18 14:16:08 +0200",
    "scan_duration_seconds": 0.009147,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.2",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:08 +0200",
    "end_time": "2020-05-18 14:16:13 +0200",
    "scan_duration_seconds": 5.018145,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.5",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:08 +0200",
    "end_time": "2020-05-18 14:16:13 +0200",
    "scan_duration_seconds": 5.023781,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.3",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:08 +0200",
    "end_time": "2020-05-18 14:16:13 +0200",
    "scan_duration_seconds": 5.025497,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.4",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:08 +0200",
    "end_time": "2020-05-18 14:16:13 +0200",
    "scan_duration_seconds": 5.026574,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.6",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:08 +0200",
    "end_time": "2020-05-18 14:16:13 +0200",
    "scan_duration_seconds": 5.019285,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.10",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:13 +0200",
    "end_time": "2020-05-18 14:16:19 +0200",
    "scan_duration_seconds": 5.045999,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.7",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:13 +0200",
    "end_time": "2020-05-18 14:16:19 +0200",
    "scan_duration_seconds": 5.05908,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.11",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:13 +0200",
    "end_time": "2020-05-18 14:16:19 +0200",
    "scan_duration_seconds": 5.052545,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.8",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:13 +0200",
    "end_time": "2020-05-18 14:16:19 +0200",
    "scan_duration_seconds": 5.056765,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.9",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:13 +0200",
    "end_time": "2020-05-18 14:16:19 +0200",
    "scan_duration_seconds": 5.06131,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.12",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:19 +0200",
    "end_time": "2020-05-18 14:16:24 +0200",
    "scan_duration_seconds": 5.015576,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.13",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:19 +0200",
    "end_time": "2020-05-18 14:16:24 +0200",
    "scan_duration_seconds": 5.013597,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.15",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:19 +0200",
    "end_time": "2020-05-18 14:16:24 +0200",
    "scan_duration_seconds": 5.012137,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.14",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:19 +0200",
    "end_time": "2020-05-18 14:16:24 +0200",
    "scan_duration_seconds": 5.015068,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.16",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:19 +0200",
    "end_time": "2020-05-18 14:16:24 +0200",
    "scan_duration_seconds": 5.016027,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.17",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:24 +0200",
    "end_time": "2020-05-18 14:16:29 +0200",
    "scan_duration_seconds": 5.014476,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.18",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:24 +0200",
    "end_time": "2020-05-18 14:16:29 +0200",
    "scan_duration_seconds": 5.012788,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.36",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:39 +0200",
    "end_time": "2020-05-18 14:16:44 +0200",
    "scan_duration_seconds": 5.026775,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.38",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:44 +0200",
    "end_time": "2020-05-18 14:16:49 +0200",
    "scan_duration_seconds": 5.004179,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.40",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:44 +0200",
    "end_time": "2020-05-18 14:16:49 +0200",
    "scan_duration_seconds": 5.011815,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.39",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:44 +0200",
    "end_time": "2020-05-18 14:16:49 +0200",
    "scan_duration_seconds": 5.015197,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.41",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:44 +0200",
    "end_time": "2020-05-18 14:16:49 +0200",
    "scan_duration_seconds": 5.020542,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.42",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:44 +0200",
    "end_time": "2020-05-18 14:16:49 +0200",
    "scan_duration_seconds": 5.023733,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.43",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:49 +0200",
    "end_time": "2020-05-18 14:16:54 +0200",
    "scan_duration_seconds": 5.009096,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.45",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:49 +0200",
    "end_time": "2020-05-18 14:16:54 +0200",
    "scan_duration_seconds": 5.011373,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.44",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:49 +0200",
    "end_time": "2020-05-18 14:16:54 +0200",
    "scan_duration_seconds": 5.021025,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.46",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:49 +0200",
    "end_time": "2020-05-18 14:16:54 +0200",
    "scan_duration_seconds": 5.013896,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.47",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:49 +0200",
    "end_time": "2020-05-18 14:16:54 +0200",
    "scan_duration_seconds": 5.01212,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.48",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:54 +0200",
    "end_time": "2020-05-18 14:16:59 +0200",
    "scan_duration_seconds": 5.015682,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.49",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:54 +0200",
    "end_time": "2020-05-18 14:16:59 +0200",
    "scan_duration_seconds": 5.024721,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.50",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:54 +0200",
    "end_time": "2020-05-18 14:16:59 +0200",
    "scan_duration_seconds": 5.018128,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.51",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:54 +0200",
    "end_time": "2020-05-18 14:16:59 +0200",
    "scan_duration_seconds": 5.016329,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.52",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:54 +0200",
    "end_time": "2020-05-18 14:16:59 +0200",
    "scan_duration_seconds": 5.017229,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.53",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:59 +0200",
    "end_time": "2020-05-18 14:17:04 +0200",
    "scan_duration_seconds": 5.013938,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.54",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:59 +0200",
    "end_time": "2020-05-18 14:17:04 +0200",
    "scan_duration_seconds": 5.027029,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.57",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:59 +0200",
    "end_time": "2020-05-18 14:17:04 +0200",
    "scan_duration_seconds": 5.034224,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.56",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:59 +0200",
    "end_time": "2020-05-18 14:17:04 +0200",
    "scan_duration_seconds": 5.039258,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.55",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:16:59 +0200",
    "end_time": "2020-05-18 14:17:04 +0200",
    "scan_duration_seconds": 5.040982,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.58",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:04 +0200",
    "end_time": "2020-05-18 14:17:09 +0200",
    "scan_duration_seconds": 5.00823,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.59",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:04 +0200",
    "end_time": "2020-05-18 14:17:09 +0200",
    "scan_duration_seconds": 5.023171,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.60",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:04 +0200",
    "end_time": "2020-05-18 14:17:09 +0200",
    "scan_duration_seconds": 5.013186,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.62",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:04 +0200",
    "end_time": "2020-05-18 14:17:09 +0200",
    "scan_duration_seconds": 5.010377,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.61",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:04 +0200",
    "end_time": "2020-05-18 14:17:09 +0200",
    "scan_duration_seconds": 5.014818,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.63",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:09 +0200",
    "end_time": "2020-05-18 14:17:14 +0200",
    "scan_duration_seconds": 5.009808,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.64",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:09 +0200",
    "end_time": "2020-05-18 14:17:14 +0200",
    "scan_duration_seconds": 5.017995,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.66",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:09 +0200",
    "end_time": "2020-05-18 14:17:14 +0200",
    "scan_duration_seconds": 5.017735,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.65",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:09 +0200",
    "end_time": "2020-05-18 14:17:14 +0200",
    "scan_duration_seconds": 5.019746,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.67",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:09 +0200",
    "end_time": "2020-05-18 14:17:14 +0200",
    "scan_duration_seconds": 5.016963,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.68",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:14 +0200",
    "end_time": "2020-05-18 14:17:19 +0200",
    "scan_duration_seconds": 5.009804,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.69",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:14 +0200",
    "end_time": "2020-05-18 14:17:19 +0200",
    "scan_duration_seconds": 5.016983,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.70",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:14 +0200",
    "end_time": "2020-05-18 14:17:19 +0200",
    "scan_duration_seconds": 5.01562,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.72",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:14 +0200",
    "end_time": "2020-05-18 14:17:19 +0200",
    "scan_duration_seconds": 5.016326,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.71",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:14 +0200",
    "end_time": "2020-05-18 14:17:19 +0200",
    "scan_duration_seconds": 5.017919,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.73",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:19 +0200",
    "end_time": "2020-05-18 14:17:24 +0200",
    "scan_duration_seconds": 5.025453,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.77",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:19 +0200",
    "end_time": "2020-05-18 14:17:24 +0200",
    "scan_duration_seconds": 5.016805,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.74",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:19 +0200",
    "end_time": "2020-05-18 14:17:24 +0200",
    "scan_duration_seconds": 5.020961,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.75",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:19 +0200",
    "end_time": "2020-05-18 14:17:24 +0200",
    "scan_duration_seconds": 5.024436,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.76",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:19 +0200",
    "end_time": "2020-05-18 14:17:24 +0200",
    "scan_duration_seconds": 5.021202,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.78",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:24 +0200",
    "end_time": "2020-05-18 14:17:29 +0200",
    "scan_duration_seconds": 5.008501,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.79",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:24 +0200",
    "end_time": "2020-05-18 14:17:29 +0200",
    "scan_duration_seconds": 5.010518,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.80",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:24 +0200",
    "end_time": "2020-05-18 14:17:29 +0200",
    "scan_duration_seconds": 5.017385,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.81",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:24 +0200",
    "end_time": "2020-05-18 14:17:29 +0200",
    "scan_duration_seconds": 5.017398,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.82",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:24 +0200",
    "end_time": "2020-05-18 14:17:29 +0200",
    "scan_duration_seconds": 5.019877,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.83",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:29 +0200",
    "end_time": "2020-05-18 14:17:34 +0200",
    "scan_duration_seconds": 5.012493,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.84",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:29 +0200",
    "end_time": "2020-05-18 14:17:34 +0200",
    "scan_duration_seconds": 5.01596,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.86",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:29 +0200",
    "end_time": "2020-05-18 14:17:34 +0200",
    "scan_duration_seconds": 5.036337,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.85",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:29 +0200",
    "end_time": "2020-05-18 14:17:34 +0200",
    "scan_duration_seconds": 5.040029,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.87",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:29 +0200",
    "end_time": "2020-05-18 14:17:34 +0200",
    "scan_duration_seconds": 5.034385,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.88",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:34 +0200",
    "end_time": "2020-05-18 14:17:39 +0200",
    "scan_duration_seconds": 5.009505,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.89",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:34 +0200",
    "end_time": "2020-05-18 14:17:39 +0200",
    "scan_duration_seconds": 5.012555,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.91",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:34 +0200",
    "end_time": "2020-05-18 14:17:39 +0200",
    "scan_duration_seconds": 5.014005,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.90",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:34 +0200",
    "end_time": "2020-05-18 14:17:39 +0200",
    "scan_duration_seconds": 5.01487,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.92",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:34 +0200",
    "end_time": "2020-05-18 14:17:39 +0200",
    "scan_duration_seconds": 5.015081,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.93",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:39 +0200",
    "end_time": "2020-05-18 14:17:44 +0200",
    "scan_duration_seconds": 5.011196,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.94",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:39 +0200",
    "end_time": "2020-05-18 14:17:44 +0200",
    "scan_duration_seconds": 5.00896,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.96",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:39 +0200",
    "end_time": "2020-05-18 14:17:44 +0200",
    "scan_duration_seconds": 5.013573,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.97",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:39 +0200",
    "end_time": "2020-05-18 14:17:44 +0200",
    "scan_duration_seconds": 5.015892,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.95",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:39 +0200",
    "end_time": "2020-05-18 14:17:44 +0200",
    "scan_duration_seconds": 5.017638,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.98",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:44 +0200",
    "end_time": "2020-05-18 14:17:49 +0200",
    "scan_duration_seconds": 5.014191,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.99",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:44 +0200",
    "end_time": "2020-05-18 14:17:49 +0200",
    "scan_duration_seconds": 5.012209,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.100",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:44 +0200",
    "end_time": "2020-05-18 14:17:49 +0200",
    "scan_duration_seconds": 5.015569,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.101",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:44 +0200",
    "end_time": "2020-05-18 14:17:49 +0200",
    "scan_duration_seconds": 5.019266,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.102",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:44 +0200",
    "end_time": "2020-05-18 14:17:49 +0200",
    "scan_duration_seconds": 5.019509,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.103",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:49 +0200",
    "end_time": "2020-05-18 14:17:54 +0200",
    "scan_duration_seconds": 5.011426,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.104",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:49 +0200",
    "end_time": "2020-05-18 14:17:54 +0200",
    "scan_duration_seconds": 5.008065,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.105",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:49 +0200",
    "end_time": "2020-05-18 14:17:54 +0200",
    "scan_duration_seconds": 5.010373,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.106",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:49 +0200",
    "end_time": "2020-05-18 14:17:54 +0200",
    "scan_duration_seconds": 5.011829,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.107",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:49 +0200",
    "end_time": "2020-05-18 14:17:54 +0200",
    "scan_duration_seconds": 5.01201,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.108",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:54 +0200",
    "end_time": "2020-05-18 14:17:59 +0200",
    "scan_duration_seconds": 5.011443,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.109",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:54 +0200",
    "end_time": "2020-05-18 14:17:59 +0200",
    "scan_duration_seconds": 5.013181,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.110",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:54 +0200",
    "end_time": "2020-05-18 14:17:59 +0200",
    "scan_duration_seconds": 5.009685,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.112",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:54 +0200",
    "end_time": "2020-05-18 14:17:59 +0200",
    "scan_duration_seconds": 5.014025,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.111",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:54 +0200",
    "end_time": "2020-05-18 14:17:59 +0200",
    "scan_duration_seconds": 5.014552,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.113",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:59 +0200",
    "end_time": "2020-05-18 14:18:04 +0200",
    "scan_duration_seconds": 5.014669,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.114",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:59 +0200",
    "end_time": "2020-05-18 14:18:04 +0200",
    "scan_duration_seconds": 5.011557,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.115",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:59 +0200",
    "end_time": "2020-05-18 14:18:04 +0200",
    "scan_duration_seconds": 5.014777,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.117",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:59 +0200",
    "end_time": "2020-05-18 14:18:04 +0200",
    "scan_duration_seconds": 5.012769,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.116",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:17:59 +0200",
    "end_time": "2020-05-18 14:18:04 +0200",
    "scan_duration_seconds": 5.015077,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.118",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:04 +0200",
    "end_time": "2020-05-18 14:18:09 +0200",
    "scan_duration_seconds": 5.012724,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.119",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:04 +0200",
    "end_time": "2020-05-18 14:18:09 +0200",
    "scan_duration_seconds": 5.020184,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.120",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:04 +0200",
    "end_time": "2020-05-18 14:18:09 +0200",
    "scan_duration_seconds": 5.015805,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.121",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:04 +0200",
    "end_time": "2020-05-18 14:18:09 +0200",
    "scan_duration_seconds": 5.013292,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.122",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:04 +0200",
    "end_time": "2020-05-18 14:18:09 +0200",
    "scan_duration_seconds": 5.013342,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.123",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:09 +0200",
    "end_time": "2020-05-18 14:18:14 +0200",
    "scan_duration_seconds": 5.009917,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.124",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:09 +0200",
    "end_time": "2020-05-18 14:18:14 +0200",
    "scan_duration_seconds": 5.00777,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.125",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:09 +0200",
    "end_time": "2020-05-18 14:18:14 +0200",
    "scan_duration_seconds": 5.009052,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.126",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:09 +0200",
    "end_time": "2020-05-18 14:18:14 +0200",
    "scan_duration_seconds": 5.010297,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.127",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:09 +0200",
    "end_time": "2020-05-18 14:18:14 +0200",
    "scan_duration_seconds": 5.007845,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.128",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:14 +0200",
    "end_time": "2020-05-18 14:18:19 +0200",
    "scan_duration_seconds": 5.007212,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.129",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:14 +0200",
    "end_time": "2020-05-18 14:18:19 +0200",
    "scan_duration_seconds": 5.007011,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.131",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:14 +0200",
    "end_time": "2020-05-18 14:18:19 +0200",
    "scan_duration_seconds": 5.010844,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.130",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:14 +0200",
    "end_time": "2020-05-18 14:18:19 +0200",
    "scan_duration_seconds": 5.020804,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.132",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:14 +0200",
    "end_time": "2020-05-18 14:18:19 +0200",
    "scan_duration_seconds": 5.011265,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.133",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:19 +0200",
    "end_time": "2020-05-18 14:18:24 +0200",
    "scan_duration_seconds": 5.013889,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.134",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:19 +0200",
    "end_time": "2020-05-18 14:18:24 +0200",
    "scan_duration_seconds": 5.011654,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.135",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:19 +0200",
    "end_time": "2020-05-18 14:18:24 +0200",
    "scan_duration_seconds": 5.011695,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.137",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:19 +0200",
    "end_time": "2020-05-18 14:18:24 +0200",
    "scan_duration_seconds": 5.012752,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.136",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:19 +0200",
    "end_time": "2020-05-18 14:18:24 +0200",
    "scan_duration_seconds": 5.016228,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.138",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:24 +0200",
    "end_time": "2020-05-18 14:18:29 +0200",
    "scan_duration_seconds": 5.007896,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.139",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:24 +0200",
    "end_time": "2020-05-18 14:18:29 +0200",
    "scan_duration_seconds": 5.012671,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.140",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:24 +0200",
    "end_time": "2020-05-18 14:18:29 +0200",
    "scan_duration_seconds": 5.01449,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.142",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:24 +0200",
    "end_time": "2020-05-18 14:18:29 +0200",
    "scan_duration_seconds": 5.01353,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.141",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:24 +0200",
    "end_time": "2020-05-18 14:18:29 +0200",
    "scan_duration_seconds": 5.02139,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.143",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:29 +0200",
    "end_time": "2020-05-18 14:18:34 +0200",
    "scan_duration_seconds": 5.00722,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.144",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:29 +0200",
    "end_time": "2020-05-18 14:18:34 +0200",
    "scan_duration_seconds": 5.008936,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.145",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:29 +0200",
    "end_time": "2020-05-18 14:18:34 +0200",
    "scan_duration_seconds": 5.010428,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.146",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:29 +0200",
    "end_time": "2020-05-18 14:18:34 +0200",
    "scan_duration_seconds": 5.010461,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.147",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:29 +0200",
    "end_time": "2020-05-18 14:18:34 +0200",
    "scan_duration_seconds": 5.010366,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.148",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:34 +0200",
    "end_time": "2020-05-18 14:18:39 +0200",
    "scan_duration_seconds": 5.004849,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.149",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:34 +0200",
    "end_time": "2020-05-18 14:18:39 +0200",
    "scan_duration_seconds": 5.007421,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.150",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:34 +0200",
    "end_time": "2020-05-18 14:18:39 +0200",
    "scan_duration_seconds": 5.010495,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.151",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:34 +0200",
    "end_time": "2020-05-18 14:18:39 +0200",
    "scan_duration_seconds": 5.012477,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.152",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:34 +0200",
    "end_time": "2020-05-18 14:18:39 +0200",
    "scan_duration_seconds": 5.009218,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.153",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:39 +0200",
    "end_time": "2020-05-18 14:18:44 +0200",
    "scan_duration_seconds": 5.011404,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.154",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:39 +0200",
    "end_time": "2020-05-18 14:18:44 +0200",
    "scan_duration_seconds": 5.009484,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.155",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:39 +0200",
    "end_time": "2020-05-18 14:18:44 +0200",
    "scan_duration_seconds": 5.006623,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.157",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:39 +0200",
    "end_time": "2020-05-18 14:18:44 +0200",
    "scan_duration_seconds": 5.009452,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.156",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:39 +0200",
    "end_time": "2020-05-18 14:18:44 +0200",
    "scan_duration_seconds": 5.010617,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.158",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:44 +0200",
    "end_time": "2020-05-18 14:18:49 +0200",
    "scan_duration_seconds": 5.007965,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.159",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:44 +0200",
    "end_time": "2020-05-18 14:18:49 +0200",
    "scan_duration_seconds": 5.006987,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.160",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:44 +0200",
    "end_time": "2020-05-18 14:18:49 +0200",
    "scan_duration_seconds": 5.005987,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.162",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:44 +0200",
    "end_time": "2020-05-18 14:18:49 +0200",
    "scan_duration_seconds": 5.014419,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.161",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:44 +0200",
    "end_time": "2020-05-18 14:18:49 +0200",
    "scan_duration_seconds": 5.01457,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.163",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:49 +0200",
    "end_time": "2020-05-18 14:18:54 +0200",
    "scan_duration_seconds": 5.018359,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.164",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:49 +0200",
    "end_time": "2020-05-18 14:18:54 +0200",
    "scan_duration_seconds": 5.017265,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.165",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:49 +0200",
    "end_time": "2020-05-18 14:18:54 +0200",
    "scan_duration_seconds": 5.014736,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.167",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:49 +0200",
    "end_time": "2020-05-18 14:18:54 +0200",
    "scan_duration_seconds": 5.016781,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.166",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:49 +0200",
    "end_time": "2020-05-18 14:18:54 +0200",
    "scan_duration_seconds": 5.018615,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.168",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:54 +0200",
    "end_time": "2020-05-18 14:18:59 +0200",
    "scan_duration_seconds": 5.009226,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.169",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:54 +0200",
    "end_time": "2020-05-18 14:18:59 +0200",
    "scan_duration_seconds": 5.009719,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.170",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:54 +0200",
    "end_time": "2020-05-18 14:18:59 +0200",
    "scan_duration_seconds": 5.01229,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.171",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:54 +0200",
    "end_time": "2020-05-18 14:18:59 +0200",
    "scan_duration_seconds": 5.009089,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.172",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:54 +0200",
    "end_time": "2020-05-18 14:18:59 +0200",
    "scan_duration_seconds": 5.008697,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.173",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:59 +0200",
    "end_time": "2020-05-18 14:19:04 +0200",
    "scan_duration_seconds": 5.013729,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.174",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:59 +0200",
    "end_time": "2020-05-18 14:19:04 +0200",
    "scan_duration_seconds": 5.021665,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.175",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:59 +0200",
    "end_time": "2020-05-18 14:19:04 +0200",
    "scan_duration_seconds": 5.010501,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.176",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:59 +0200",
    "end_time": "2020-05-18 14:19:04 +0200",
    "scan_duration_seconds": 5.009526,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.177",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:18:59 +0200",
    "end_time": "2020-05-18 14:19:04 +0200",
    "scan_duration_seconds": 5.016848,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.178",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:04 +0200",
    "end_time": "2020-05-18 14:19:09 +0200",
    "scan_duration_seconds": 5.013499,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.179",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:04 +0200",
    "end_time": "2020-05-18 14:19:09 +0200",
    "scan_duration_seconds": 5.013188,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.180",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:04 +0200",
    "end_time": "2020-05-18 14:19:09 +0200",
    "scan_duration_seconds": 5.012,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.181",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:04 +0200",
    "end_time": "2020-05-18 14:19:09 +0200",
    "scan_duration_seconds": 5.01268,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.182",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:04 +0200",
    "end_time": "2020-05-18 14:19:09 +0200",
    "scan_duration_seconds": 5.016068,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.183",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:09 +0200",
    "end_time": "2020-05-18 14:19:14 +0200",
    "scan_duration_seconds": 5.009168,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.184",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:09 +0200",
    "end_time": "2020-05-18 14:19:14 +0200",
    "scan_duration_seconds": 5.012193,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.185",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:09 +0200",
    "end_time": "2020-05-18 14:19:14 +0200",
    "scan_duration_seconds": 5.012495,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.186",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:09 +0200",
    "end_time": "2020-05-18 14:19:14 +0200",
    "scan_duration_seconds": 5.010615,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.187",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:09 +0200",
    "end_time": "2020-05-18 14:19:14 +0200",
    "scan_duration_seconds": 5.009718,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.188",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:14 +0200",
    "end_time": "2020-05-18 14:19:19 +0200",
    "scan_duration_seconds": 5.013079,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.189",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:14 +0200",
    "end_time": "2020-05-18 14:19:19 +0200",
    "scan_duration_seconds": 5.008909,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.190",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:14 +0200",
    "end_time": "2020-05-18 14:19:19 +0200",
    "scan_duration_seconds": 5.012701,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.191",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:14 +0200",
    "end_time": "2020-05-18 14:19:19 +0200",
    "scan_duration_seconds": 5.011254,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.192",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:14 +0200",
    "end_time": "2020-05-18 14:19:19 +0200",
    "scan_duration_seconds": 5.011075,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.193",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:19 +0200",
    "end_time": "2020-05-18 14:19:24 +0200",
    "scan_duration_seconds": 5.008206,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.194",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:19 +0200",
    "end_time": "2020-05-18 14:19:24 +0200",
    "scan_duration_seconds": 5.008122,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.195",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:19 +0200",
    "end_time": "2020-05-18 14:19:24 +0200",
    "scan_duration_seconds": 5.008552,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.196",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:19 +0200",
    "end_time": "2020-05-18 14:19:24 +0200",
    "scan_duration_seconds": 5.010205,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.197",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:19 +0200",
    "end_time": "2020-05-18 14:19:24 +0200",
    "scan_duration_seconds": 5.009305,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.198",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:24 +0200",
    "end_time": "2020-05-18 14:19:29 +0200",
    "scan_duration_seconds": 5.014749,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.199",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:24 +0200",
    "end_time": "2020-05-18 14:19:29 +0200",
    "scan_duration_seconds": 5.009968,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.200",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:24 +0200",
    "end_time": "2020-05-18 14:19:29 +0200",
    "scan_duration_seconds": 5.006475,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.201",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:24 +0200",
    "end_time": "2020-05-18 14:19:29 +0200",
    "scan_duration_seconds": 5.009185,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.202",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:24 +0200",
    "end_time": "2020-05-18 14:19:29 +0200",
    "scan_duration_seconds": 5.008749,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.203",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:29 +0200",
    "end_time": "2020-05-18 14:19:34 +0200",
    "scan_duration_seconds": 5.008611,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.204",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:29 +0200",
    "end_time": "2020-05-18 14:19:34 +0200",
    "scan_duration_seconds": 5.007647,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.205",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:29 +0200",
    "end_time": "2020-05-18 14:19:34 +0200",
    "scan_duration_seconds": 5.009199,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.206",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:29 +0200",
    "end_time": "2020-05-18 14:19:34 +0200",
    "scan_duration_seconds": 5.007476,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.207",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:29 +0200",
    "end_time": "2020-05-18 14:19:34 +0200",
    "scan_duration_seconds": 5.012679,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.208",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:34 +0200",
    "end_time": "2020-05-18 14:19:39 +0200",
    "scan_duration_seconds": 5.016178,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.209",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:34 +0200",
    "end_time": "2020-05-18 14:19:39 +0200",
    "scan_duration_seconds": 5.013339,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.210",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:34 +0200",
    "end_time": "2020-05-18 14:19:39 +0200",
    "scan_duration_seconds": 5.011069,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.211",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:34 +0200",
    "end_time": "2020-05-18 14:19:39 +0200",
    "scan_duration_seconds": 5.01491,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.212",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:34 +0200",
    "end_time": "2020-05-18 14:19:39 +0200",
    "scan_duration_seconds": 5.008301,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.213",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:39 +0200",
    "end_time": "2020-05-18 14:19:44 +0200",
    "scan_duration_seconds": 5.007219,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.214",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:39 +0200",
    "end_time": "2020-05-18 14:19:44 +0200",
    "scan_duration_seconds": 5.008252,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.215",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:39 +0200",
    "end_time": "2020-05-18 14:19:44 +0200",
    "scan_duration_seconds": 5.013376,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.216",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:39 +0200",
    "end_time": "2020-05-18 14:19:44 +0200",
    "scan_duration_seconds": 5.005473,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.217",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:39 +0200",
    "end_time": "2020-05-18 14:19:44 +0200",
    "scan_duration_seconds": 5.009484,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.218",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:44 +0200",
    "end_time": "2020-05-18 14:19:49 +0200",
    "scan_duration_seconds": 5.004647,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.219",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:44 +0200",
    "end_time": "2020-05-18 14:19:49 +0200",
    "scan_duration_seconds": 5.015997,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.220",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:44 +0200",
    "end_time": "2020-05-18 14:19:49 +0200",
    "scan_duration_seconds": 5.009858,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.221",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:44 +0200",
    "end_time": "2020-05-18 14:19:49 +0200",
    "scan_duration_seconds": 5.009426,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.222",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:44 +0200",
    "end_time": "2020-05-18 14:19:49 +0200",
    "scan_duration_seconds": 5.011433,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.223",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:49 +0200",
    "end_time": "2020-05-18 14:19:54 +0200",
    "scan_duration_seconds": 5.007592,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.224",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:49 +0200",
    "end_time": "2020-05-18 14:19:54 +0200",
    "scan_duration_seconds": 5.014186,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.225",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:49 +0200",
    "end_time": "2020-05-18 14:19:54 +0200",
    "scan_duration_seconds": 5.015063,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.226",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:49 +0200",
    "end_time": "2020-05-18 14:19:54 +0200",
    "scan_duration_seconds": 5.011104,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.227",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:49 +0200",
    "end_time": "2020-05-18 14:19:54 +0200",
    "scan_duration_seconds": 5.008299,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.228",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:54 +0200",
    "end_time": "2020-05-18 14:19:59 +0200",
    "scan_duration_seconds": 5.006931,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.229",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:54 +0200",
    "end_time": "2020-05-18 14:19:59 +0200",
    "scan_duration_seconds": 5.009133,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.230",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:54 +0200",
    "end_time": "2020-05-18 14:19:59 +0200",
    "scan_duration_seconds": 5.007698,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.231",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:54 +0200",
    "end_time": "2020-05-18 14:19:59 +0200",
    "scan_duration_seconds": 5.006834,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.232",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:54 +0200",
    "end_time": "2020-05-18 14:19:59 +0200",
    "scan_duration_seconds": 5.009307,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.233",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:59 +0200",
    "end_time": "2020-05-18 14:20:04 +0200",
    "scan_duration_seconds": 5.010224,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.234",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:59 +0200",
    "end_time": "2020-05-18 14:20:04 +0200",
    "scan_duration_seconds": 5.017244,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.235",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:59 +0200",
    "end_time": "2020-05-18 14:20:04 +0200",
    "scan_duration_seconds": 5.023908,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.236",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:59 +0200",
    "end_time": "2020-05-18 14:20:04 +0200",
    "scan_duration_seconds": 5.022695,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.237",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:19:59 +0200",
    "end_time": "2020-05-18 14:20:04 +0200",
    "scan_duration_seconds": 5.016382,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.238",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:20:04 +0200",
    "end_time": "2020-05-18 14:20:09 +0200",
    "scan_duration_seconds": 5.012382,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.239",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:20:04 +0200",
    "end_time": "2020-05-18 14:20:09 +0200",
    "scan_duration_seconds": 5.010582,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.240",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:20:04 +0200",
    "end_time": "2020-05-18 14:20:09 +0200",
    "scan_duration_seconds": 5.013688,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.241",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:20:04 +0200",
    "end_time": "2020-05-18 14:20:09 +0200",
    "scan_duration_seconds": 5.02014,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.242",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:20:04 +0200",
    "end_time": "2020-05-18 14:20:09 +0200",
    "scan_duration_seconds": 5.019114,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.243",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:20:09 +0200",
    "end_time": "2020-05-18 14:20:14 +0200",
    "scan_duration_seconds": 5.010204,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.244",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:20:09 +0200",
    "end_time": "2020-05-18 14:20:14 +0200",
    "scan_duration_seconds": 5.026513,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.245",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:20:09 +0200",
    "end_time": "2020-05-18 14:20:14 +0200",
    "scan_duration_seconds": 5.015253,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.246",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:20:09 +0200",
    "end_time": "2020-05-18 14:20:14 +0200",
    "scan_duration_seconds": 5.00897,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.247",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:20:09 +0200",
    "end_time": "2020-05-18 14:20:14 +0200",
    "scan_duration_seconds": 5.012336,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.248",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:20:14 +0200",
    "end_time": "2020-05-18 14:20:19 +0200",
    "scan_duration_seconds": 5.016242,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.249",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:20:14 +0200",
    "end_time": "2020-05-18 14:20:19 +0200",
    "scan_duration_seconds": 5.009471,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.250",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:20:14 +0200",
    "end_time": "2020-05-18 14:20:19 +0200",
    "scan_duration_seconds": 5.010296,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.251",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:20:14 +0200",
    "end_time": "2020-05-18 14:20:19 +0200",
    "scan_duration_seconds": 5.008444,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.252",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:20:14 +0200",
    "end_time": "2020-05-18 14:20:19 +0200",
    "scan_duration_seconds": 5.029963,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.253",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:20:19 +0200",
    "end_time": "2020-05-18 14:20:24 +0200",
    "scan_duration_seconds": 5.020419,
    "error": "Socket is no longer valid"
  },
  {
    "ssh_scan_version": "0.0.42",
    "ip": "192.168.178.254",
    "hostname": "",
    "port": 22,
    "server_banner": "",
    "ssh_version": "unknown",
    "os": "unknown",
    "os_cpe": "o:unknown",
    "ssh_lib": "unknown",
    "ssh_lib_cpe": "a:unknown",
    "key_algorithms": [

    ],
    "encryption_algorithms_client_to_server": [

    ],
    "encryption_algorithms_server_to_client": [

    ],
    "mac_algorithms_client_to_server": [

    ],
    "mac_algorithms_server_to_client": [

    ],
    "compression_algorithms_client_to_server": [

    ],
    "compression_algorithms_server_to_client": [

    ],
    "languages_client_to_server": [

    ],
    "languages_server_to_client": [

    ],
    "auth_methods": [

    ],
    "keys": {
    },
    "dns_keys": null,
    "duplicate_host_key_ips": [

    ],
    "compliance": {
    },
    "start_time": "2020-05-18 14:20:19 +0200",
    "end_time": "2020-05-18 14:20:24 +0200",
    "scan_duration_seconds": 5.009291,
    "error": "Socket is no longer valid"
  }
]


```


</TabItem>


</Tabs>
          
</TabItem>
          
</Tabs>