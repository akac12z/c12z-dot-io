/**
 * This component was inspired by bepyan.me/en and its documentation.
 */

import type { ProgressCircleProps } from "@interfaces/toc.interface";
import { motion } from "motion/react";

export default function ProgressCircle({
  progress,
  strokeWidth = 4,
  className,
}: ProgressCircleProps) {
  return (
    <span className={`relative rounded-full text-cz-primary ${className}`}>
      <svg
        className=""
        width="20"
        height="20"
        viewBox="0 0 20 20"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx="10"
          cy="10"
          r="8"
          strokeWidth={strokeWidth}
          stroke="text-gray-300"
          fill="none"
          strokeLinecap="round"
        />
        <motion.circle
          cx="10"
          cy="10"
          r="8"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="none"
          strokeDasharray="50"
          strokeLinecap="round"
          style={{
            pathLength: progress,
          }}
        />
      </svg>
    </span>
  );
}
