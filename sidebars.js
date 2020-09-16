module.exports = {
  someSidebar: {
    Others: ['Test'],
    Docs: ['docs/developer-guide', 'docs/user-guide'],
    Hooks: [
      'hooks/declarative-subsequent-scans',
      'hooks/generic-webhook',
      'hooks/imperative-subsequent-scans',
      'hooks/persistence-defectdojo',
      'hooks/persistence-elastic',
      'hooks/persistence-static-report',
      'hooks/slack-webhook',
      'hooks/teams-webhook',
      'hooks/update-field',
    ],
    Scanners: [
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
    Test: [
      {
        type: 'category',
        label: 'testdeep',
        items: ['test/testdeep/testdeep'],
      },
      'test/testlow',
    ],
  },
};
