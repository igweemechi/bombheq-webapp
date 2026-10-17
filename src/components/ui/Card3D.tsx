import React, { useRef, useState, useEffect } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.02,
  glare = true,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0, x: 50, y: 50 });
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

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({ opacity: 0.15, x: glareX, y: glareY });
    }
  };

  const handleMouseEnter = () => {
    if (isReducedMotion) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative preserve-3d will-change-transform ${className}`}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {children}

      {/* Subtle dynamic specular glare on tilt */}
      {glare && !isReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300"
          style={{ opacity: glareStyle.opacity }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
            style={{
              transform: `translate(${glareStyle.x - 50}%, ${glareStyle.y - 50}%)`,
              filter: 'blur(10px)'
            }}
          />
        </div>
      )}
    </div>
  );
};
