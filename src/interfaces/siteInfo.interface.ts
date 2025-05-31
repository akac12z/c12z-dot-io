/**
 * Social Links Interfaces
*/
export interface SocialLinksInterface  {
  [key: string]: SocialLink;
};

interface SocialLink  {
  name: string;
  url: string;
  userName: string;
};

/**
 * Sites interfaces
*/
export interface SiteDefaultConfigInterface {
  title: string;
  description: string;
  url: string;
  author: string;
  location: string;
  lang:string
};
export interface Site404ConfigInterface {
  errorTitle: string;
  errorDescription: string;
  url: string;
  author: string;
  location: string;
  lang: string
};