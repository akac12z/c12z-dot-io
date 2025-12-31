import type {
  Site404ConfigInterface,
  SiteDefaultConfigInterface,
  SocialLinksInterface,
} from "@interfaces/siteInfo.interface";

export const SITE_DEFAULT_CONFIG: SiteDefaultConfigInterface = {
  title: "Chema Ferrandez - c12z",
  description:
    "Un 'building(me) in public' donde comparto aquello que voy haciendo, aprendiendo y pensando en mi carrera sobre Growth, Behavioral Dev y Product.",
  url: "https://c12z.io",
  author: "Chema Ferrandez | cz",
  location: "es_ES",
  lang: "es-ES",
};

export const SITE_404_CONFIG: Site404ConfigInterface = {
  errorTitle: "Houston, tenemos un error 404",
  errorDescription:
    "Ha habido un problema con la página que estabas buscando y bueno... aquí estamos.",
  url: "https://c12z.io",
  author: "Chema Ferrandez | cz",
  location: "es_ES",
  lang: "es-ES",
};

export const SOCIAL_LINKS: SocialLinksInterface = {
  github: {
    name: "Github",
    url: "https://github.com/akac12z",
    userName: "akac12z",
  },
  twitter: {
    name: "Twitter/𝕏",
    url: "https://x.com/akac12z",
    userName: "@akac12z",
  },
  linkedin: {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/chemaferran/",
    userName: "ChemaFerrandez",
  },
  substack: {
    name: "Substack",
    url: "https://chemaferrandez.substack.com",
    userName: "@chemaferrandez",
  },
  goodreads: {
    name: "Goodreads",
    url: "goodreads.com/akac12z",
    userName: "akac12z",
  },
};
