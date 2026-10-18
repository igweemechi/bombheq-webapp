import React, { useRef, useState, useEffect, createContext, useContext } from 'react';

interface Card3DContextValue {
  isHovered: boolean;
  mouseXRatio: number;
  mouseYRatio: number;
}

const Card3DContext = createContext<Card3DContextValue>({
  isHovered: false,
  mouseXRatio: 0,
  mouseYRatio: 0
});

export interface Card3DLayerProps {
  children: React.ReactNode;
  depth?: number;
  className?: string;
}

export const Card3DLayer: React.FC<Card3DLayerProps> = ({
  children,
  depth = 24,
  className = ''
}) => {
  const { isHovered } = useContext(Card3DContext);

  return (
    <div
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{
        transform: isHovered ? `translate3d(0px, 0px, ${depth}px)` : 'translate3d(0px, 0px, 0px)',
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </div>
  );
};

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
  perspective?: number;
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.02,
  glare = true,
  perspective = 1100,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState(
    `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
  );
  const [glareState, setGlareState] = useState({
    opacity: 0,
    x: 50,
    y: 50,
    pxX: 0,
    pxY: 0
  });
  const [mouseRatio, setMouseRatio] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(media.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isReducedMotion) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const ratioX = (x - centerX) / centerX;
    const ratioY = (y - centerY) / centerY;

    const rotateX = ratioY * -maxTilt;
    const rotateY = ratioX * maxTilt;

    setMouseRatio({ x: ratioX, y: ratioY });
    setTransformStyle(
      `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareState({
        opacity: 1,
        x: glareX,
        y: glareY,
        pxX: x,
        pxY: y
      });
    }
  };

  const handleMouseEnter = () => {
    if (isReducedMotion) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseRatio({ x: 0, y: 0 });
    setTransformStyle(
      `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    );
    setGlareState(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <Card3DContext.Provider
      value={{
        isHovered,
        mouseXRatio: mouseRatio.x,
        mouseYRatio: mouseRatio.y
      }}
    >
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative will-change-transform ${className}`}
        style={{
          transform: transformStyle,
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)'
            : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {children}

        {/* Dynamic cursor-tracked 3D specular spotlight & rim sheen */}
        {glare && !isReducedMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden transition-opacity duration-300 z-20"
            style={{ opacity: glareState.opacity }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(560px circle at ${glareState.pxX}px ${glareState.pxY}px, rgba(255, 255, 255, 0.14), rgba(33, 175, 194, 0.06) 40%, transparent 75%)`
              }}
            />
          </div>
        )}
      </div>
    </Card3DContext.Provider>
  );
};
