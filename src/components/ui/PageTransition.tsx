import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
  viewKey: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, viewKey }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewKey}
        initial={{
          opacity: 0,
          y: 16,
          scale: 0.985,
          rotateX: 2
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          transition: {
            duration: 0.35,
            ease: [0.16, 1, 0.3, 1]
          }
        }}
        exit={{
          opacity: 0,
          y: -12,
          scale: 0.99,
          rotateX: -1,
          transition: {
            duration: 0.2,
            ease: [0.7, 0, 0.84, 0]
          }
        }}
        className="perspective-1500 w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
