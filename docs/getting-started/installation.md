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
helm --namespace securecodebox-system install securecodebox-operator secureCodeBox/operator --version v2.0.0-rc.11
```

If you didn't see any errors you now have the secureCodeBox Operator up and running! 🥳🚀

Your now ready to install your [first scan types and start your first scans](/docs/getting-started/first-scans).

## Version Support

The secureCodeBox supports the 4 latest Kubernetes releases (`v1.19`, `v1.18`, `v1.17` & `v1.16`). Older version might also work but are not officially supported or tested.

To install the secureCodeBox we recommend using Helm at version 3.

## Configuration Options

## Common Issues

### Minio Startup Problems

If your secureCodeBox Operator install is failing , and you see that the operator pod seems to be working okay, but the minio pods started along side it do not start up properly
Cluster doesn't support persistent volumes.

Suggested solutions:

- Use a Cloud Storage provider instead of Minio. This has to provide a API compatible to AWS S3. Providers that we have tried and worked great include:
  - AWS S3
  - Google Cloud Storage
  - DigitalOcean Spaces
- Configure Minio to use a HostPath Volume. This is more work to set up and manage, but also works for local / on-prem installation.

### ClusterRole & CRD Issues
