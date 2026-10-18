import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import {
  ArrowRight,
  LayoutGrid,
  Rows3,
  CheckCircle2,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Card3D, Card3DLayer } from '../ui/Card3D';
import { PerspectiveHeading } from '../ui/PerspectiveText';
import { ProjectTimeline } from '../ui/ProjectTimeline';
import { ScrollReveal } from '../ui/ScrollReveal';

export const CaseStudiesSection: React.FC = () => {
  const { content, setActiveView } = useContent();
  const caseStudies = content.caseStudies || [];

  const [layoutMode, setLayoutMode] = useState<'editorial' | 'grid3d'>('editorial');
  const [expandedTimelineId, setExpandedTimelineId] = useState<string | null>(null);

  return (
    <section
      id="cases-section"
      className="py-20 lg:py-24 bg-white dark:bg-[#0B111E] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header + 3D View Switcher */}
        <ScrollReveal
          variant="fade-up"
          duration={700}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6"
        >
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-2">
              <span>Proven Track Record</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-slate-500 dark:text-slate-400 normal-case font-normal">
                Major Transit & Urban Renewals · Interactive 3D Cards
              </span>
            </div>
            
            <PerspectiveHeading
              text="Delivering certainty on multi-billion dollar national infrastructure."
              as="h2"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#15233c] dark:text-white tracking-tight leading-tight mb-4 [text-wrap:balance] font-display"
            />

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              From premier harbor precincts to complex underground heavy rail caverns, Bombheq Partners advises governments and delivery authorities through every stage of procurement, commercial governance, and execution.
            </p>
          </div>

          {/* Layout Mode Toggle */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#111C2E] border border-slate-200/80 dark:border-slate-800 self-start lg:self-end shrink-0">
            <button
              type="button"
              onClick={() => setLayoutMode('editorial')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                layoutMode === 'editorial'
                  ? 'bg-white dark:bg-[#17263E] text-[#245237] dark:text-[#21afc2] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Rows3 className="w-3.5 h-3.5" />
              <span>3D Showcase</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('grid3d')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                layoutMode === 'grid3d'
                  ? 'bg-white dark:bg-[#17263E] text-[#245237] dark:text-[#21afc2] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>3D Deck Grid</span>
            </button>
          </div>
        </ScrollReveal>

        {layoutMode === 'editorial' ? (
          /* Full-Width Individual 3D Tilt Project Cards with Parallax Depth Layers */
          <div className="space-y-16">
            {caseStudies.map((project, index) => {
              const isReversed = index % 2 !== 0;

              return (
                <ScrollReveal
                  key={project.id}
                  variant="blur-up"
                  delay={index * 100}
                  duration={750}
                >
                  <Card3D
                    maxTilt={4.5}
                    scale={1.012}
                    perspective={1400}
                    className="w-full"
                  >
                  <div className="group bg-[#f6f7fc] dark:bg-[#111C2E] p-6 sm:p-10 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#245237]/40 dark:hover:border-[#21afc2]/50 shadow-sm hover:shadow-2xl transition-all duration-300 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                      {/* Image Column with Elevated 3D Parallax Plane */}
                      <div className={`lg:col-span-6 ${isReversed ? 'lg:order-2' : ''}`}>
                        <Card3DLayer depth={26} className="w-full">
                          <div className="relative rounded-xl overflow-hidden aspect-16/10 shadow-lg bg-slate-200 dark:bg-slate-800 border border-white/20 dark:border-slate-700/60">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                            {/* Floating Category Badge */}
                            <div className="absolute top-3.5 left-3.5 bg-[#15233c]/90 dark:bg-[#070d18]/90 text-white backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/15 shadow-md">
                              {project.category}
                            </div>

                            {/* Floating Capital Value Pill on Image Bottom-Right */}
                            <div className="absolute bottom-3.5 right-3.5 bg-[#245237]/95 dark:bg-[#21afc2]/95 text-white dark:text-[#070d18] backdrop-blur-md px-3.5 py-1.5 rounded-lg text-xs font-mono font-extrabold shadow-lg border border-white/20">
                              {project.value} Capital Program
                            </div>
                          </div>
                        </Card3DLayer>
                      </div>

                      {/* Content Column with Stepped 3D Parallax Layers */}
                      <div className={`lg:col-span-6 ${isReversed ? 'lg:order-1' : ''}`}>
                        <Card3DLayer depth={18}>
                          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#245237] dark:text-[#21afc2] tracking-wider uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{project.client}</span>
                          </div>

                          <h3 className="text-2xl sm:text-3xl font-bold text-[#15233c] dark:text-white group-hover:text-[#245237] dark:group-hover:text-[#21afc2] transition-colors mt-1.5 mb-4 leading-snug font-display">
                            {project.title}
                          </h3>

                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                            {project.description}
                          </p>
                        </Card3DLayer>

                        {/* Quantified Rigor Grid elevated at depth 28 */}
                        <Card3DLayer depth={28}>
                          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/90 dark:bg-[#0B111E]/90 border border-slate-200/80 dark:border-slate-800 shadow-xs mb-6">
                            <div>
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Project Value
                              </span>
                              <p className="text-xl font-extrabold text-[#15233c] dark:text-white tabular-nums font-mono mt-0.5">
                                {project.value}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Delivery Phase
                              </span>
                              <p className="text-sm font-semibold text-[#245237] dark:text-[#21afc2] mt-1">
                                {project.completionDate}
                              </p>
                            </div>
                          </div>
                        </Card3DLayer>

                        {/* Key Outcomes & CTA */}
                        <Card3DLayer depth={20}>
                          <div className="space-y-2 mb-6">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                              Key Bombheq Outcomes:
                            </span>
                            {project.keyOutcomes.map((outcome, oIdx) => (
                              <div
                                key={oIdx}
                                className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2] mt-0.5 shrink-0" />
                                <span>{outcome}</span>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => {
                              setActiveView('cases');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#245237] hover:bg-[#1b3f29] dark:bg-[#21afc2] dark:hover:bg-[#1b95a6] text-white dark:text-[#070d18] text-xs font-bold transition-all shadow-sm cursor-pointer"
                          >
                            <span>View Full Case Study & Execution Phases</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </Card3DLayer>
                      </div>
                    </div>

                    {/* Compact Interactive Horizontal Timeline */}
                    <Card3DLayer depth={12}>
                      <ProjectTimeline project={project} compact />
                    </Card3DLayer>
                  </div>
                  </Card3D>
                </ScrollReveal>
              );
            })}
          </div>
        ) : (
          /* 3-Column Interactive 3D Deck Grid Mode (High-Angle 3D Tilt Cards) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((project, index) => {
              const isTimelineOpen = expandedTimelineId === project.id;

              return (
                <ScrollReveal
                  key={project.id}
                  variant="scale-up"
                  delay={index * 110}
                  duration={700}
                  className="h-full"
                >
                  <Card3D
                    maxTilt={9}
                    scale={1.025}
                    perspective={1050}
                    className="w-full h-full"
                  >
                  <div className="group h-full bg-[#f6f7fc] dark:bg-[#111C2E] rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#245237]/50 dark:hover:border-[#21afc2]/60 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-5 sm:p-6">
                    <div>
                      {/* 3D Floating Image Header */}
                      <Card3DLayer depth={28}>
                        <div className="relative rounded-xl overflow-hidden aspect-16/10 bg-slate-200 dark:bg-slate-800 shadow-md mb-5">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                          <div className="absolute top-3 left-3 bg-[#15233c]/90 dark:bg-[#070d18]/90 text-white backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold border border-white/15">
                            {project.category}
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 dark:text-[#21afc2]">
                              {project.client}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md bg-[#245237] dark:bg-[#21afc2] text-white dark:text-[#070d18] font-mono text-xs font-extrabold shadow-sm">
                              {project.value}
                            </span>
                          </div>
                        </div>
                      </Card3DLayer>

                      {/* 3D Floating Title & Summary */}
                      <Card3DLayer depth={20}>
                        <h3 className="text-xl font-bold text-[#15233c] dark:text-white group-hover:text-[#245237] dark:group-hover:text-[#21afc2] transition-colors font-display mb-2">
                          {project.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                          {project.summary || project.description}
                        </p>
                      </Card3DLayer>

                      {/* 3D Floating Key Outcomes */}
                      <Card3DLayer depth={16}>
                        <div className="p-3.5 rounded-xl bg-white/90 dark:bg-[#0B111E]/90 border border-slate-200/70 dark:border-slate-800 space-y-2 mb-5">
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            <span>Key Outcomes</span>
                            <span className="text-[#245237] dark:text-[#21afc2] font-mono">
                              {project.completionDate}
                            </span>
                          </div>
                          {project.keyOutcomes.slice(0, 2).map((outcome, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2] shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{outcome}</span>
                            </div>
                          ))}
                        </div>
                      </Card3DLayer>
                    </div>

                    {/* Card Footer Actions */}
                    <Card3DLayer depth={22}>
                      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedTimelineId(isTimelineOpen ? null : project.id)
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#245237] dark:hover:text-[#21afc2] cursor-pointer"
                        >
                          <span>{isTimelineOpen ? 'Hide Phases' : '5-Stage Timeline'}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform ${
                              isTimelineOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveView('cases');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#245237] dark:bg-[#21afc2] text-white dark:text-[#070d18] text-xs font-bold shadow-xs cursor-pointer"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      {isTimelineOpen && (
                        <div className="mt-4">
                          <ProjectTimeline project={project} compact />
                        </div>
                      )}
                    </Card3DLayer>
                  </div>
                  </Card3D>
                </ScrollReveal>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
