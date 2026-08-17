// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Греки-соотечественники в постсоветских странах",
  tagline: "Этнические греки из стран бывшего СССР",
  url: "https://omogeneis.gr",
  baseUrl: "/",
  trailingSlash: false,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  headTags: [
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      value: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://omogeneis.gr/#organization',
            'name': 'ομογενής - Греки-соотечественники в постсоветских странах',
            'url': 'https://omogeneis.gr',
            'logo': 'https://omogeneis.gr/img/logo.svg',
            'sameAs': [
              'https://t.me/Greek_USSR'
            ],
            'description': 'Информационный ресурс и сообщество для греков-соотечественников из стран бывшего СССР по вопросам греческого гражданства, натурализации и культуры.'
          },
          {
            '@type': 'WebSite',
            '@id': 'https://omogeneis.gr/#website',
            'url': 'https://omogeneis.gr',
            'name': 'ομογενής',
            'publisher': {
              '@id': 'https://omogeneis.gr/#organization'
            },
            'inLanguage': ['ru', 'el', 'en']
          }
        ]
      }),
    },
  ],

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
          {
            from: ['/petition', '/petition-gr', '/petition-en'],
            to: '/blog',
          },
        ],
        createRedirects(existingPath) {
          if (existingPath.includes('/docs/category/')) {
            const categorySlug = existingPath.split('/docs/category/')[1];
            return [
              `/docs/intro/category/${categorySlug}`,
              `/intro/category/${categorySlug}`,
            ];
          }
          return undefined;
        },
      },
    ],
    /*
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'digest',
        routeBasePath: 'digest',
        path: './digest',
      },
    ],
    */

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
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**', '**/tags/**'],
          filename: 'sitemap.xml',
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
      image: 'img/logo.svg',
      metadata: [
        {name: 'keywords', content: 'гражданство, Греция, натурализация, греки СССР, ходатайство, документы, переводчики, греческий язык, история эллинизма, ομογενής, omogeneis'},
        {name: 'author', content: 'ομογενής'},
        {name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'},
        {property: 'og:type', content: 'website'},
        {property: 'og:site_name', content: 'ομογενής - Греки-соотечественники'},
        {property: 'og:title', content: 'Греки-соотечественники в постсоветских странах'},
        {property: 'og:description', content: 'Инструкции по получению греческого гражданства, натурализации, подготовке документов, изучению греческого языка и истории эллинизма.'},
        {property: 'og:url', content: 'https://omogeneis.gr'},
        {name: 'twitter:card', content: 'summary_large_image'},
        {name: 'twitter:title', content: 'Греки-соотечественники в постсоветских странах'},
        {name: 'twitter:description', content: 'Инструкции по получению греческого гражданства, натурализации, подготовке документов, изучению греческого языка и истории эллинизма.'},
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
