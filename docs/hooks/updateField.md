---
title: "Update Field"
---

<!-- end -->

## Deployment

Installing the _Update Field_ hook will add a ReadOnly Hook to your namespace. 

```bash
helm upgrade --install ufh ./hooks/update-field/ --set attribute.name="category" --set attribute.value="my-own-category"
```

> ✍ This documentation is currently work-in-progress. 
