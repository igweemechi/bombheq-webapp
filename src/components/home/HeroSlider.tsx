import React, { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card3D } from '../ui/Card3D';

export const HeroSlider: React.FC = () => {
  const { content, setActiveView } = useContent();
  const slides = (content.hero?.slides || []).filter(
    s => s.id !== 'slide-procurement' && s.kicker !== 'Leading Edge Procurement'
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, content.hero?.autoPlayIntervalMs || 6000);
    return () => clearInterval(interval);
  }, [slides.length, isPaused, content.hero?.autoPlayIntervalMs]);

  if (slides.length === 0) return null;
  const safeIndex = currentIndex % slides.length;
  const currentSlide = slides[safeIndex];

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section 
      className="relative w-full min-h-[620px] lg:min-h-[720px] flex items-center bg-[#070d18] overflow-hidden perspective-1500"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero Showcase"
    >
      {/* 3D Background Photography with Dynamic Parallax & Scrim */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <img
            src={currentSlide.bgImage}
            alt={currentSlide.title}
            className="w-full h-full object-cover object-center transform scale-102"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {/* Multi-layered cinematic scrim with deep obsidian gradation */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070d18]/95 via-[#0B111E]/80 to-[#070d18]/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070d18] via-transparent to-black/40" />
          
          {/* Subtle 3D ambient radial glow */}
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#21afc2]/15 dark:bg-[#21afc2]/20 rounded-full blur-3xl pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content Container with 3D Depth */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Headline & Narrative Column */}
          <div className="lg:col-span-8 max-w-3xl">
            
            {/* Kicker - Unboxed Clean Metadata with Metallic Accent */}
            <motion.div 
              key={`kicker-${currentIndex}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 mb-4 text-[#21afc2] text-xs font-semibold uppercase tracking-wider"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#21afc2]" />
                {currentSlide.kicker}
              </span>
            </motion.div>

            {/* Headline with 3D Extrusion Shadow & Balanced Wrapping */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentIndex}`}
                initial={{ opacity: 0, y: 20, rotateX: 12 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -16, rotateX: -6 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6 [text-wrap:balance] text-depth-hero font-display preserve-3d"
              >
                {currentSlide.title}
              </motion.h1>
            </AnimatePresence>

            {/* Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${currentIndex}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="text-base sm:text-lg text-slate-200/90 dark:text-slate-300 leading-relaxed mb-8 max-w-2xl font-normal"
              >
                {currentSlide.subtitle}
              </motion.p>
            </AnimatePresence>

            {/* Action CTAs with 3D Interactive Hover */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveView(currentSlide.ctaLink || 'services')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#245237] hover:bg-[#1e462f] dark:bg-[#21afc2] dark:hover:bg-[#1994a5] dark:text-[#070d18] rounded-xl transition-all shadow-[0_10px_25px_-5px_rgba(36,82,55,0.4)] dark:shadow-[0_10px_25px_-5px_rgba(33,175,194,0.35)] transform hover:-translate-y-1 hover:scale-102 active:translate-y-0 cursor-pointer"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {currentSlide.secondaryCtaText && (
                <button
                  onClick={() => setActiveView(currentSlide.secondaryCtaLink || 'cases')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 dark:border-slate-700 rounded-xl transition-all transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-md"
                >
                  <span>{currentSlide.secondaryCtaText}</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive 3D Depth Card Column (Desktop) */}
          <div className="hidden lg:block lg:col-span-4">
            <Card3D maxTilt={10} scale={1.03} className="w-full">
              <div className="p-6 rounded-2xl bg-[#0B111E]/80 backdrop-blur-xl border border-white/15 dark:border-slate-700/80 shadow-2xl text-white space-y-5">
                
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Ricardo Backed</span>
                      <span className="text-[10px] text-slate-400">Consulting Engineers</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#21afc2] bg-[#21afc2]/10 px-2.5 py-1 rounded-full border border-[#21afc2]/20">
                    2024 Portfolio
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-medium">Advisory Pipeline Value</span>
                  <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight mt-0.5 flex items-baseline gap-2">
                    <span>~$750M+</span>
                    <span className="text-xs text-emerald-400 font-semibold">+24% YoY</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                    Advising government bodies, state rail authorities, and Tier-1 sponsors on Australia's priority infrastructure transitions.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Flagship Programs:</span>
                  <span className="text-[#21afc2] font-semibold">NSW Fast Rail · Cross River</span>
                </div>

              </div>
            </Card3D>
          </div>

        </div>
      </div>

      {/* Slider Navigation Controls & Indicators */}
      <div className="absolute z-20 bottom-8 right-4 sm:right-8 lg:right-12 flex items-center gap-3">
        <div className="flex items-center gap-1.5 mr-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all rounded-full cursor-pointer ${
                idx === currentIndex 
                  ? 'w-8 bg-[#21afc2] shadow-[0_0_10px_rgba(33,175,194,0.8)]' 
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handlePrev}
          className="p-2.5 rounded-xl bg-black/40 hover:bg-black/70 text-white border border-white/15 transition-all transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="p-2.5 rounded-xl bg-black/40 hover:bg-black/70 text-white border border-white/15 transition-all transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
