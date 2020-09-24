---
title: "Ncrack"
path: "scanners/Ncrack"
category: "scanner"
type: "Authentication"
state: "developing"
appVersion: "0.7"
usecase: "Network authentication bruteforcing"
---

Ncrack is a high-speed network authentication cracking tool. It was built to help companies secure their networks by proactively testing all their hosts and networking devices for poor passwords. Security professionals also rely on Ncrack when auditing their clients. Ncrack was designed using a modular approach, a command-line syntax similar to Nmap and a dynamic engine that can adapt its behaviour based on network feedback. It allows for rapid, yet reliable large-scale auditing of multiple hosts.

To learn more about the Ncrack scanner itself visit [Ncrack GitHub] or [Ncrack Website].

<!-- end -->

> 🔧 The implementation is currently work-in-progress and still undergoing major changes. It'll be released here once it has stabilized.

[Ncrack Website]: https://nmap.org/ncrack/
[Ncrack GitHub]: https://github.com/nmap/ncrack
[Ncrack Documentation]: https://nmap.org/ncrack/man.html



## Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### dummy-ssh

In this example we execute an ncrack scan against the intentional vulnerable ssh service (dummy-ssh)

#### Install dummy-ssh

Before executing the scan, make sure to have dummy-ssh installed, and have the proper username & password lists:

```bash
# Create user & password list files, you can edit them later if you want
echo "root\nadmin" > users.txt
echo "THEPASSWORDYOUCREATED\n123456\npassword" > passwords.txt

# Create a Kubernetes secret containing these files
kubectl create secret generic --from-file users.txt --from-file passwords.txt ncrack-lists

# Install dummy-ssh app. We'll use ncrack to enumerate its ssh username and password
helm install dummy-ssh ./demo-apps/dummy-ssh/ --wait

# Install the ncrack scanType and set mount the files from the ncrack-lists Kubernetes secret
cat <<EOF | helm install ncrack ./scanners/ncrack --values -
scannerJob:
  extraVolumes:
    - name: ncrack-lists
      secret:
        secretName: ncrack-lists
  extraVolumeMounts:
    - name: ncrack-lists
      mountPath: "/ncrack/"
EOF
```


<Tabs
defaultValue="scan"
values={[
    { label: "Scan", value: "scan" },
    
]}>

<TabItem value="scan">

```yaml
apiVersion: "execution.experimental.securecodebox.io/v1"
kind: Scan
metadata:
  name: "dummy-ssh"
spec:
  scanType: "ncrack"
  parameters:
    # Enable verbose logging
    - -v
    - -U
    - /ncrack/users.txt
    - -P
    - /ncrack/passwords.txt
    - ssh://dummy-ssh

```

</TabItem>


</Tabs>

