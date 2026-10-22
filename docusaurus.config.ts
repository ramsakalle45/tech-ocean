import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Ram's Dev Ocean",
  tagline: 'Python, SQL, GenAI and System Design — from basics to advanced',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Stay compatible with the upcoming Docusaurus v4
  },

  // Production URL. Change after wiring up Vercel/Netlify.
  url: 'https://rams-dev-ocean.vercel.app',
  baseUrl: '/',

  organizationName: 'ramsakalle',
  projectName: 'rams-dev-ocean',

  // Fail the build instead of shipping dead internal links.
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/ramsakalle/rams-dev-ocean/tree/main/',
        },
        // Content lives in docs/ only; there is no blog.
        blog: false,
        theme: {
          customCss: './src/css/book-theme.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Ram's Dev Ocean",
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Read',
        },
        {
          href: 'https://github.com/ramsakalle/rams-dev-ocean',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Subjects',
          items: [
            {label: 'Python', to: '/docs/python'},
            {label: 'SQL', to: '/docs/sql'},
            {label: 'GenAI', to: '/docs/genai'},
            {label: 'System Design', to: '/docs/system-design'},
          ],
        },
        {
          title: 'Project',
          items: [
            {label: 'How to read this book', to: '/docs/intro'},
            {label: 'Contributing', to: '/docs/contributing'},
            {
              label: 'GitHub',
              href: 'https://github.com/ramsakalle/rams-dev-ocean',
            },
          ],
        },
      ],
      copyright: `Code MIT · Content CC BY-SA 4.0 · © ${new Date().getFullYear()} Ram's Dev Ocean`,
    },
    prism: {
      // Replaced with a typewriter-toned pair in Phase 2.
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        // No blog to index.
        indexBlog: false,
        docsRouteBasePath: '/docs',
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],
};

export default config;
