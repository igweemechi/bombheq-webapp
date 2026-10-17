import React from 'react';
import { useContent } from '../../context/ContentContext';
import { CheckCircle2, ArrowRight, ShieldCheck, Building2, TrendingUp } from 'lucide-react';
import { Card3D } from '../ui/Card3D';
import { PerspectiveHeading } from '../ui/PerspectiveText';
import { motion } from 'motion/react';

export const OverviewSection: React.FC = () => {
  const { content, setActiveView } = useContent();
  const { valueProposition } = content;

  return (
    <section className="py-20 lg:py-24 bg-white dark:bg-[#0B111E] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2-Column Split: Interactive 3D Visual & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Column 1: Image Anchor with 3D Tilt & Floating Depth Badge */}
          <div className="lg:col-span-5 relative perspective-1000">
            <Card3D maxTilt={7} scale={1.02} className="w-full">
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xl dark:shadow-2xl border border-slate-200/80 dark:border-slate-700/80 aspect-4/3 lg:aspect-auto lg:h-[500px]">
                <img
                  src={valueProposition.image}
                  alt="Bombheq Partners Infrastructure Advisory"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                
                {/* 3D Depth Layer 1: Ricardo trust affiliation floating card */}
                <div className="absolute top-5 left-5 bg-white/95 dark:bg-[#0B111E]/95 backdrop-blur-md p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg max-w-[230px] transform translate-z-12">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#245237] dark:text-[#21afc2]">
                    <ShieldCheck className="w-4 h-4 text-[#245237] dark:text-[#21afc2]" />
                    <span>A Ricardo Company</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    Backed by global engineering intelligence and deep technical capabilities.
                  </p>
                </div>

                {/* 3D Depth Layer 2: Bottom location tag */}
                <div className="absolute bottom-5 right-5 bg-[#15233c]/90 dark:bg-black/85 text-white backdrop-blur-md px-3.5 py-2 rounded-lg text-xs font-medium border border-white/10 dark:border-slate-700 transform translate-z-6">
                  102 Anderson Drive Greenbank
                </div>
              </div>
            </Card3D>
          </div>

          {/* Column 2: Narrative with Perspective Typography */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-3">
              <span>{valueProposition.badge}</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-slate-500 dark:text-slate-400 normal-case font-normal">Advisory Philosophy</span>
            </div>

            <PerspectiveHeading
              text={valueProposition.title}
              as="h2"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#15233c] dark:text-white tracking-tight leading-tight mb-6 [text-wrap:balance] font-display text-depth-heading"
            />

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {valueProposition.description}
            </p>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              {valueProposition.secondaryDescription}
            </p>

            {/* Core Capability Checklist with Micro-interactions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                'Strategic policy and investment prioritization',
                'Digital procurement and alliance models',
                'Forensic delay and dispute resolution',
                'Commercial risk allocation and governance'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 group">
                  <CheckCircle2 className="w-5 h-5 text-[#245237] dark:text-[#21afc2] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveView('services')}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:hover:bg-[#1994a5] dark:text-[#0b111e] rounded-xl transition-all transform hover:-translate-y-0.5 shadow-xs hover:shadow-md cursor-pointer"
              >
                <span>Explore Advisory Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveView('team')}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#245237] dark:hover:text-[#21afc2] transition-colors py-2.5 px-3"
              >
                Meet Our Advisors →
              </button>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column 3D Metric Strip */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {valueProposition.metrics.map((metric, mIdx) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: mIdx * 0.08 }}
                className="p-5 rounded-xl bg-slate-50 dark:bg-[#111C2E] border border-slate-200/80 dark:border-slate-800/80 hover:border-[#21afc2]/50 transition-all transform hover:-translate-y-1 shadow-2xs hover:shadow-md flex flex-col"
              >
                <span className="text-3xl sm:text-4xl font-extrabold text-[#15233c] dark:text-white tracking-tight tabular-nums font-display">
                  {metric.value}
                </span>
                <span className="text-sm font-semibold text-[#245237] dark:text-[#21afc2] mt-1">
                  {metric.label}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {metric.subtext}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
