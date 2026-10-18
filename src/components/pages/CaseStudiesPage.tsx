import React, { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card3D } from '../ui/Card3D';
import { PerspectiveHeading } from '../ui/PerspectiveText';
import { ProjectTimeline } from '../ui/ProjectTimeline';

export const CaseStudiesPage: React.FC = () => {
  const { content, setActiveView, focusedItemId } = useContent();
  const [filter, setFilter] = useState('all');
  const caseStudies = content.caseStudies || [];

  useEffect(() => {
    if (focusedItemId && caseStudies.some(c => c.id === focusedItemId)) {
      setFilter('all');
    }
  }, [focusedItemId, caseStudies]);

  const categories = ['all', ...Array.from(new Set(caseStudies.map(c => c.category)))];

  const filteredProjects = filter === 'all' 
    ? caseStudies 
    : caseStudies.filter(c => c.category === filter);

  return (
    <div className="py-12 lg:py-16 bg-[#f6f7fc] dark:bg-[#070d18] min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-2">
            <span>Portfolio of Evidence</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">/</span>
            <span>Case Studies & Execution Timelines</span>
          </div>

          <PerspectiveHeading
            text="Case Studies in National Infrastructure"
            as="h1"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#15233c] dark:text-white tracking-tight mb-4 [text-wrap:balance] font-display"
          />

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Real outcomes and interactive phase-by-phase execution timelines across Australia’s most challenging transport transitions, underground rail networks, and urban renewal precincts.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-slate-200 dark:border-slate-800">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer transform hover:-translate-y-0.5 ${
                filter === cat
                  ? 'bg-[#245237] dark:bg-[#21afc2] text-white dark:text-[#0b111e] shadow-md'
                  : 'bg-white dark:bg-[#111C2E] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#17263E] border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Projects' : cat}
            </button>
          ))}
        </div>

        {/* Project Grid with 3D Depth & Interactive Horizontal Timeline */}
        <div className="space-y-14">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={`search-target-${project.id}`}
              className={`bg-white dark:bg-[#111C2E] rounded-3xl border overflow-hidden shadow-xl p-6 sm:p-10 transition-all duration-500 space-y-8 ${
                focusedItemId === project.id
                  ? 'border-[#245237] dark:border-[#21afc2] ring-2 ring-[#245237]/20 dark:ring-[#21afc2]/30'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5">
                  <Card3D maxTilt={7} scale={1.02} className="w-full">
                    <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-slate-100 dark:bg-slate-800 shadow-md">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-[#15233c]/90 dark:bg-[#070d18]/90 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium backdrop-blur-md border border-white/10">
                        {project.category}
                      </div>
                    </div>
                  </Card3D>
                </div>

                <div className="lg:col-span-7">
                  <span className="text-xs font-semibold text-[#245237] dark:text-[#21afc2] uppercase tracking-wider">
                    Client: {project.client}
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-bold text-[#15233c] dark:text-white mt-1 mb-3 font-display">
                    {project.title}
                  </h2>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {project.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 dark:border-slate-800 mb-6">
                    <div>
                      <span className="text-xs text-slate-400">Total Program Value</span>
                      <p className="text-2xl font-extrabold text-[#15233c] dark:text-white tabular-nums mt-0.5 font-display">
                        {project.value}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Status & Phase</span>
                      <p className="text-sm font-semibold text-[#245237] dark:text-[#21afc2] mt-1">
                        {project.completionDate}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <span className="text-xs font-bold text-[#15233c] dark:text-white uppercase tracking-wider block mb-2">
                      Key Outcomes & Impact:
                    </span>
                    {project.keyOutcomes.map((outcome, oIdx) => (
                      <div key={oIdx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2] shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#245237] dark:text-[#21afc2] bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/80 rounded-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Inquire About Similar Advisory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Interactive Horizontal Project Milestones & Execution Timeline */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <ProjectTimeline project={project} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
