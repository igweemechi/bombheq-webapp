import React from 'react';
import { useContent } from '../../context/ContentContext';
import { ArrowRight, MapPin } from 'lucide-react';
import { Card3D } from '../ui/Card3D';
import { PerspectiveHeading } from '../ui/PerspectiveText';
import { ScrollReveal } from '../ui/ScrollReveal';

export const CareersSection: React.FC = () => {
  const { content, setActiveView } = useContent();
  const { careers } = content;

  return (
    <section
      id="careers-section"
      className="py-20 lg:py-24 bg-white dark:bg-[#0B111E] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Image & Ricardo Affiliation with 3D Tilt */}
          <ScrollReveal
            variant="fade-right"
            delay={60}
            duration={750}
            className="lg:col-span-5 relative perspective-1000"
          >
            <Card3D maxTilt={7} scale={1.02} className="w-full">
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 lg:aspect-auto lg:h-[500px] shadow-xl dark:shadow-2xl border border-slate-200/80 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <img
                  src={careers.image}
                  alt="Join Bombheq Partners"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white transform translate-z-12">
                  <span className="text-xs uppercase font-semibold tracking-wider text-[#21afc2] block mb-1">
                    Culture & Growth
                  </span>
                  <p className="text-xl font-bold leading-snug font-display">
                    Join a diverse, high-performing advisory collective shaping tomorrow's cities.
                  </p>
                </div>
              </div>
            </Card3D>
          </ScrollReveal>

          {/* Careers Narrative & Open Positions */}
          <ScrollReveal
            variant="fade-left"
            delay={160}
            duration={750}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-3">
              <span>{careers.kicker}</span>
            </div>

            <PerspectiveHeading
              text={careers.title}
              as="h2"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#15233c] dark:text-white tracking-tight leading-tight mb-6 [text-wrap:balance] font-display"
            />

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              {careers.description}
            </p>

            {/* Open Positions List with 3D Hover Lift */}
            <div className="mb-8 space-y-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Featured Opportunities:
              </span>
              
              <div className="space-y-2.5">
                {careers.openPositions.map(pos => (
                  <div
                    key={pos.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#f6f7fc] dark:bg-[#111C2E] hover:bg-emerald-50/50 dark:hover:bg-[#17263E] hover:border-emerald-300 dark:hover:border-[#21afc2]/50 transition-all transform hover:-translate-y-0.5 shadow-2xs"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-[#15233c] dark:text-white font-display">
                        {pos.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span>{pos.department}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#245237] dark:text-[#21afc2]" />
                          {pos.location}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums font-mono text-[11px]">{pos.type}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveView('contact');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="mt-2 sm:mt-0 text-xs font-semibold text-[#245237] dark:text-[#21afc2] hover:underline self-start sm:self-auto cursor-pointer"
                    >
                      Apply Now →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button
                onClick={() => {
                  setActiveView('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:hover:bg-[#1994a5] dark:text-[#0b111e] rounded-xl transition-all transform hover:-translate-y-0.5 shadow-xs hover:shadow-md cursor-pointer"
              >
                <span>{careers.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </ScrollReveal>
        </div>

      </div>
    </section>
  );
};
