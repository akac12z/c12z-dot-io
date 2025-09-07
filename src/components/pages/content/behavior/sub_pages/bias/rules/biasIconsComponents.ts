import AnchorEffect from "@biasPageComponents/icons/AnchorEffect.icon.astro";
import { type BiasIcon } from "./biasIcons.interface";
import BackfireEffect from "@biasPageComponents/icons/BackfireEffect.icon.astro";

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
