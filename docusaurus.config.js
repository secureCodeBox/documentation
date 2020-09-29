module.exports = {
  title: "secureCodeBox",
  tagline: "Testing your Software Security, Network and Applications",
  url: "https://securecodebox.io",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/Favicon.svg",
  organizationName: "iteratec GmbH", // Usually your GitHub org/user name.
  projectName: "secureCodeBox.io", // Usually your repo name.
  themeConfig: {
    navbar: {
      logo: {
        alt: "secureCodeBox Logo",
        src: "img/Logo Color.svg",
      },
      items: [
        {
          to: `docs/getting-started/installation`,
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        { to: "blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/secureCodeBox/",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Style Guide",
              to: "https://github.com/securecodebox/docusaurus#Styleguide",
            },
            {
              label: "Icons",
              to: "https://www.flaticon.com/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/secureCodeBox",
            },
            {
              label: "Slack",
              href:
                'https://join.slack.com/t/securecodebox/shared_invite/enQtNDU3MTUyOTM0NTMwLTBjOWRjNjVkNGEyMjQ0ZGMyNDdlYTQxYWQ4MzNiNGY3MDMxNThkZjJmMzY2NDRhMTk3ZWM3OWFkYmY1YzUxNTU"',
            },
            {
              label: "Twitter",
              href: "https://twitter.com/securecodebox",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Imprint",
              href: "https://www.iteratec.de/impressum/",
            },
            {
              label: "Data Protection",
              to: "https://www.iteratec.com/data-protection/",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} iteratec GmbH. Built with Docusaurus.`,
    },
    prism: {
      theme: require("prism-react-renderer/themes/dracula"),
      additionalLanguages: ["python", "java", "rust", "yaml", "go"],
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.json"),
          editUrl: "https://github.com/securecodebox/docusaurus",
        },
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/securecodebox/docusaurus",
          feedOptions: {
            type: 'all',
            title: 'The secureCodeBox Developer Blog',
            description: 'In this blog the core maintainer will write about the development, roadmap, ideas RFCs etc. of the OWASP secureCodeBox.',
            copyright: `Copyright © ${new Date().getFullYear()} iteratec GmbH`,
            language: 'en',
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  themes: ["@docusaurus/theme-live-codeblock"],
  plugins: ["docusaurus-plugin-sass"],
};
