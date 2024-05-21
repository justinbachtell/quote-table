import type { FooterItem } from "@/types";

export type SiteConfig = typeof siteConfig;

const links = {
  x: "https://twitter.com/justinjbachtell",
  github: "https://github.com/justinbachtell/quote-library",
  githubAccount: "https://github.com/justinbachtell",
  site: "https://justinbachtell.com",
};

export const siteConfig = {
  name: "Quote Library",
  description: "A collection of quotes, books, authors, publishers, and more.",
  url: "https://quote-library.justinbachtell.com",
  ogImage: "https://quote-library.justinbachtell.com/opengraph-image.png",
  links,
  /* mainNav: [
    {
      title: "Main Categories",
      items: [
        {
          title: "Quotes",
          // href: "/categories/quotes",
          description: "View all quotes and their authors.",
          items: [],
        },
        {
          title: "Authors",
          // href: "/categories/authors",
          description: "View all authors and their quotes.",
          items: [],
        },
        {
          title: "Books",
          // href: "/categories/books",
          description: "View all books and their quotes.",
          items: [],
        },
      ],
    },
    {
      title: "Alternative Categories",
      items: [
        {
          title: "Genres",
          // href: "/categories/genres",
          description: "View all genres and their quotes.",
          items: [],
        },
        {
          title: "Topics",
          // href: "/categories/topics",
          description: "View all topics and their quotes.",
          items: [],
        },
        {
          title: "Tags",
          // href: "/categories/tags",
          description: "View all tags and their quotes.",
          items: [],
        },
        {
          title: "Types",
          // href: "/categories/types",
          description: "View all types and their quotes.",
          items: [],
        },
        {
          title: "Publishers",
          // href: "/categories/publishers",
          description: "View all publishers and their quotes.",
          items: [],
        },
      ],
    },
    {
      title: "Locations",
      items: [
        {
          title: "Cities",
          // href: "/categories/cities",
          description: "View all cities and their quotes.",
          items: [],
        },
        {
          title: "States",
          // href: "/categories/states",
          description: "View all states and their quotes.",
          items: [],
        },
        {
          title: "Countries",
          // href: "/categories/countries",
          description: "View all countries and their quotes.",
          items: [],
        },
      ],
    },
  ] satisfies MainNavItem[], */
  footerNav: [
    {
      title: "Connect",
      items: [
        {
          title: "About Me",
          href: "https://justinbachtell.com/about",
          external: true,
        },
        {
          title: "Contact",
          href: "https://justinbachtell.com/",
          external: true,
        },
      ],
    },
    {
      title: "Legal",
      items: [
        {
          title: "Terms",
          href: "https://justinbachtell.com/terms",
          external: true,
        },
        {
          title: "Privacy",
          href: "https://justinbachtell.com/privacy",
          external: true,
        },
      ],
    },
    {
      title: "Social",
      items: [
        {
          title: "X",
          href: links.x,
          external: true,
        },
        {
          title: "GitHub",
          href: links.githubAccount,
          external: true,
        },
        {
          title: "JustinBachtell.com",
          href: links.site,
          external: true,
        },
      ],
    },
  ] satisfies FooterItem[],
};
