---
title: 'WPScan'
path: 'scanners/wpscan'
category: 'scanner'
type: "CMS"
state: "released"
appVersion: "3.8.5"
usecase: 'Wordpress Vulnerability Scanner'
---

![WPScan Logo](https://raw.githubusercontent.com/wpscanteam/wpscan/gh-pages/images/wpscan_logo.png)

WPScan is a free, for non-commercial use, black box WordPress vulnerability scanner written for security professionals and blog maintainers to test the security of their sites.

> NOTE: You need to provide WPSan with an API Token so that it can look up vulnerabilities infos with [https://wpvulndb.com](https://wpvulndb.com). Without the token WPScan will only identify Wordpress Core / Plugin / Theme versions but not if they are actually vulnerable. You can get a free API Token at by registering for an account at [https://wpvulndb.com](https://wpvulndb.com). Using the secureCodeBox WPScans you can specify the token via the `WPVULNDB_API_TOKEN` target attribute, see the example below.

To learn more about the WPScan scanner itself visit [wpscan.org] or [wpscan.io].

<!-- end -->

## Deployment

The WPScan scanType can be deployed via helm:

```bash
helm upgrade --install wpscan ./scanners/wpscan/
```

## Configuration

The following security scan configuration example are based on the [WPScan Documentation], please take a look at the original documentation for more configuration examples.

* Scan all plugins with known vulnerabilities: `wpscan --url example.com -e vp --plugins-detection mixed --api-token WPVULNDB_API_TOKEN`
* Scan all plugins in our database (could take a very long time): `wpscan --url example.com -e ap --plugins-detection mixed --api-token WPVULNDB_API_TOKEN`
* Password brute force attack: `wpscan --url example.com -e u --passwords /path/to/password_file.txt`
* WPScan keeps a local database of metadata that is used to output useful information, such as the latest version of a plugin. The local database can be updated with the following command: `wpscan --update`
* When enumerating the WordPress version, installed plugins or installed themes, you can use three different "modes", which are:
  * passive
  * aggressive
  * mixed
  If you want the most results use the "mixed" mode. However, if you are worried that the server may not be able to handle a large number of requests, use the "passive" mode. The default mode is "mixed", with the exception of plugin enumeration, which is "passive". You will need to manually override the plugin detection mode, if you want to use anything other than the default, with the `--plugins-detection` option.
* WPScan can enumerate various things from a remote WordPress application, such as plugins, themes, usernames, backed up files wp-config.php files, Timthumb files, database exports and more. To use WPScan's enumeration capabilities supply the `-e `option.

```bash
Available Choices:
  vp  |  Vulnerable plugins
  ap  |  All plugins
  p   |  Plugins
  vt  |  Vulnerable themes
  at  |  All themes
  t   |  Themes
  tt  |  Timthumbs
  cb  |  Config backups
  dbe |  Db exports
  u   |  User IDs range. e.g: u1-5
         Range separator to use: '-'
         Value if no argument supplied: 1-10
  m   |  Media IDs range. e.g m1-15
         Note: Permalink setting must be set to "Plain" for those to be detected
         Range separator to use: '-'
         Value if no argument supplied: 1-100

Separator to use between the values: ','
Default: All Plugins, Config Backups
Value if no argument supplied: vp,vt,tt,cb,dbe,u,m
Incompatible choices (only one of each group/s can be used):
  - vp, ap, p
  - vt, at, t
```

[wpscan.io]: https://wpscan.io/
[wpscan.org]: https://wpscan.org/
[WPScan Documentation]: https://github.com/wpscanteam/wpscan/wiki/WPScan-User-Documentation



## Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### Localhost Scan
<Tabs
  defaultValue="example.com"
  values={[{"label":"Example.com","value":"example.com"},{"label":"Old-wordpress","value":"old-wordpress"}]}>
  

<TabItem value="example.com">
  
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
  name: "wpscan-www.example.com"
spec:
  scanType: "wpscan"
  parameters:
    - "--url"
    - https://www.example.com
    - "-e"
    - "vp"
    - "--plugins-detection"
    - "mixed"
    - "--api-token"
    - "AAAAABBBBBCCCCCDDDDEEEEEEE"


```

</TabItem>



<TabItem value="fd">


```yaml

{
    "banner": {
      "description": "WordPress Security Scanner by the WPScan Team",
      "version": "3.8.1",
      "authors": [
        "@_WPScan_",
        "@ethicalhack3r",
        "@erwan_lr",
        "@firefart"
      ],
      "sponsor": "Sponsored by Automattic - https://automattic.com/"
    },
    "start_time": 1591480247,
    "start_memory": 41349120,
    "target_url": "https://www.example.com/",
    "target_ip": "192.168.200.100",
    "effective_url": "https://www.example.com/",
    "interesting_findings": [
      {
        "url": "https://www.example.com/",
        "to_s": "Headers",
        "type": "headers",
        "found_by": "Headers (Passive Detection)",
        "confidence": 100,
        "confirmed_by": {
  
        },
        "references": {
  
        },
        "interesting_entries": [
          "Server: Apache/2.4.29 (Ubuntu)"
        ]
      },
      {
        "url": "https://www.example.com/robots.txt",
        "to_s": "https://www.example.com/robots.txt",
        "type": "robots_txt",
        "found_by": "Robots Txt (Aggressive Detection)",
        "confidence": 100,
        "confirmed_by": {
  
        },
        "references": {
  
        },
        "interesting_entries": [
          "/wp-admin/",
          "/wp-admin/admin-ajax.php"
        ]
      },
      {
        "url": "https://www.example.com/readme.html",
        "to_s": "https://www.example.com/readme.html",
        "type": "readme",
        "found_by": "Direct Access (Aggressive Detection)",
        "confidence": 100,
        "confirmed_by": {
  
        },
        "references": {
  
        },
        "interesting_entries": [
  
        ]
      },
      {
        "url": "https://www.example.com/wp-content/mu-plugins/",
        "to_s": "This site has 'Must Use Plugins': https://www.example.com/wp-content/mu-plugins/",
        "type": "mu_plugins",
        "found_by": "Direct Access (Aggressive Detection)",
        "confidence": 80,
        "confirmed_by": {
  
        },
        "references": {
          "url": [
            "http://codex.wordpress.org/Must_Use_Plugins"
          ]
        },
        "interesting_entries": [
  
        ]
      },
      {
        "url": "https://www.example.com/wp-cron.php",
        "to_s": "The external WP-Cron seems to be enabled: https://www.example.com/wp-cron.php",
        "type": "wp_cron",
        "found_by": "Direct Access (Aggressive Detection)",
        "confidence": 60,
        "confirmed_by": {
  
        },
        "references": {
          "url": [
            "https://www.iplocation.net/defend-wordpress-from-ddos",
            "https://github.com/wpscanteam/wpscan/issues/1299"
          ]
        },
        "interesting_entries": [
  
        ]
      }
    ],
    "version": {
      "number": "5.3.3",
      "release_date": "2020-04-29",
      "status": "latest",
      "found_by": "Rss Generator (Passive Detection)",
      "confidence": 100,
      "interesting_entries": [
        "https://www.example.com/feed/, <generator>https://wordpress.org/?v=5.3.3</generator>",
        "https://www.example.com/comments/feed/, <generator>https://wordpress.org/?v=5.3.3</generator>"
      ],
      "confirmed_by": {
  
      },
      "vulnerabilities": [
  
      ]
    },
    "main_theme": {
      "slug": "twentyseventeen",
      "location": "https://www.example.com/wp-content/themes/twentyseventeen/",
      "latest_version": "2.3",
      "last_updated": "2020-03-31T00:00:00.000Z",
      "outdated": true,
      "readme_url": "https://www.example.com/wp-content/themes/twentyseventeen/README.txt",
      "directory_listing": false,
      "error_log_url": null,
      "style_url": "https://www.example.com/wp-content/themes/twentyseventeen/style.css?ver=5.3.3",
      "style_name": "Twenty Seventeen",
      "style_uri": "https://wordpress.org/themes/twentyseventeen/",
      "description": "Twenty Seventeen brings your site to life with header video and immersive featured images. With a focus on business sites, it features multiple sections on the front page as well as widgets, navigation and social menus, a logo, and more. Personalize its asymmetrical grid with a custom color scheme and showcase your multimedia content with post formats. Our default theme for 2017 works great in many languages, for any abilities, and on any device.",
      "author": "the WordPress team",
      "author_uri": "https://wordpress.org/",
      "template": null,
      "license": "GNU General Public License v2 or later",
      "license_uri": "http://www.gnu.org/licenses/gpl-2.0.html",
      "tags": "one-column, two-columns, right-sidebar, flexible-header, accessibility-ready, custom-colors, custom-header, custom-menu, custom-logo, editor-style, featured-images, footer-widgets, post-formats, rtl-language-support, sticky-post, theme-options, threaded-comments, translation-ready",
      "text_domain": "twentyseventeen",
      "found_by": "Css Style In Homepage (Passive Detection)",
      "confidence": 100,
      "interesting_entries": [
  
      ],
      "confirmed_by": {
        "Css Style In 404 Page (Passive Detection)": {
          "confidence": 70,
          "interesting_entries": [
  
          ]
        }
      },
      "vulnerabilities": [
  
      ],
      "version": {
        "number": "2.2",
        "confidence": 80,
        "found_by": "Style (Passive Detection)",
        "interesting_entries": [
          "https://www.example.com/wp-content/themes/twentyseventeen/style.css?ver=5.3.3, Match: 'Version: 2.2'"
        ],
        "confirmed_by": {
  
        }
      },
      "parents": [
  
      ]
    },
    "plugins": {
      "akismet": {
        "slug": "akismet",
        "location": "https://www.example.com/wp-content/plugins/akismet/",
        "latest_version": "4.1.6",
        "last_updated": "2020-06-04T17:21:00.000Z",
        "outdated": false,
        "readme_url": false,
        "directory_listing": false,
        "error_log_url": null,
        "found_by": "Known Locations (Aggressive Detection)",
        "confidence": 80,
        "interesting_entries": [
          "https://www.example.com/wp-content/plugins/akismet/, status: 403"
        ],
        "confirmed_by": {
  
        },
        "vulnerabilities": [
          {
            "title": "Akismet 2.5.0-3.1.4 - Unauthenticated Stored Cross-Site Scripting (XSS)",
            "fixed_in": "3.1.5",
            "references": {
              "cve": [
                "2015-9357"
              ],
              "url": [
                "http://blog.akismet.com/2015/10/13/akismet-3-1-5-wordpress/",
                "https://blog.sucuri.net/2015/10/security-advisory-stored-xss-in-akismet-wordpress-plugin.html"
              ],
              "wpvulndb": [
                "8215"
              ]
            }
          }
        ],
        "version": null
      }
    },
    "vuln_api": {
      "plan": "free",
      "requests_done_during_scan": 4,
      "requests_remaining": 18
    },
    "stop_time": 1591480342,
    "elapsed": 94,
    "requests_done": 2335,
    "cached_requests": 9,
    "data_sent": 631774,
    "data_sent_humanised": "616.967 KB",
    "data_received": 1093069,
    "data_received_humanised": "1.042 MB",
    "used_memory": 272867328,
    "used_memory_humanised": "260.227 MB"
  }

```


</TabItem>


</Tabs>
          
</TabItem>
          
<TabItem value="old-wordpress">
  
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
  name: "wpscan-old-wordpress-internal"
spec:
  scanType: "wpscan"
  parameters:
    - "--url"
    - old-wordpress.demo-apps.svc.cluster.local
    - "-e"
    - "vp"
    - "--plugins-detection"
    - "mixed"


```

</TabItem>



<TabItem value="fd">


```yaml

[
  {
    "name": "WordPress Service",
    "description": "WordPress Service Information",
    "category": "WordPress Service",
    "location": "http://old-wordpress.demo-apps.svc.cluster.local/",
    "osi_layer": "APPLICATION",
    "severity": "INFORMATIONAL",
    "reference": {},
    "confidence": 100,
    "attributes": {
      "ip_address": "10.99.82.140",
      "wpscan_version": "3.8.7",
      "wpscan_requests": 4777,
      "wp_version": "4.0.31",
      "wp_release_date": "2020-06-10",
      "wp_release_status": "latest",
      "wp_interesting_entries": [
        "http://old-wordpress.demo-apps.svc.cluster.local/, Match: 'WordPress 4.0.31'"
      ],
      "wp_found_by": "Meta Generator (Passive Detection)",
      "wp_confirmed_by": {
        "Atom Generator (Aggressive Detection)": {
          "confidence": 80,
          "interesting_entries": [
            "http://old-wordpress.demo-apps.svc.cluster.local/?feed=atom, <generator uri=\"https://wordpress.org/\" version=\"4.0.31\">WordPress</generator>"
          ]
        }
      },
      "wp_vulnerabilities": []
    },
    "id": "35e61c23-d525-4509-a024-d1aef37a1623"
  },
  {
    "name": "WordPress finding 'headers'",
    "description": "Headers",
    "category": "WordPress headers",
    "location": "http://old-wordpress.demo-apps.svc.cluster.local/",
    "osi_layer": "APPLICATION",
    "severity": "INFORMATIONAL",
    "confidence": 100,
    "reference": {},
    "attributes": {
      "wp_interesting_entries": [
        "Server: nginx/1.7.7",
        "X-Powered-By: PHP/5.4.34-0+deb7u1"
      ],
      "wp_found_by": "Headers (Passive Detection)",
      "wp_confirmed_by": {}
    },
    "id": "ca074030-2e55-4a10-bf8f-039c1b8978d9"
  },
  {
    "name": "WordPress finding 'xmlrpc'",
    "description": "XML-RPC seems to be enabled: http://old-wordpress.demo-apps.svc.cluster.local/xmlrpc.php",
    "category": "WordPress xmlrpc",
    "location": "http://old-wordpress.demo-apps.svc.cluster.local/xmlrpc.php",
    "osi_layer": "APPLICATION",
    "severity": "INFORMATIONAL",
    "confidence": 100,
    "reference": {},
    "attributes": {
      "wp_interesting_entries": [],
      "wp_found_by": "Direct Access (Aggressive Detection)",
      "wp_confirmed_by": {}
    },
    "id": "9b521d88-4018-4069-971d-7a020eebab51"
  },
  {
    "name": "WordPress finding 'readme'",
    "description": "WordPress readme found: http://old-wordpress.demo-apps.svc.cluster.local/readme.html",
    "category": "WordPress readme",
    "location": "http://old-wordpress.demo-apps.svc.cluster.local/readme.html",
    "osi_layer": "APPLICATION",
    "severity": "INFORMATIONAL",
    "confidence": 100,
    "reference": {},
    "attributes": {
      "wp_interesting_entries": [],
      "wp_found_by": "Direct Access (Aggressive Detection)",
      "wp_confirmed_by": {}
    },
    "id": "7160e807-b6bb-4994-9477-22cac8e2f549"
  },
  {
    "name": "WordPress finding 'wp_cron'",
    "description": "The external WP-Cron seems to be enabled: http://old-wordpress.demo-apps.svc.cluster.local/wp-cron.php",
    "category": "WordPress wp_cron",
    "location": "http://old-wordpress.demo-apps.svc.cluster.local/wp-cron.php",
    "osi_layer": "APPLICATION",
    "severity": "INFORMATIONAL",
    "confidence": 60,
    "reference": {},
    "attributes": {
      "wp_interesting_entries": [],
      "wp_found_by": "Direct Access (Aggressive Detection)",
      "wp_confirmed_by": {}
    },
    "id": "828bf907-da73-4076-994b-a46652b1f972"
  }
]


```


</TabItem>


</Tabs>
          
</TabItem>
          
</Tabs>