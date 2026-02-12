// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Греки-соотечественники в постсоветских странах",
  tagline: "Этнические греки из стран бывшего СССР",
  url: "https://omogenis.ru",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "omogenis", // Usually your GitHub org/user name.
  projectName: "omogenis.github.io", // Usually your repo name.
  deploymentBranch: `gh-pages`,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "ru",
    locales: ["ru", "el", "en"],
  },

  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        /**
         * Required for any multi-instance plugin
         */
        id: 'digest',
        /**
         * URL route for the blog section of your site.
         * *DO NOT* include a trailing slash.
         */
        routeBasePath: 'digest',
        /**
         * Path to data on filesystem relative to site dir.
         */
        path: './digest',
      },
    ],

    async function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/omogenis/omogenis.github.io/tree/main",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/omogenis/omogenis.github.io/tree/main",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        {name: 'keywords', content: 'гражданство, Греция, натурализация, греки СССР, ходатайство, документы, переводчики, греческий язык, история эллинизма'},
      ],
      colorMode: {
        defaultMode: "light",
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: "ομογενής",
        logo: {
          alt: "Греки стран бывшего Советского союза",
          src: "img/logo.svg",
        },
        items: [
          { to: "/blog", label: "Новости", position: "left" },
           { to: "/statistics", label: "Статистика", position: "left" },
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Материалы и инструкции",
          },
          { href: "/digests", label: "Новостной дайджест", position: "left" },
          {
            href: "/contacts",
            label: "Контакты",
            position: "right",
          },
          {
            type: 'localeDropdown',
            position: 'right'
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Подробнее",
            items: [
              {
                label: "Материалы и инструкции",
                to: "/docs/intro",
              },
              {
                label: "Новости",
                to: "/blog",
              },
            ],
          },
          {
            title: "Сообщество",
            items: [
              {
                label: "Греческие общества",
                href: "https://rusgreek.ru/regions",
              },
              {
                label: "Адвокаты и переводчики",
                href: "/docs/more-info/lawyers",
              },
              {
                label: "Telegram чат",
                href: "https://t.me/Greek_USSR",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ομογενής.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        appId: "1Q351Q949Q",

        apiKey: "242cd96420cf28742ecf27168f843ad8",

        indexName: "omogenis",

        contextualSearch: true,
      },
    }),
};

module.exports = config;
