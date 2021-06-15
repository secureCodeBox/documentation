---
# SPDX-FileCopyrightText: 2021 iteratec GmbH
#
# SPDX-License-Identifier: Apache-2.0

title: "Scanning Networks"
---

## Introduction

In this step-by-step tutorial, we will go through all the required stages to set up network scanning with the secureCodeBox. We will first use **Nmap** to scan all devices for open ports and then see how to use *Cascading Rules* to follow up on our port findings with a vulnerability scanner. In this tutorial, we will mainly focus on a follow-up ssh port cracking using **Ncrack**, but you will quickly notice that it's quite easy to configure the scanner for different ports to fit your needs.

## Setup

For the sake of the tutorial, we assume that you have your Kubernetes cluster already up and running and that we can work in your default namespace.

If not done yet, **install the nmap scanner:**

```bash
helm upgrade --install nmap ./scanners/nmap/
```

Now we also need the **declarative subsequent scan hook** (if not installed yet):

```bash
helm upgrade --install dssh ./hooks/declarative-subsequent-scans/
```

Finally, setting up **Ncrack** is a little trickier though. Ncrack uses files with lists of usernames and passwords to brute-force an authentication. In its default configuration, the scanner will check for all combinations of usernames and passwords provided by our lists. You can use your own existing files or just create two **dummy files** for the purpose of the tutorial:

```bash
printf "root\nadmin\n" > users.txt
printf "THEPASSWORDYOUCREATED\n123456\npassword\n" > passwords.txt
```

**Make sure to use an extra free line at the end of your files, as there could be issues with cut-off final letters!**

Now we can create a **kubernetes secret**:

```bash
kubectl create secret generic --from-file users.txt --from-file passwords.txt ncrack-lists
```

Lastly, we now **install Ncrack** and configure the scanType to mount our secret, so that we get access to the username and password files via the mount path `/ncrack/`:

```bash
cat <<EOF | helm upgrade --install ncrack ./scanners/ncrack --values -
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

## Creating the Scan Cascade

After everything is set up properly, it's now time to configure our scans. The **Nmap** Scan configuration is pretty straight forward. We create a **scan.yaml** where we define, what nmap should do:

```yaml
apiVersion: "execution.securecodebox.io/v1"
kind: Scan
metadata:
  name: "nmap-ssh-howto"
spec:
  scanType: "nmap"
  parameters:
    # Service Detection enabled
    - "-sV"
    # We'll just scan for port 22 to speed up the scan.
    - "-p"
    - "22"
    # Watch out to configure you network correctly and if you are allowed to perform scans against the hosts in it!
    - "192.168.178.0/24"
```

We can test run it via:

```bash
kubectl apply -f scan.yaml
```

The scan should be properly created and you should see it running via:

```bash
kubectl get scans
```

*Hint:* If you want to restart the scan, you must delete it first:

```bash
# Delete all scans:
kubectl delete scans --all
# Delete our specific scan:
kubectl delete scans nmap-ssh-tutorial
```

Now we also want to start the **Ncrack scan** after Nmap has finished. We use cascading rules for that. Cascading rules allow us to automatically call any scanner that matches our given labels (see below) in order to start further security checks. As in our example for ssh, we don't only want to check if there are open ports on our server, but we also want to follow that up with a check, that it uses secure credentials and does not use an insecure password from our list. Fortunately, the secureCodeBox already comes with a [predefined ncrack cascading rule] for ssh scanning. We will take an in-depth look at the file (scanners/ncrack/cascading-rules) to understand what's happening:

```yaml
apiVersion: "cascading.securecodebox.io/v1"
kind: CascadingRule
metadata:
  name: "ncrack-ssh"
  labels:
    securecodebox.io/invasive: invasive
    securecodebox.io/intensive: high
spec:
  matches:
    anyOf:
      - category: "Open Port"
        attributes:
          port: 22
          state: open
      - category: "Open Port"
        attributes:
          service: "ssh"
          state: open
  scanSpec:
    scanType: "ncrack"
    parameters:
      - -d10
      - -U
      - /ncrack/users.txt
      - -P
      - /ncrack/passwords.txt
      - -p
      - ssh:{{attributes.port}}
      - "{{$.hostOrIP}}"
```

Let's take a look at the attributes:

* *name:* Obviously, our scan is called "ncrack-ssh" to identify it correctly.
* *spec - matches - anyOf:* Here we specify that we want to subsequently scan every open port 22, or every port where a ssh service is running. You can use any attribute that is specified in the nmap findings, see for example: [Nmap Example Findings]
* *scanSpec - scanType:* This is where the actual ncrack scan gets configured. We use the optional -d10 for a better console output, with -U we specify the usernames list, -P is for password list. Now it gets more interesting: The -p option is used in ncrack to specify a port for a service different from its standard port. We pick the needed port from the findings via `{{attributes.port}}`. After that, we just have to directly set the target IP with `"{{$.hostOrIP}}"` and we are done. The pattern `"{{$.hostOrIP}}"` is a special feature we implmented as an alternative to `{{attributes.ip_address}}` because it's often usefull to preserve the hostname for cascadingScans. This pattern allows you to use the hostname if it's defined and otherwise use the attribute `{{attributes.ip_address}}`.
* *invasive & intensive:* Finally you may have noticed that we skipped these both attributes. A scan can either be *invasive* or *non-invasive* and its intensity can vary from *light* to *medium* to *high*.

These last two labels work as scan-triggers in the cascading rules, so our last step is to modify the nmap scan defined above and **add the cascading scan rules**:

```yaml
apiVersion: "execution.securecodebox.io/v1"
kind: Scan
metadata:
  name: "nmap-ssh-howto"
spec:
  scanType: "nmap"
  parameters:
    # Service Detection enabled
    - "-sV"
    # We'll just scan for port 22 to speed up the scan.
    - "-p"
    - "22"
    # Watch out to configure you network correctly and if you are allowed to perform scans against the hosts in it!
    - "192.168.178.0/24"
  cascades:
    matchLabels:
      securecodebox.io/intensive: high
      securecodebox.io/invasive: invasive
```

Of course, you can just use one of both labels and change them as you need them.

Now let's **run** our scan! Make sure to be in the correct directory where your scan.yaml is located:

```bash
kubectl apply -f scan.yaml
```

After a short time, we can check whether our subsequent scan has been triggered correctly:

```bash
kubectl get scans
```

Now we should see something like:

```bash
kubectl get scans
NAME                                TYPE     STATE   FINDINGS
ncrack-ssh-howto-ncrack-ssh-48qnz   ncrack   Done    1
nmap-ssh-howto                      nmap     Done    8
```

Nice, our scan was triggered as expected!
Your network likely looks different. Depending on how many ssh hosts nmap was able to find you will see more ncrack scans started.

Final hint: If you want to **create a cascading rule yourself**, you can create them like any resource in Kubernetes via:

```bash
kubectl apply -f cascadingRule.yaml
```

Have fun scanning and checking your networks!

[Nmap Example Findings]: https://github.com/secureCodeBox/secureCodeBox/blob/master/scanners/nmap/examples/demo-app-ssh/findings.yaml
[predefined ncrack cascading rule]: https://github.com/secureCodeBox/secureCodeBox/blob/master/scanners/ncrack/cascading-rules/crackssh.yaml
