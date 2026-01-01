
export interface SocialLinksInterface  {
  [key: string]: SocialLink;
};

interface SocialLink  {
  name: string;
  url: string;
  userName: string;
  title: string;
};
