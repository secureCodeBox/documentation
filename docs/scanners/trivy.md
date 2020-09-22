---
title: "Trivy"
path: "scanners/trivy"
category: "scanner"
type: "Container"
state: "released"
appVersion: "0.10.1"
usecase: "Container Vulnerability Scanner"
---

`Trivy` (`tri` pronounced like **tri**gger, `vy` pronounced like en**vy**) is a simple and comprehensive vulnerability scanner for containers and other artifacts.
A software vulnerability is a glitch, flaw, or weakness present in the software or in an Operating System.
`Trivy` detects vulnerabilities of OS packages (Alpine, RHEL, CentOS, etc.) and application dependencies (Bundler, Composer, npm, yarn, etc.).
`Trivy` is easy to use. Just install the binary and you're ready to scan. All you need to do for scanning is to specify a target such as an image name of the container.

To learn more about the Trivy scanner itself visit or [Trivy GitHub].

<!-- end -->

## Deployment

The Trivy scanType can be deployed via helm:

```bash
helm upgrade --install trivy ./scanners/trivy/
```

## Configuration

The following security scan configuration example are based on the [Trivy Documentation], please take a look at the original documentation for more configuration examples.

* Filter the vulnerabilities by severities `trivy image --severity HIGH,CRITICAL ruby:2.4.0`
* Filter the vulnerabilities by type (`os` or `library`) `trivy image --vuln-type os ruby:2.4.0`
* Skip update of vulnerability DB: `trivy image --skip-update python:3.4-alpine3.9`
* Ignore unfixed vulnerabilities:`trivy image --ignore-unfixed ruby:2.4.0` By default, Trivy also detects unpatched/unfixed vulnerabilities. This means you can't fix these vulnerabilities even if you update all packages. If you would like to ignore them, use the `--ignore-unfixed` option.

[Trivy GitHub]: https://github.com/aquasecurity/trivy
[Trivy Documentation]: https://github.com/aquasecurity/trivy#examples



## Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="juice-shop"
  values={[{"label":"Juice-shop","value":"juice-shop"},{"label":"Mediawiki","value":"mediawiki"}]}>
            
            
<TabItem value="juice-shop">
  
<div>

</div>

<Tabs
defaultValue="sc"
values={[
  {label: 'Scan', value: 'sc'}, 
  {label: 'Findings', value: 'fd'},
]}>


<TabItem value="sc">

```yaml

apiVersion: "execution.experimental.securecodebox.io/v1"
kind: Scan
metadata:
  name: "trivy-juiceshop"
  labels:
    organization: "OWASP"
spec:
  scanType: "trivy"
  parameters:
    - "bkimminich/juice-shop:v10.2.0"


```

</TabItem>



<TabItem value="fd">


```yaml

[
  {
    "Target": "bkimminich/juice-shop:v10.2.0 (alpine 3.11.5)",
    "Vulnerabilities": [
      {
        "VulnerabilityID": "CVE-2020-1967",
        "PkgName": "openssl",
        "InstalledVersion": "1.1.1d-r3",
        "FixedVersion": "1.1.1g-r0",
        "Layer": {
          "DiffID": "sha256:beee9f30bc1f711043e78d4a2be0668955d4b761d587d6f60c2c8dc081efb203"
        },
        "Title": "openssl: Segmentation fault in SSL_check_chain causes denial of service",
        "Description": "Server or client applications that call the SSL_check_chain() function during or after a TLS 1.3 handshake may crash due to a NULL pointer dereference as a result of incorrect handling of the \"signature_algorithms_cert\" TLS extension. The crash occurs if an invalid or unrecognised signature algorithm is received from the peer. This could be exploited by a malicious peer in a Denial of Service attack. OpenSSL version 1.1.1d, 1.1.1e, and 1.1.1f are affected by this issue. This issue did not affect OpenSSL versions prior to 1.1.1d. Fixed in OpenSSL 1.1.1g (Affected 1.1.1d-1.1.1f).",
        "Severity": "HIGH",
        "References": [
          "http://www.openwall.com/lists/oss-security/2020/04/22/2",
          "https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-1967",
          "https://git.openssl.org/gitweb/?p=openssl.git;a=commitdiff;h=eb563247aef3e83dda7679c43f9649270462e5b1",
          "https://kb.pulsesecure.net/articles/Pulse_Security_Advisories/SA44440",
          "https://lists.apache.org/thread.html/r66ea9c436da150683432db5fbc8beb8ae01886c6459ac30c2cea7345@%3Cdev.tomcat.apache.org%3E",
          "https://lists.apache.org/thread.html/r94d6ac3f010a38fccf4f432b12180a13fa1cf303559bd805648c9064@%3Cdev.tomcat.apache.org%3E",
          "https://lists.apache.org/thread.html/r9a41e304992ce6aec6585a87842b4f2e692604f5c892c37e3b0587ee@%3Cdev.tomcat.apache.org%3E",
          "https://lists.fedoraproject.org/archives/list/package-announce@lists.fedoraproject.org/message/XVEP3LAK4JSPRXFO4QF4GG2IVXADV3SO/",
          "https://security.FreeBSD.org/advisories/FreeBSD-SA-20:11.openssl.asc",
          "https://security.gentoo.org/glsa/202004-10",
          "https://security.netapp.com/advisory/ntap-20200424-0003/",
          "https://www.debian.org/security/2020/dsa-4661",
          "https://www.openssl.org/news/secadv/20200421.txt",
          "https://www.synology.com/security/advisory/Synology_SA_20_05_OpenSSL"
        ]
      }
    ]
  },
  {
    "Target": "juice-shop/frontend/package-lock.json",
    "Vulnerabilities": null
  },
  {
    "Target": "juice-shop/package-lock.json",
    "Vulnerabilities": [
      {
        "VulnerabilityID": "NSWG-ECO-428",
        "PkgName": "base64url",
        "InstalledVersion": "0.0.6",
        "FixedVersion": "\u003e=3.0.0",
        "Layer": {
          "DiffID": "sha256:6de27bb627f066285f0628172e686caf3e388a3bf266606c88d619d87d14aae3"
        },
        "Title": "Out-of-bounds Read",
        "Description": "`base64url` allocates uninitialized Buffers when number is passed in input on Node.js 4.x and below",
        "Severity": "HIGH",
        "References": [
          "https://github.com/brianloveswords/base64url/pull/25",
          "https://hackerone.com/reports/321687"
        ]
      },
      {
        "VulnerabilityID": "NSWG-ECO-17",
        "PkgName": "jsonwebtoken",
        "InstalledVersion": "0.1.0",
        "FixedVersion": "\u003e=4.2.2",
        "Layer": {
          "DiffID": "sha256:6de27bb627f066285f0628172e686caf3e388a3bf266606c88d619d87d14aae3"
        },
        "Title": "Verification Bypass",
        "Description": "It is possible for an attacker to bypass verification when \"a token digitally signed with an asymetric key (RS/ES family) of algorithms but instead the attacker send a token digitally signed with a symmetric algorithm (HS* family)\" [1]",
        "Severity": "HIGH",
        "References": [
          "https://auth0.com/blog/2015/03/31/critical-vulnerabilities-in-json-web-token-libraries/",
          "https://github.com/auth0/node-jsonwebtoken/commit/1bb584bc382295eeb7ee8c4452a673a77a68b687",
          "https://www.timmclean.net/2015/02/25/jwt-alg-none.html"
        ]
      },
      {
        "VulnerabilityID": "NSWG-ECO-17",
        "PkgName": "jsonwebtoken",
        "InstalledVersion": "0.4.0",
        "FixedVersion": "\u003e=4.2.2",
        "Layer": {
          "DiffID": "sha256:6de27bb627f066285f0628172e686caf3e388a3bf266606c88d619d87d14aae3"
        },
        "Title": "Verification Bypass",
        "Description": "It is possible for an attacker to bypass verification when \"a token digitally signed with an asymetric key (RS/ES family) of algorithms but instead the attacker send a token digitally signed with a symmetric algorithm (HS* family)\" [1]",
        "Severity": "HIGH",
        "References": [
          "https://auth0.com/blog/2015/03/31/critical-vulnerabilities-in-json-web-token-libraries/",
          "https://github.com/auth0/node-jsonwebtoken/commit/1bb584bc382295eeb7ee8c4452a673a77a68b687",
          "https://www.timmclean.net/2015/02/25/jwt-alg-none.html"
        ]
      },
      {
        "VulnerabilityID": "CVE-2016-1000223",
        "PkgName": "jws",
        "InstalledVersion": "0.2.6",
        "FixedVersion": "\u003e=3.0.0",
        "Layer": {
          "DiffID": "sha256:6de27bb627f066285f0628172e686caf3e388a3bf266606c88d619d87d14aae3"
        },
        "Title": "Forgeable Public/Private Tokens",
        "Description": "Since \"algorithm\" isn't enforced in `jws.verify()`, a malicious user could choose what algorithm is sent to the server. If the server is expecting RSA but is sent HMAC-SHA with RSA's public key, the server will think the public key is actually an HMAC private key. This could be used to forge any data an attacker wants.\n\nIn addition, there is the `none` algorithm to be concerned about.  In versions prior to 3.0.0, verification of the token could be bypassed when the `alg` field is set to `none`.\n\n*Edit ( 7/29/16 ): A previous version of this advisory incorrectly stated that the vulnerability was patched in version 2.0.0 instead of 3.0.0. The advisory has been updated to reflect this new information. Thanks to Fabien Catteau for reporting the error.*",
        "Severity": "HIGH",
        "References": [
          "https://auth0.com/blog/2015/03/31/critical-vulnerabilities-in-json-web-token-libraries/",
          "https://github.com/brianloveswords/node-jws/commit/585d0e1e97b6747c10cf5b7689ccc5618a89b299#diff-4ac32a78649ca5bdd8e0ba38b7006a1e"
        ]
      },
      {
        "VulnerabilityID": "CVE-2018-16487",
        "PkgName": "lodash",
        "InstalledVersion": "2.4.2",
        "FixedVersion": "\u003e=4.17.11",
        "Layer": {
          "DiffID": "sha256:6de27bb627f066285f0628172e686caf3e388a3bf266606c88d619d87d14aae3"
        },
        "Title": "lodash: Prototype pollution in utilities function",
        "Description": "A prototype pollution vulnerability was found in lodash \u003c4.17.11 where the functions merge, mergeWith, and defaultsDeep can be tricked into adding or modifying properties of Object.prototype.",
        "Severity": "HIGH",
        "References": [
          "https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-16487",
          "https://hackerone.com/reports/380873",
          "https://security.netapp.com/advisory/ntap-20190919-0004/",
          "https://www.npmjs.com/advisories/782"
        ]
      },
      {
        "VulnerabilityID": "CVE-2018-3721",
        "PkgName": "lodash",
        "InstalledVersion": "2.4.2",
        "FixedVersion": "\u003e=4.17.5",
        "Layer": {
          "DiffID": "sha256:6de27bb627f066285f0628172e686caf3e388a3bf266606c88d619d87d14aae3"
        },
        "Title": "lodash: Prototype pollution in utilities function",
        "Description": "lodash node module before 4.17.5 suffers from a Modification of Assumed-Immutable Data (MAID) vulnerability via defaultsDeep, merge, and mergeWith functions, which allows a malicious user to modify the prototype of \"Object\" via __proto__, causing the addition or modification of an existing property that will exist on all objects.",
        "Severity": "MEDIUM",
        "References": [
          "https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-3721",
          "https://github.com/lodash/lodash/commit/d8e069cc3410082e44eb18fcf8e7f3d08ebe1d4a",
          "https://hackerone.com/reports/310443",
          "https://security.netapp.com/advisory/ntap-20190919-0004/"
        ]
      },
      {
        "VulnerabilityID": "CVE-2016-4055",
        "PkgName": "moment",
        "InstalledVersion": "2.0.0",
        "FixedVersion": "\u003e=2.11.2",
        "Layer": {
          "DiffID": "sha256:6de27bb627f066285f0628172e686caf3e388a3bf266606c88d619d87d14aae3"
        },
        "Title": "moment.js: regular expression denial of service",
        "Description": "The duration function in the moment package before 2.11.2 for Node.js allows remote attackers to cause a denial of service (CPU consumption) via a long string, aka a \"regular expression Denial of Service (ReDoS).\"",
        "Severity": "HIGH",
        "References": [
          "http://www.openwall.com/lists/oss-security/2016/04/20/11",
          "http://www.oracle.com/technetwork/security-advisory/cpujul2018-4258247.html",
          "http://www.securityfocus.com/bid/95849",
          "https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-4055",
          "https://lists.apache.org/thread.html/10f0f3aefd51444d1198c65f44ffdf2d78ca3359423dbc1c168c9731@%3Cdev.flink.apache.org%3E",
          "https://lists.apache.org/thread.html/17ff53f7999e74fbe3cc0ceb4e1c3b00b180b7c5afec8e978837bc49@%3Cuser.flink.apache.org%3E",
          "https://lists.apache.org/thread.html/52bafac05ad174000ea465fe275fd3cc7bd5c25535a7631c0bc9bfb2@%3Cuser.flink.apache.org%3E",
          "https://lists.apache.org/thread.html/54df3aeb4239b64b50b356f0ca6f986e3c4ca5b84c515dce077c7854@%3Cuser.flink.apache.org%3E",
          "https://nodesecurity.io/advisories/55",
          "https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS",
          "https://www.tenable.com/security/tns-2019-02"
        ]
      },
      {
        "VulnerabilityID": "CVE-2016-1000237",
        "PkgName": "sanitize-html",
        "InstalledVersion": "1.4.2",
        "FixedVersion": "\u003e=1.4.3",
        "Layer": {
          "DiffID": "sha256:6de27bb627f066285f0628172e686caf3e388a3bf266606c88d619d87d14aae3"
        },
        "Title": "XSS - Sanitization not applied recursively",
        "Description": "sanitize-html before 1.4.3 has XSS.",
        "Severity": "MEDIUM",
        "References": [
          "https://github.com/punkave/sanitize-html/issues/29",
          "https://nodesecurity.io/advisories/135",
          "https://raw.githubusercontent.com/distributedweaknessfiling/cvelist/master/2016/1000xxx/CVE-2016-1000237.json"
        ]
      },
      {
        "VulnerabilityID": "NSWG-ECO-154",
        "PkgName": "sanitize-html",
        "InstalledVersion": "1.4.2",
        "FixedVersion": "\u003e=1.11.4",
        "Layer": {
          "DiffID": "sha256:6de27bb627f066285f0628172e686caf3e388a3bf266606c88d619d87d14aae3"
        },
        "Title": "Cross Site Scripting",
        "Description": "Sanitize-html is a library for scrubbing html input of malicious values.\n\nVersions 1.11.1 and below are vulnerable to cross site scripting (XSS) in certain scenarios:\n\nIf allowed at least one nonTextTags, the result is a potential XSS vulnerability.\nPoC:\n\n```\nvar sanitizeHtml = require('sanitize-html');\n\nvar dirty = '!\u003ctextarea\u003e\u0026lt;/textarea\u0026gt;\u003csvg/onload=prompt`xs`\u0026gt;\u003c/textarea\u003e!';\nvar clean = sanitizeHtml(dirty, {\n    allowedTags: [ 'textarea' ]\n});\n\nconsole.log(clean);\n\n// !\u003ctextarea\u003e\u003c/textarea\u003e\u003csvg/onload=prompt`xs`\u003e\u003c/textarea\u003e!\n```",
        "Severity": "MEDIUM",
        "References": [
          "https://github.com/punkave/sanitize-html/commit/5d205a1005ba0df80e21d8c64a15bb3accdb2403",
          "https://github.com/punkave/sanitize-html/issues/100"
        ]
      }
    ]
  }
]

```


</TabItem>


</Tabs>
          
</TabItem>
          
<TabItem value="mediawiki">
  
<div>

</div>

<Tabs
defaultValue="sc"
values={[
  {label: 'Scan', value: 'sc'}, 
  {label: 'Findings', value: 'fd'},
]}>


<TabItem value="sc">

```yaml

apiVersion: "execution.experimental.securecodebox.io/v1"
kind: Scan
metadata:
  name: "trivy-mediawiki"
spec:
  scanType: "trivy"
  parameters:
    - "mediawiki:stable"


```

</TabItem>



<TabItem value="fd">


<span>
The findings are too large to display, you may download
<a target="_blank" href='/public/findings/trivy-mediawiki-findings.yaml' download> the file.</a>
</span>


</TabItem>


</Tabs>
          
</TabItem>
          
</Tabs>