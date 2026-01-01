import type { PageKeywords } from "@/interfaces/keywords.interface";

export interface ProjectData {
  href: string;
  srcImage: string;
  altImage: string;
  projectTitle: string;
  projectDescription: string;
  projectKeywords: PageKeywords;
}
