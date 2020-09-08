module.exports = {
  someSidebar: {
    'Get Started': ['user', 'developer'],
    Integrations: [
      {
        type: 'category',
        label: 'Scanners',
        items: [
          'scanners/amass',
          'scanners/kube-hunter',
          'scanners/kubeaudit',
          'scanners/ncrack',
          'scanners/nikto',
          'scanners/nmap',
          'scanners/ssh_scan',
          'scanners/sslyze',
          'scanners/trivy',
          'scanners/wpscan',
          'scanners/zap',
        ],
      },
      {
        type: 'category',
        label: 'Persistence Providers',
        items: [
          'persistenceProviders/defectDojo',
          'persistenceProviders/elasticSearch',
          'persistenceProviders/static',
        ],
      },
      {
        type: 'category',
        label: 'Hooks',
        items: [
          'hooks/declarative',
          'hooks/imperative',
          'hooks/generic',
          'hooks/slack',
          'hooks/teams',
          'hooks/updateField',
        ],
      },
    ],
  },
};
