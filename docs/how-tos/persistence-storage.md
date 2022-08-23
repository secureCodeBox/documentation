---
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

title: "Store your findings with a persistence provider"
sidebar_position: 6
---

## Introduction 


## DefectDojo

[DefectDojo](https://github.com/DefectDojo/django-DefectDojo) is a widespread platform for vulnerability management
and security orchestration. The _secureCodeBox_ provides a hook that allows to directly connect the scb to a local
or remote DefectDojo instance. In this tutorial, we will at first guide you through a step-by-step setup manual.
After that, you will learn about some features of DefectDojo and how you can use them in conjunction with the
_secureCodeBox_.

### Setup
*Tested for Ubuntu 22.04 with Kubernetes 1.24*

Pre-Installation requirements:
* [minikube](https://kubernetes.io/de/docs/tasks/tools/install-minikube/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
* [helm](https://helm.sh/docs/intro/install/)

We will now at first set up an instance of DefectDojo in a local minikube cluster. After we have that running,
we will install the _secureCodeBox_ and the DefectDojo hook.

### DefectDojo Kubernetes setup 
(General, more detailed instructions can be found [here](https://github.com/DefectDojo/django-DefectDojo/blob/dev/readme-docs/KUBERNETES.md))
```bash
# Download DefectDojo repo
git clone https://github.com/DefectDojo/django-DefectDojo
cd django-DefectDojo

# Start the cluster
minikube start
minikube addons enable ingress

# Get helm charts (bitnami necessary for Helm >= v3)
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm dependency update ./helm/defectdojo

# Install DefectDojo helm chart
helm upgrade --install \
  defectdojo \
  ./helm/defectdojo \
  --set django.ingress.enabled=true \
  --set django.ingress.activateTLS=false \
  --set createSecret=true \
  --set createRabbitMqSecret=true \
  --set createRedisSecret=true \
  --set createMysqlSecret=true \
  --set createPostgresqlSecret=true \
  --set host="defectdojo.default.minikube.local" \
  --set "alternativeHosts={localhost,defectdojo.default.minikube.local:8080,defectdojo-django.default.svc}"
```

After a while, you should see that all pods are running:
```bash
kubectl get pods
```

To access DefectDojo locally, you probably need to add the following lines to `/etc/hosts`:
```text
::1       defectdojo.default.minikube.local
127.0.0.1 defectdojo.default.minikube.local
```

After that, we can port-forward the DefectDojo service and thereby verify that the installation was successful:
```bash
kubectl port-forward --namespace=default service/defectdojo-django 8080:80
```

Now, retrieve the admin password:
```bash
echo "DefectDojo admin password: $(kubectl \
      get secret defectdojo \
      --namespace=default \
      --output jsonpath='{.data.DD_ADMIN_PASSWORD}' \
      | base64 --decode)"
```

We are finally ready to access our DefectDojo instance! In your browser, switch to `localhost:8080`. You should see
the DefectDojo login mask. Enter `admin` as username and type the password that you received in the step before.
Once logged in, you need to get your *API v2 Key*. Click on the person symbol in the upper-right corner and choose
*API v2 Key*. There should be a line like `Your current API key is abcdef123456789...`. Save it for later.

### secureCodeBox setup
(General setup instructions can be found [here](https://www.securecodebox.io/docs/getting-started/installation))

```bash
# Install the operator
helm repo add secureCodeBox https://charts.securecodebox.io
kubectl create namespace securecodebox-system
helm --namespace securecodebox-system upgrade --install securecodebox-operator secureCodeBox/operator

# Install nmap scanner for the later tutorial steps
helm upgrade --install nmap secureCodeBox/nmap
```

To install the DefectDojo hook, we need to create a secret with the API v2 Key we retrieved before:
```bash
kubectl create secret generic defectdojo-credentials --from-literal="username=admin" --from-literal="apikey=<APIv2KEY>"
```

Finally, we can install the DefectDojo hook via helm:
```bash
helm upgrade --install dd secureCodeBox/persistence-defectdojo
```

To verify that everything works, we now start an nmap scan and check that its results are uploaded to our DefectDojo
instance. Create the following file:
```yaml
# Scan.yaml
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

apiVersion: "execution.securecodebox.io/v1"
kind: Scan
metadata:
  name: "nmap-scanme.nmap.org"
spec:
  scanType: "nmap"
  parameters:
    - scanme.nmap.org
```

We then apply it via:
```bash
kubectl apply -f scan.yaml
```

If everything was set up correctly, you should see an *nmap-scanme.nmap.org* engagement in the DefectDojo engagements
dashboard after a while.

### Troubleshooting
tbd

### Managing findings via the secureCodeBox and DefectDojo
tbd
