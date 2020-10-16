---
title: "secureCodeBox Installation"
sidebar_label: Installation
path: "docs/getting-started/installation"
---

The secureCodeBox is running on Kubernetes. To install it you need to use [Helm](https://helm.sh), a package manager for Kubernetes.

First of all you need to install the secureCodeBox Operator which is responsible for starting all security scans.

```bash
# Add the secureCodeBox Helm Repo
helm repo add secureCodeBox https://charts.securecodebox.io

# Create a new namespace for the secureCodeBox Operator
kubectl create namespace securecodebox-system

# Install the Operator & CRD's
helm --namespace securecodebox-system upgrade --install securecodebox-operator secureCodeBox/operator --version v2.0.0-rc.12
```

If you didn't see any errors you now have the secureCodeBox Operator up and running! 🥳 🚀

Your now ready to install your [first scan types and start your first scans](/docs/getting-started/first-scans).

## Version Support

The secureCodeBox supports the 4 latest Kubernetes releases (`v1.19`, `v1.18`, `v1.17` & `v1.16`). Older version might also work but are not officially supported or tested.

To install the secureCodeBox we recommend using Helm at version 3.

## Accessing the included Minio Instance:

The default secureCodeBox Operator included a [Minio](https://min.io/) instance, which acts as a local S3 filestorage api used by the secureCodeBox to store the results files of its scans. You can switch it out with a S3 compatible api provided by most cloud providers.

You can access the minio instance included in the default installation like the following:

Port Forward Minio UI: `kubectl port-forward -n securecodebox-system service/securecodebox-operator-minio 9000:9000`

  - AccessKey: `kubectl get secret securecodebox-operator-minio -n securecodebox-system -o=jsonpath='{.data.accesskey}' | base64 --decode; echo`
  - SecretKey: `kubectl get secret securecodebox-operator-minio -n securecodebox-system -o=jsonpath='{.data.secretkey}' | base64 --decode; echo`

Then open your browser on [http://localhost:9000](http://localhost:9000) and login in with the credentials returned by the command listed above.

## Operator Configuration Options

### Using a hosted S3 Buckets as storage backend

To change out the default minio instance with a S3 Bucket from a cloud provider you can update the helm values to connect the operator with you S3 bucket.

#### AWS S3 Buckets

```yaml
minio:
  # disable the local minio instance
  enabled: false
s3:
  enabled: true
  # update the region to match the location of your bucket
  endpoint: "s3-eu-west-1.amazonaws.com"
  bucket: "your-own-securecodebox-bucket-name"
  # Name to a k8s secret with 'accesskey' and 'secretkey' as attributes in the same namespace as this release
  # Example creation via kubectl:
  # kubectl create secret generic my-secret --from-literal=accessKey="******" --from-literal=secretKey="******"
  keySecret: securecodebox-s3-credentials
```

#### Google Cloud Storage

```yaml
minio:
  # disable the local minio instance
  enabled: false
s3:
  enabled: true
  bucket: your-own-securecodebox-bucket-name
  endpoint: storage.googleapis.com
  # Name to a k8s secret with 'accesskey' and 'secretkey' as attributes in the same namespace as this release
  # Example creation via kubectl:
  # kubectl create secret generic my-secret --from-literal=accessKey="******" --from-literal=secretKey="******"
  keySecret: gcs-bucket-credentials
```

## Install SCB Scanner

The following list will give you a short overview of all supported security scanner charts and how to install them.
You will find a more detailed documentation for each scanner in our _Scanners_ documentation section.

:::note
If you are installing the secureCodeBox the first time we recommend to read the [first scans](/docs/getting-started/first-scans) documentation first.
:::

You can optionally deploy SCB scanner charts for each security scanner you want to use. They should not be installed into the securecodebox-system namespace like the operator, but into the individual namespaces where you want to run the scans.

```bash
# The following chart will be installed in the `default` namespace by you can choose the namespace of your choice by 
# adding `--namespace YOURNAMESPACE` to each line
helm upgrade --install amass secureCodeBox/amass --version v2.0.0-rc.12
helm upgrade --install gitleaks secureCodeBox/gitleaks --version v2.0.0-rc.12
helm upgrade --install kube-hunter secureCodeBox/kube-hunter --version v2.0.0-rc.12
helm upgrade --install nikto secureCodeBox/nikto --version v2.0.0-rc.12
helm upgrade --install nmap secureCodeBox/nmap --version v2.0.0-rc.12
helm upgrade --install ssh-scan secureCodeBox/ssh_scan --version v2.0.0-rc.12
helm upgrade --install sslyze secureCodeBox/sslyze --version v2.0.0-rc.12
helm upgrade --install trivy secureCodeBox/trivy --version v2.0.0-rc.12
helm upgrade --install wpscan secureCodeBox/wpscan --version v2.0.0-rc.12
helm upgrade --install zap secureCodeBox/zap --version v2.0.0-rc.12
```

## Install some demo targets

If you want to test some of the security scanners within your namespace you can use some demo targets.

:::danger
As these demo targets are intentionally vulnerable you shouldn't expose them to the internet - keep them internal. 
Otherwise you could be targeted by someone else really fast 😈
:::

```bash
# The following chart will be installed in the `default` namespace by you can choose the namespace of your choice by 
# adding `--namespace YOURNAMESPACE` to each line
helm upgrade --install dummy-ssh secureCodeBox/dummy-ssh --version v2.0.0-rc.12
helm upgrade --install bodgeit secureCodeBox/bodgeit --version v2.0.0-rc.12
helm upgrade --install juice-shop secureCodeBox/juice-shop --version v2.0.0-rc.12
helm upgrade --install old-wordpress secureCodeBox/old-wordpress --version v2.0.0-rc.12
helm upgrade --install swagger-petstore secureCodeBox/swagger-petstore --version v2.0.0-rc.12
```

## Common Operator Issues

### Minio Startup Problems

If your secureCodeBox Operator install is failing , and you see that the operator pod seems to be working okay, but the minio pods started along side it does not start up properly, your probably cluster isn't configured to have a working default [Storage Class for Persistent Volumes](https://kubernetes.io/docs/concepts/storage/storage-classes/).

Suggested solutions:

- Use a Cloud Storage provider instead of Minio. This has to provide a API compatible to AWS S3. Providers that we have tried and worked great include:
  - AWS S3
  - Google Cloud Storage
  - DigitalOcean Spaces
- Configure Minio to use a HostPath Volume. This is more work to set up and manage, but also works for local / on-prem installation.

### ClusterRole & CRD Issues

The secureCodeBox Operator Helm Chart contains Custom Resource Definitions and ClusterRoles which is usually reserved to administrators of production cluster (and rightfully so 😄). If you are just testing out the secureCodeBox consider using a local Kubernetes Cluster with tools like [kind](https://kind.sigs.k8s.io/), [minikube](https://minikube.sigs.k8s.io/docs/) or [Docker Desktops (Mac/Windows) Kubernetes cluster](https://www.docker.com/products/kubernetes).
