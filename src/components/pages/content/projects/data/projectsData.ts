import type { ProjectData } from "../rules/projectsData.interface";

export const PROJETCS_DATA: Record<string, ProjectData> = {
  LVM_es: {
    href: "la-vida-moderna-es",
    srcImage: "/projects/lavidamodernaes-dot-com.png",
    altImage: "Banner de la página de LaVidaModernaEs.com",
    projectTitle: "#LaVidaModerna es...",
    projectDescription:
      "Un homenaje a las frases y momentos de #Moderdonia, el programa que me marcó con humor y cutrez.",
    projectKeywords: [
      "la vida moderna",
      "la vida moderna es",
      "lvm",
      "moderdonia",
      "programa de radio de la Cadena SER",
      "David Broncano",
      "Ignatius Farray",
      "Queque",
    ],
  },
} as const;
