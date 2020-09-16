export const Scanners = [
  {
    title: 'Amass',
    imageUrl: 'img/integrationIcons/Amass.svg',
    type: 'Network',
    path: 'docs/scanners/amass',
    description: 'Subdomain Enumeration Scanner',
  },
  {
    title: 'Ncrack',
    imageUrl: 'img/integrationIcons/Ncrack.svg',
    type: 'Authentication',
    path: 'docs/scanners/ncrack',
    description: 'Network Authentication Bruteforcing',
  },
  {
    title: 'Nikto',
    imageUrl: 'img/integrationIcons/Nikto.svg',
    type: 'Webserver',
    path: 'docs/scanners/nikto',
    description: 'Webserver Vulnerability Scanner',
  },
  {
    title: 'Nmap',
    imageUrl: 'img/integrationIcons/Nmap.svg',
    type: 'Network',
    path: 'docs/scanners/nmap',
    description: 'Network Discovery and Security Auditing',
  },
  {
    title: 'ssh_scan',
    imageUrl: 'img/integrationIcons/SSH.svg',
    type: 'SSH',
    path: 'docs/scanners/ssh_scan',
    description: 'SSH Configuration and Policy Scanner',
  },
  {
    title: 'SSLyze',
    imageUrl: 'img/integrationIcons/SSLyze.svg',
    type: 'SSL',
    path: 'docs/scanners/sslyze',
    description: 'SSL/TLS Configuration Scanner',
  },
  {
    title: 'Trivy',
    imageUrl: 'img/integrationIcons/Trivy.svg',
    type: 'Container',
    path: 'docs/scanners/trivy',
    description: 'Container Vulnerability Scanner',
  },
  {
    title: 'WPScan',
    imageUrl: 'img/integrationIcons/WPScan.svg',
    type: 'CMS',
    path: 'docs/scanners/wpscan',
    description: 'Wordpress Vulnerability Scanner',
  },
  {
    title: 'Zap',
    imageUrl: 'img/integrationIcons/Zap.svg',
    type: 'WebApplication',
    path: 'docs/scanners/zap',
    description: 'WebApp & OpenAPI Vulnerability Scanner',
  },
  {
    title: 'kube-hunter',
    imageUrl: 'img/integrationIcons/kube-hunter.svg',
    type: 'Kubernetes',
    path: 'docs/scanners/kube-hunter',
    description: 'Kubernetes Vulnerability Scanner',
  },
  {
    title: 'kubeaudit',
    imageUrl: 'img/integrationIcons/kubeaudit.svg',
    type: 'Kubernetes',
    path: 'docs/scanners/kubeaudit',
    description: 'Audit for Kubernetes Clusters',
  },
];

export const PersistenceProviders = [
  {
    title: 'DefectDojo',
    imageUrl: 'img/integrationIcons/DefectDojo.svg',
    path: 'docs/hooks/persistence-defectdojo',
    description: 'Publishes all Scan Findings to DefectDojo.',
  },
  {
    title: 'Elasticsearch',
    imageUrl: 'img/integrationIcons/ElasticSearch.svg',
    path: 'docs/hooks/persistence-elastic',
    description: 'Publishes all Scan Findings to Elasticsearch',
  },
  {
    title: 'Static Report',
    imageUrl: 'img/integrationIcons/Static Report.svg',
    path: 'docs/hooks/persistence-static-report',
    description: 'Publishes all Scan Findings as HTML Report',
  },
];

export const Hooks = [
  {
    title: 'Cascading Scans',
    imageUrl: 'img/integrationIcons/Cascading Scans.svg',
    path: 'docs/hooks/declarative-subsequent-scans',
    description: 'Cascading Scans based Declarative Rules',
  },
  {
    title: 'Generic Webhook',
    imageUrl: 'img/integrationIcons/Generic Webhook.svg',
    path: 'docs/hooks/generic-webhook',
    description: 'Publishes Scan Findings as WebHook',
  },
  {
    title: 'Imperative Scans',
    imageUrl: 'img/integrationIcons/Imperative Scans.svg',
    path: 'docs/hooks/imperative-subsequent-scans',
    description: 'Cascading Scans based imperative Rules',
  },
  {
    title: 'MS Teams WebHook',
    imageUrl: 'img/integrationIcons/MS Teams Webhook.svg',
    path: 'docs/hooks/teams-webhook',
    description: 'Publishes Scan Summary to MS Teams',
  },
  {
    title: 'Slack WebHook',
    imageUrl: 'img/integrationIcons/Slack Webhook.svg',
    path: 'docs/hooks/slack-webhook',
    description: 'Publishes Scan Summary to Slack',
  },
  {
    title: 'Update Field',
    imageUrl: 'img/integrationIcons/Update Field.svg',
    path: 'docs/hooks/update-field',
    description: 'Updates Fields in Finding Results',
  },
];

export default { Scanners, PersistenceProviders, Hooks };
