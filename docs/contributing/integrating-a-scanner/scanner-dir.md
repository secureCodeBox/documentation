---
title: scanner (Directory)
---

If it is not possible to use the official Docker Image of your scanner (e.g. there is no official repository) you will need to create a `scanner` directory containing a Dockerfile and maybe a `wrapper.sh`.

## Dockerfile

The Dockerfile should be minimal and based on the official *alpine* baseimage. 
Please make sure to add a new user for your scanner.
Please change the user using `GID`. This enables our CI/CD to ensure that Docker Images do not use root.
A Dockerimage for nmap would look the following:

```dockerfile
FROM alpine:3.12
RUN apk add --no-cache nmap=7.80-r2 nmap-scripts=7.80-r2
RUN addgroup --system --gid 1001 nmap && adduser nmap --system --uid 1001 --ingroup nmap
USER 1001
CMD [nmap]
```

## wrapper.sh

Sometimes it will be necessary to wrap the scanner e.g. the scanner returns bad exit codes.
Please provide this script as `wrapper.sh` and use it as `CMD` value in your Dockerfile.


