// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "ομογενής",
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
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // /docs/oldDoc -> /docs/newDoc
          {
            to: '/el/petition',
            from: '/petition-gr',
          },
          {
            to: '/el/statistics',
            from: '/statistics-gr',
          },
        ],
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
          { to: "/petition-gr", label: "Ανοιχτή Επιστολή", position: "left" },
          { to: "/statistics-gr", label: "Στατιστικά", position: "left" },
          { to: "/petition-en", label: "Petition", position: "left" },
          { to: "/petition", label: "Петиция", position: "left" },
          
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Материалы и инструкции",
          },
          { to: "/blog", label: "Новости", position: "left" },
          {
            href: "/contacts",
            label: "Contacts",
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
                label: "Получение гражданства",
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
                href: "https://t.me/+GiOOaM4Qsk04Y2Ji",
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
        // The application ID provided by Algolia
        appId: "9Y1L968AES",

        // Public API key: it is safe to commit it
        apiKey: "03fb329aa7258f0bf489618fa6245dd0",

        indexName: "omogenis",

        contextualSearch: true,
      },
    }),
};

module.exports = config;
