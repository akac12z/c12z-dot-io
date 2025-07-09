import type { ProjectData } from "@interfaces/projectsData.interface";

export const PROJETCS_DATA: Record<string, ProjectData> = {
  LVM_es: {
    href: "/proyectos/la-vida-moderna-es",
    srcImage: "/projects/lavidamodernaes-dot-com.png",
    altImage: "Banner de la página de LaVidaModernaEs.com",
    projectTitle: "#LaVidaModerna es...",
    projectDescription:
      "Un homenaje a las frases y momentos de #Moderdonia, el programa que me marcó con humor y cutrez.",
  },
} as const;
