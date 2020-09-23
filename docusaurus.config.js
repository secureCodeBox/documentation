module.exports = {
  title: 'secureCodeBox',
  tagline: 'Testing your Software Security, Network and Applications',
  url: 'https://securecodebox.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/Favicon.svg',
  organizationName: 'iteratec GmbH', // Usually your GitHub org/user name.
  projectName: 'secureCodeBox.io', // Usually your repo name.
  themeConfig: {
    navbar: {
      logo: {
        alt: 'secureCodeBox Logo',
        src: 'img/Logo Color.svg',
      },
      items: [
        {
          to: 'docs/guides/user-guide',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        { to: 'blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/securecodebox',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        // {
        //   title: 'Docs',
        //   items: [
        //     {
        //       label: 'Style Guide',
        //       to: 'docs/introduction#style-guide',
        //     },
        //   ],
        // },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/secureCodeBox',
            },
            {
              label: 'Slack',
              href:
                'https://join.slack.com/t/securecodebox/shared_invite/enQtNDU3MTUyOTM0NTMwLTBjOWRjNjVkNGEyMjQ0ZGMyNDdlYTQxYWQ4MzNiNGY3MDMxNThkZjJmMzY2NDRhMTk3ZWM3OWFkYmY1YzUxNTU"',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/securecodebox',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Imprint',
              href: 'https://www.iteratec.de/impressum/',
            },
            {
              label: 'Data Protection',
              to: 'https://www.iteratec.com/data-protection/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} secureCodeBox, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: require('prism-react-renderer/themes/dracula'),
      additionalLanguages: ['powershell', 'python', 'java', 'rust', 'yaml'],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/securecodebox/docusaurus',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/securecodebox/docusaurus',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themes: ['@docusaurus/theme-live-codeblock'],
  plugins: ['docusaurus-plugin-sass'],
};
