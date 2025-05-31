export interface BiasIconInterface {
  biasIconClasses: string;
}

export type AstroIconComponent = (props: Record<string, any>) => any;

export interface BiasIcon {
  id: string;
  name: string;
  icon: AstroIconComponent;
}
