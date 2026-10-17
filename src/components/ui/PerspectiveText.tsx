import React from 'react';
import { motion } from 'motion/react';

interface PerspectiveHeadingProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span';
  staggerDelay?: number;
}

export const PerspectiveHeading: React.FC<PerspectiveHeadingProps> = ({
  text,
  className = '',
  as = 'h2',
  staggerDelay = 0.04
}) => {
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 18,
      rotateX: 35,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        damping: 18,
        stiffness: 120
      }
    }
  };

  const Component = motion[as] as typeof motion.h1;

  return (
    <Component
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={`perspective-1000 ${className}`}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex flex-wrap gap-x-[0.28em] gap-y-0.5">
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={wordVariants}
            className="inline-block preserve-3d origin-bottom will-change-transform"
          >
            {word}
          </motion.span>
        ))}
      </span>
    </Component>
  );
};
