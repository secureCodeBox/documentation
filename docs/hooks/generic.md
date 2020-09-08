---
title: "Generic WebHook"
---

<!-- end -->

## Deployment

Installing the Generic WebHook hook will add a ReadOnly Hook to your namespace. 

```bash
helm upgrade --install gwh ./hooks/generic-webhook/ --set webhookUrl="http://example.com/my/webhook/target"
```
> ✍ This documentation is currently work-in-progress. 