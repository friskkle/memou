"use client";

import { motion } from "framer-motion";

type AnimatedTitleProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export const AnimatedTitle = ({ children, delay = 0, className = '' }: AnimatedTitleProps) => {
  return (
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.h1>
  );
};
