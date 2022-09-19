---
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

title: "Storing Findings with A Persistence Provider"
sidebar_position: 6
---

## Introduction 

Let's say you have to manage a cluster of potential security risks, like for example a large number of websites or
your company's internal network. Your needs will exceed the limitations of manual findings handling or our build-in
*minio* instance quite soon. The solution comes with a so-called *persistence provider*, which not only allows you
to store your findings over a long period of time (as the name suggests), but also to classify, prioritize and analyze 
them. This tutorial discusses two persistence providers, [DefectDojo](#defectdojo) and [ElasticSearch](#elasticsearch), 
which can both be combined with the *secureCodeBox*.

### Pre-Requirements
*All setups have been tested with Ubuntu 22.04 and Kubernetes 1.24*

Make sure you have the following tools available on your system before starting:
* [minikube](https://kubernetes.io/de/docs/tasks/tools/install-minikube/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
* [helm](https://helm.sh/docs/intro/install/)

## DefectDojo

[DefectDojo](https://github.com/DefectDojo/django-DefectDojo) is a widespread platform for vulnerability management
and security orchestration. The *secureCodeBox* provides a hook that allows to directly connect the *scb* to a local
or remote DefectDojo instance. In this tutorial, we will at first guide you through a step-by-step setup manual.
After that, you will learn about some features of DefectDojo and how you can use them in conjunction with the
*secureCodeBox*.

We will now at first set up an instance of DefectDojo in a local minikube cluster. After we have that running,
we install the *secureCodeBox* and the [DefectDojo hook](https://www.securecodebox.io/docs/hooks/defectdojo/).

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

Now, retrieve the admin password:
```bash
echo "DefectDojo admin password: $(kubectl \
      get secret defectdojo \
      --namespace=default \
      --output jsonpath='{.data.DD_ADMIN_PASSWORD}' \
      | base64 --decode)"
```

After that, we can port-forward the DefectDojo service and thereby verify that the installation was successful:
```bash
kubectl port-forward --namespace=default service/defectdojo-django 8080:80
```

We are finally ready to access our DefectDojo instance! In your browser, switch to 
[localhost:8080](http://localhost:8080). You should see the DefectDojo login mask. 
Enter `admin` as username and type the password that you received in the step before.
Once logged in, you need to get your *API v2 Key*. Click on the person symbol in the upper-right corner and choose
*API v2 Key*. There should be a line like `Your current API key is abcdef123456789...`. Save it for later.

### secureCodeBox setup
(General setup instructions can be found [here](https://www.securecodebox.io/docs/getting-started/installation))

At first, we install the operator and a scanner:
```bash
# Install the operator
helm repo add secureCodeBox https://charts.securecodebox.io
kubectl create namespace securecodebox-system
helm --namespace securecodebox-system upgrade --install securecodebox-operator secureCodeBox/operator

# Create a namespace for scanning - makes it easier to read logs if something went wrong
kubectl create namespace scanning
# Install nmap scanner for the later tutorial steps
helm upgrade --namespace scanning --install nmap secureCodeBox/nmap
```

To install the DefectDojo hook, we need to create a secret with the API v2 Key we retrieved before:
```bash
kubectl create secret generic defectdojo-credentials -n scanning \
  --from-literal="username=admin" --from-literal="apikey=<APIv2KEY>"
```

Finally, we can install the DefectDojo hook via helm:
```bash
helm upgrade --namespace scanning --install dd secureCodeBox/persistence-defectdojo
```

To verify that everything works, we now start an nmap scan and check that its results are uploaded to our DefectDojo
instance. Create the following file:
```yaml
# scan.yaml
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
kubectl apply -n scanning -f scan.yaml
```

If everything was set up correctly, you should see an *nmap-scanme.nmap.org* engagement in the DefectDojo engagements
dashboard after a while. Should you have experienced any problems, you might find advice in the 
[troubleshooting](#troubleshooting) section at the end.

### Managing findings via the secureCodeBox and DefectDojo
To give you an idea of how a workflow with the *secureCodeBox* and DefectDojo can look like, we will take a glance at
DefectDojo's findings de-duplication ability. When scanning the same target multiple times, e.g. with a 
[scheduled scan](https://www.securecodebox.io/docs/how-tos/automatically-repeating-scans), we do not want to get 
notified about findings that are duplicates of already existing ones. If we accepted a risk for a finding or marked
it as a *false positive*, this should furthermore also apply to the new duplicated finding. DefectDojo handles all
of this for us, let us try it out:

1. As we already ran the nmap scan above, you should see an engagement in your local DefectDojo instance with name
*nmap-scanme.nmap.org*. In the upper menu, click on *Findings -> View Active Findings*. 
You should see four findings here.
2. For the sake of this tutorial, we *Select all visible findings* via the checkbox next to *Severity* in the table 
and click on the appearing button with label *Bulk Edit*, check the checkbox next to *Status* and then the one next to
*Out of Scope*. Finally, press the *Submit* button.
3. All findings should now have disappeared from the *Active Findings View* (they can be found again via 
*Findings -> View All Findings*).

4. Let us now verify that if we run the same scan again, our findings will still have the status *Out of Scope*:
Create the following file (same as above but with a different name):
```yaml
# scan2.yaml
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

apiVersion: "execution.securecodebox.io/v1"
kind: Scan
metadata:
  name: "nmap-scanme.nmap.org-2"
spec:
  scanType: "nmap"
  parameters:
    - scanme.nmap.org
```

Apply it via kubectl:
```bash
kubectl apply -n scanning -f scan2.yaml
```

After the scan and DefectDojo hook have finished, check again your local DefectDojo instance. There should not be
any new *Active Findings*, and still only four findings in the table under *Findings -> View All Findings*.

### Advanced use-case: Hook annotations

It is possible to overwrite the 
[default values](https://www.securecodebox.io/docs/hooks/defectdojo#additional-chart-configurations) 
that the DefectDojo hook uses to create products and engagements.
This is especially handy when using the *secureCodeBox* 
[Autodiscovery](https://www.securecodebox.io/docs/how-tos/autodiscovery) or 
[CascadingScans](https://www.securecodebox.io/docs/api/crds/cascading-rule) to annotate your scans with useful
names and to keep track of their origin. For the Autodiscovery, there are already pre-defined values that can be found
[here](https://github.com/secureCodeBox/secureCodeBox/blob/main/auto-discovery/kubernetes/values.yaml#L40).

To get you started with a simple example, we will now create an annotation in a manually executed scan. 
Create the following file:
```yaml
# scanAnnotation.yaml
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

apiVersion: "execution.securecodebox.io/v1"
kind: Scan
metadata:
  name: "nmap-scanme.nmap.org-annotation"
  annotations:
    defectdojo.securecodebox.io/product-name: "Annotation Example"
spec:
  scanType: "nmap"
  parameters:
    - scanme.nmap.org
```

Execute it via kubectl:
```bash
kubectl apply -n scanning -f scanAnnotation.yaml
```

After a while you should see a new engagement in your DefectDojo instance with product name `Annotation Example`.

## ElasticSearch

[ElasticSearch](https://www.elastic.co/de/elasticsearch/) enables users to store and search pretty much any possible 
kind of data. [Kibana](https://www.elastic.co/de/kibana/) provides a graphical user interface to easily access the data
stored in ElasticSearch. Using them in combination with the *secureCodeBox* is simpler than using DefectDojo, as
the [persistence-elastic hook](https://www.securecodebox.io/docs/hooks/elasticsearch) comes with 
a ready-to-use ElasticSearch and Kibana instance.

### Setup

At first, we create the *secureCodeBox* namespace and operator:
```bash
kubectl create namespace securecodebox-system
helm --namespace securecodebox-system upgrade --install securecodebox-operator secureCodeBox/operator
```

Next, we simply install an exemplary scanner and the *persistence-elastic* hook. Note that Kibana is enabled by default.
```bash
# Scanner and ElasticSearch should be in the same namespace
kubectl create namespace elastic
helm --namespace elastic upgrade --install nmap secureCodeBox/nmap
helm --namespace elastic upgrade --install persistence-elastic secureCodeBox/persistence-elastic
```

That's it! Let us run an example scan (same as above for DefectDojo):
```yaml
# scan.yaml
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

Apply it via kubectl:
```bash
kubectl apply -n elastic -f scan.yaml
```

After the scan has finished, you can view the findings in Kibana. Therefore, create a port-forward:
```bash
kubectl port-forward -n elastic services/persistence-elastic-kibana 5601:5601
```

You can now go to [localhost:5601](http://localhost:5601) and access your data in the Kibana instance!

### Managing findings via the secureCodeBox and Kibana

Note that unlike DefectDojo, ElasticSearch does not automatically handle duplicated findings. However, you can find 
pre-defined dashboards for some scanners implemented in the *secureCodeBox*, which makes visualizing their results
straight-forward. You can find a list of all available dashboards under 
[/app/dashboards#/list](http://localhost:5601/app/dashboards#/list) in your local Kibana instance.

## Troubleshooting

<details>
<summary>Troubleshooting</summary>
Connecting the scb to a persistence provider, especially DefectDojo, can sometimes be a bit tricky. 
The following tips might help in case that something went wrong:
<br /><br />
<ul>
<li> <b>Waiting:</b> It takes some time for the DefectDojo or Kibana instance to come up. You might also have to refresh 
several times in order to connect to localhost after the port-forward.
</li>
<li> <b>Verbose logging:</b> You can view verbose output for everything in your cluster, 
for example via <a href="https://github.com/wercker/stern">stern</a>. 
For the following steps, 
you have to have <a href="https://krew.sigs.k8s.io/docs/user-guide/setup/install/#bash">krew</a> installed:
<br />
<code>
kubectl krew install stern <br />
# View all logs in default namespace: <br />
kubectl stern .* <br />
# View for a specific namespace <br />
kubectl stern .* --namespace scanning
</code>
</li>
<li> <b>Re-Installation of DefectDojo:</b> Node that if anything went wrong, and you have to re-install DefectDojo in the cluster,
the createSecret* flags in the values.yaml file of DefectDojo must not be set. 
You can find more 
details <a href="https://github.com/DefectDojo/django-DefectDojo/blob/dev/readme-docs/KUBERNETES.md#re-install-the-chart">here</a>.
</li>
<li> <b>Using a local instance of DefectDojo rather than Kubernetes</b>: If nothing helps, you still have the option
to run DefectDojo outside 
your cluster (instructions <a href="https://github.com/DefectDojo/django-DefectDojo#quick-start">here</a>). After that,
you can connect the DefectDojo hook treating it like a <i>remote</i> instance of DefectDojo. The helm install command
for the hook would look like this: <br />
<code>
# $YOURLOCALIP should look something like http://192.168.2.242:8080 <br />
helm upgrade --install persistence-defectdojo secureCodeBox/persistence-defectdojo \ <br />
    --set="defectdojo.url=$YOURLOCALIP"
</code>
</li>
<li> <b>Increasing cluster resources</b>: Running a lot of pods at the same time can be resource-intensive. If you
find that your persistence providers are not reacting in appropriate time, you might want to increase the number of
cpus and memory usage for your minikube cluster: <br />
<code>
# If you already created a cluster, you most likely have to delete it at first <br />
minikube stop <br />
minikube delete <br />
# Create a new cluster with more resources <br />
minikube start --memory 8192 --cpus 4
</code>
</li>
</ul>
</details>
