"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  step: number;
}

export function ProgressBar({ step }: ProgressBarProps) {
  return (
    <>
      <motion.div
        className="absolute -bottom-0.5 left-0 h-1 bg-orange-500"
        initial={{ width: 0 }}
        animate={{ width: `${((step - 1) / 6) * 100}%` }}
        exit={{ width: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </>
  );
}
