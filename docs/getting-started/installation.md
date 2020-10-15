---
title: "secureCodeBox Installation"
sidebar_label: Installation
path: "docs/getting-started/installation"
---

The secureCodeBox is running on Kubernetes. To install it you need to use [Helm](https://helm.sh), a package manager for Kubernetes.

```bash
# Add the secureCodeBox Helm Repo
helm repo add secureCodeBox https://charts.securecodebox.io

# Create a new namespace for the secureCodeBox Operator
kubectl create namespace securecodebox-system

# Install the Operator & CRD's
helm --namespace securecodebox-system install securecodebox-operator secureCodeBox/operator --version v2.0.0-rc.12
```

If you didn't see any errors you now have the secureCodeBox Operator up and running! 🥳🚀

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

## Configuration Options

### Using a hosted S3 Buckets

To change out the default minio instance with a S3 Bucket from a cloud provider you can update the helm values to connect the operator with you S3 bucket.

#### AWS S3

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

## Common Issues

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