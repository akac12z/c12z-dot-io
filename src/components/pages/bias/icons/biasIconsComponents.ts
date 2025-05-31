import { type BiasIcon } from "./biasIcons.interface";

import AnchorEffect from "./AnchorEffect.icon.astro";
import BackfireEffect from "./BackfireEffect.icon.astro";

export const allBiasIcon: BiasIcon[] = [
  {
    id: "anchor-effect",
    name: "efecto-ancla",
    icon: AnchorEffect,
  },
  {
    id: "backfire-effect",
    name: "efecto-backfire",
    icon: BackfireEffect,
  },
];
