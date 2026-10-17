import React from 'react';
import { useContent } from '../../context/ContentContext';
import { Building2, DollarSign, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { Card3D } from '../ui/Card3D';
import { PerspectiveHeading } from '../ui/PerspectiveText';

export const CaseStudiesSection: React.FC = () => {
  const { content, setActiveView } = useContent();
  const caseStudies = content.caseStudies || [];

  return (
    <section className="py-20 lg:py-24 bg-white dark:bg-[#0B111E] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-2">
            <span>Proven Track Record</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400 normal-case font-normal">Major Transit & Urban Renewals</span>
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

        {/* Case Study Cards - Stacked alternating layout with 3D Depth */}
        <div className="space-y-16">
          {caseStudies.map((project, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <div
                key={project.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#f6f7fc] dark:bg-[#111C2E] p-6 sm:p-10 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-lg dark:hover:border-slate-700 transition-all duration-300"
              >
                {/* Image Column with Card3D */}
                <div className={`lg:col-span-6 ${isReversed ? 'lg:order-2' : ''}`}>
                  <Card3D maxTilt={6} scale={1.02} className="w-full">
                    <div className="relative rounded-xl overflow-hidden aspect-16/10 shadow-md bg-slate-200 dark:bg-slate-800">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-[#15233c]/90 dark:bg-[#070d18]/90 text-white backdrop-blur-md px-3 py-1 rounded-md text-xs font-medium border border-white/10">
                        {project.category}
                      </div>
                    </div>
                  </Card3D>
                </div>

                {/* Content Column */}
                <div className={`lg:col-span-6 ${isReversed ? 'lg:order-1' : ''}`}>
                  <span className="text-xs font-semibold text-[#245237] dark:text-[#21afc2] tracking-wider uppercase">
                    {project.client}
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-bold text-[#15233c] dark:text-white mt-1 mb-4 leading-snug font-display">
                    {project.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Quantified Rigor Grid */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200 dark:border-slate-800 mb-6">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Project Value</span>
                      <p className="text-xl font-bold text-[#15233c] dark:text-white tabular-nums mt-0.5">
                        {project.value}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Delivery Phase</span>
                      <p className="text-sm font-semibold text-[#245237] dark:text-[#21afc2] mt-1">
                        {project.completionDate}
                      </p>
                    </div>
                  </div>

                  {/* Key Outcomes */}
                  <div className="space-y-2 mb-6">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                      Key Bombheq Outcomes:
                    </span>
                    {project.keyOutcomes.map((outcome, oIdx) => (
                      <div key={oIdx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#245237] dark:bg-[#21afc2] mt-1.5 shrink-0" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('cases');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#245237] dark:text-[#21afc2] hover:underline transition-colors cursor-pointer"
                  >
                    <span>View Case Study Overview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
