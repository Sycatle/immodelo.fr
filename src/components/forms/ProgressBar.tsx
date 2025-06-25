"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  step: number;
}

export function ProgressBar({ step }: ProgressBarProps) {
  return (
    <motion.div
      className="absolute top-0 left-0 h-1 bg-orange-500"
      initial={{ width: 0 }}
      animate={{ width: `${((step - 1) / 3) * 100}%` }}
      exit={{ width: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    />
  );
}
