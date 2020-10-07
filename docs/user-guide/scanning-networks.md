---
title: "HowTo: Network Scans"
---

## Introduction

In this step-by-step tutorial, we will go through all the required stages to set up network scanning with the secureCodeBox. We will first use **Nmap** to scan all devices for open ports and then see how to use *Cascading Rules* to follow up on our port findings with a vulnerability scanner. In this tutorial, we will mainly focus on a follow-up ssh port cracking using **Ncrack**, but you will quickly notice that it's quite easy to configure the scanner for different ports to fit your needs.

## Setup

For the sake of the tutorial, we assume that you have your Kubernetes cluster already up and running and that we can work in your default namespace.

If not done yet, **install the nmap scanner:**

```bash
helm upgrade --install nmap ./scanners/nmap/
```

It will also be necessary to have a server with an open port to test our configuration. You can either use your own server (you should know its IP and it should have an open ssh Port!) or you can best follow along the tutorial with **installing our dummy-ssh demo app**:

```bash
helm upgrade --install dummy-ssh ./demo-apps/dummy-ssh/
```

Now we also need the **declarative subsequent scan hook** (if not installed yet):

```bash
helm upgrade --install dssh ./hooks/declarative-subsequent-scans/
```

Finally, setting up **Ncrack** is a little bit trickier though. Ncrack uses files with lists of usernames and passwords to brute-force an authentication. You can use your own existing files or just create two **dummy files** for the purpose of the tutorial:

```bash
printf "root\nadmin\n" > users.txt
printf "THEPASSWORDYOUCREATED\n123456\npassword\n" > passwords.txt
```

**Make sure to use an extra free line at the end of your files, as there could be issues with cut-off final letters!**

Now we can create a **kubernetes secret**:

```bash
kubectl create secret generic --from-file users.txt --from-file passwords.txt ncrack-lists
```

If you have already installed Ncrack, make sure to remove it first:

```bash
helm delete ncrack
```

Lastly, we now **install Ncrack** and configure the scanType to mount our secret, so that we get access to the username and password files via the mount path `/ncrack/`:

```bash
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



## Creating the Scan Cascade

After everything is set up properly, it's now time to configure our scans. The **Nmap** Scan configuration is pretty straight forward. We create a **scan.yaml** where we define, what nmap should do:

```yaml
apiVersion: "execution.securecodebox.io/v1"
kind: Scan
metadata:
  name: "nmap-ssh-tutorial"
spec:
  scanType: "nmap"
  parameters:
    # Service Detection enabled
    - "-sV"
    - "dummy-ssh"
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

Now we also want to start the **Ncrack scan** after Nmap has finished. We use cascading rules for that. Fortunately, the secureCodeBox comes already with a [predefined ncrack cascading rule] for ssh scanning. We will take an in-depth look at the file (scanners/ncrack/cascading-rules) to understand what's happening:

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
      - "{{attributes.ip_address}}"
```

Let's take a look at the attributes:

* *name:* Obviously, our scan is called "ncrack-ssh" to identify it correctly.
* *spec - matches - anyOf:* Here we specify that we want to subsequently scan every open port 22, or every port where a ssh service is running. You can use any attribute that is specified in the nmap findings, see for example: [Nmap Example Findings]
* *scanSpec - scanType:* This is where the actual ncrack scan gets configured. We use the optional -d10 for a better console output, with -U we specify the usernames list, -P is for password list. Now it gets more interesting: The -p option is used in ncrack to specify a port for a service different from its standard port. We pick the needed port from the findings via {{attributes.port}}. After that, we just have to directly set the target IP with "{{attributes.ip_address}}" and we are done.
* *invasive & intensive:* Finally you may have noticed that we skipped these both attributes. A scan can either be *invasive* or *non-invasive* and its intensity can vary from *light* to *medium* to *high*.

These last two labels work as scan-triggers in the cascading rules, so our last step is to modify the nmap scan defined above and **add the cascading scan rules**:

```yaml
apiVersion: "execution.securecodebox.io/v1"
kind: Scan
metadata:
  name: "nmap-ssh-tutorial"
spec:
  scanType: "nmap"
  parameters:
    # Service Detection enabled
    - "-sV"
    - "dummy-ssh"
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
NAME                                    TYPE     STATE                    FINDINGS
ncrack-ssh-tutorial-ncrack-ssh-abc12    ncrack   ReadOnlyHookProcessing   1
nmap-ssh-tutorial                       nmap     Done                     2
```

Nice, our scan was triggered as expected!

Final hint: If you want to **create a cascading rule yourself**, you can create them like any resource in Kubernetes via:

```bash
kubectl apply -f cascadingRule.yaml
```

Have fun scanning and checking your networks!

[Nmap Example Findings]: https://github.com/secureCodeBox/secureCodeBox-v2/blob/master/scanners/nmap/examples/demo-app-ssh/findings.yaml
[predefined ncrack cascading rule]: https://github.com/secureCodeBox/secureCodeBox-v2/blob/master/scanners/ncrack/cascading-rules/crackssh.yaml
