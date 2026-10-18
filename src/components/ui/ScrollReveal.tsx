import React, { useEffect, useRef, useState } from 'react';

export type RevealVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale-up'
  | 'blur-up';

export interface UseIntersectionRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Hook that uses native IntersectionObserver to track when an element enters the viewport.
 */
export function useIntersectionReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.12,
  rootMargin = '0px 0px -60px 0px',
  once = true
}: UseIntersectionRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number; // ms
  duration?: number; // ms
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'header';
  id?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.12,
  rootMargin = '0px 0px -50px 0px',
  once = true,
  className = '',
  as: Component = 'div',
  id
}) => {
  const { ref, isVisible } = useIntersectionReveal<HTMLElement>({
    threshold,
    rootMargin,
    once
  });

  const getInitialTransform = (): string => {
    switch (variant) {
      case 'fade-up':
        return 'translate3d(0, 32px, 0)';
      case 'fade-down':
        return 'translate3d(0, -28px, 0)';
      case 'fade-left':
        return 'translate3d(-32px, 0, 0)';
      case 'fade-right':
        return 'translate3d(32px, 0, 0)';
      case 'scale-up':
        return 'translate3d(0, 24px, 0) scale(0.96)';
      case 'blur-up':
        return 'translate3d(0, 28px, 0) scale(0.985)';
      default:
        return 'translate3d(0, 32px, 0)';
    }
  };

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate3d(0, 0, 0) scale(1)' : getInitialTransform(),
    filter:
      variant === 'blur-up'
        ? isVisible
          ? 'blur(0px)'
          : 'blur(6px)'
        : undefined,
    transitionProperty: 'opacity, transform, filter',
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
    transitionDelay: `${delay}ms`,
    willChange: isVisible ? 'auto' : 'opacity, transform'
  };

  return (
    <Component
      ref={ref as React.RefObject<any>}
      id={id}
      style={style}
      className={className}
    >
      {children}
    </Component>
  );
};
