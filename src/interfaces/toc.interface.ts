import type { MotionValue } from "motion/react";

interface Headings {
  slug: string;
  text: string;
}

export interface DynamicTocProps {
  title: string;
  headings: Headings[];
}

export interface ProgressCircleProps {
  progress: MotionValue<number>;
  strokeWidth?: number;
  className?: string;
}
