// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: ' DOPTIME',
  tagline: 'the framework of simple and efficient',
  favicon: 'img/icon512x512.png',

  // Set the production url of your site here
  url: 'https://www.doptime.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: `/`,


  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'doptime', // Usually your GitHub org/user name.
  projectName: 'doptime', // Usually your repo name.

  //onBrokenLinks: 'throw',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    path: 'i18n',
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      zh: {
        label: '中文',
        htmlLang: 'zh-Hans',

      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // 确保路径设置正确
          path: 'docs',
          routeBasePath: '/docs',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/doptime/doptime-website/tree/main/',

        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/doptime/doptime-website/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Home',
        logo: { alt: 'Doptime Logo', src: 'img/logo.png', },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          // { to: '/Test', label: 'Test', position: 'left' },
          // { to: '/ViewLogs', label: 'console', position: 'left' },
          { to: '/MyProjects', label: 'MyProjects', position: 'left' },
          // { to: '/RedisGUI', label: 'RedisGUI', position: 'left' },
          { to: '/DynamicDev', label: 'DynamicDev', position: 'left' },
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            type: 'custom-item',
            position: 'right',
          },

        ],
      },
      // footer: {
      //   style: 'dark',
      //   links: [
      //     {
      //       title: 'Docs',
      //       items: [
      //         {
      //           label: 'Documentation',
      //           to: '/docs/intro',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'github',
      //       items: [
      //         {
      //           label: 'doptime',
      //           href: 'https://github.com/doptime/doptime',
      //         },
      //         {
      //           label: 'doptime-client',
      //           href: 'https://github.com/doptime/doptime-client',
      //         },
      //       ],
      //     },
      //   ],
      //   copyright: `Copyright © ${new Date().getFullYear()} Doptime`,
      // },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      mermaid: {
        options: { maxTextSize: 8192, },
        theme: { light: 'default', dark: 'forest' },
      },
    }),
  markdown: { mermaid: true, },
  themes: ['@docusaurus/theme-mermaid'],
  plugins: [
  ],
};

export default config;
