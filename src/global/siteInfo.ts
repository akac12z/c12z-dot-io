import type {
  Site404ConfigInterface,
  SiteDefaultConfigInterface,
  SocialLinksInterface,
} from "@interfaces/siteInfo.interface";

export const SITE_DEFAULT_CONFIG: SiteDefaultConfigInterface = {
  title: "c12z",
  description:
    "Un 'build(me) in public' donde compartiré aquello que voy haciendo, aprendiendo y pensando en mi carrera como Growth en Startups",
  url: "https://c12z.io",
  author: "Chema | c12z",
  location: "es_ES",
  lang: "es-ES",
};

export const SITE_404_CONFIG: Site404ConfigInterface = {
  errorTitle: "Hiuston, hemos tenido un problema 404 en c12z",
  errorDescription:
    "Ha habido un problema con la página que estabas buscando y bueno... aquí estamos.",
  url: "https://c12z.io",
  author: "Chema | c12z",
  location: "es_ES",
  lang: "es-ES",
};

export const SOCIAL_LINKS: SocialLinksInterface = {
  github: {
    name: "Github",
    url: "https://github.com/akac12zk",
    userName: "akac12zk",
  },
  twitter: {
    name: "Twitter/𝕏",
    url: "https://x.com/akac12zk",
    userName: "@akac12zk",
  },
  linkedin: {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/chemaferran/",
    userName: "ChemaFerrandez",
  },
  substack: {
    name: "Substack",
    url: "https://mrjark.substack.com",
    userName: "@mrjark",
  },
  goodreads: {
    name: "Goodreads",
    url: "goodreads.com/akac12zk",
    userName: "akac12zk",
  },
};
