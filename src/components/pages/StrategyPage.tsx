import React from 'react';
import { useContent } from '../../context/ContentContext';
import { Compass, CheckCircle2, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';
import { TeamSection } from '../home/TeamSection';
import { Card3D } from '../ui/Card3D';
import { PerspectiveHeading } from '../ui/PerspectiveText';

export const StrategyPage: React.FC = () => {
  const { content, setActiveView } = useContent();
  const strategyService = content.services.find(s => s.id === 'strategy') || content.services[0];

  return (
    <div className="py-12 lg:py-16 bg-[#f6f7fc] dark:bg-[#070d18] min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-3">
          <span>Services</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">/</span>
          <span>Strategy & Policy Advice</span>
        </div>

        {/* Hero Section of Strategy with 3D Depth */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2] border border-emerald-100 dark:border-emerald-800/80 text-xs font-semibold mb-4">
              <Compass className="w-3.5 h-3.5" />
              <span>Strategy, Portfolio & Policy Advice</span>
            </div>

            <PerspectiveHeading
              text="We assist in developing effective policy responses and strategic clarity."
              as="h1"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#15233c] dark:text-white tracking-tight leading-tight mb-6 [text-wrap:balance] font-display"
            />

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              At Bombheq Partners we help create clarity where there is uncertainty. We help our clients simplify complex problems and determine pathways to address difficult infrastructure and policy questions.
            </p>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              We do this by assisting governments and large corporate clients to develop effective policy and strategy responses to emerging issues. We help clients chart direction on complex infrastructure planning, investment and project integration matters. We also help clients optimise investment portfolios and improve their governance and investment decision making to deliver the best service delivery outcomes.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setActiveView('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold text-white bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:hover:bg-[#1994a5] dark:text-[#0b111e] rounded-xl transition-all transform hover:-translate-y-0.5 shadow-xs hover:shadow-md cursor-pointer"
              >
                <span>Request Strategic Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setActiveView('cases');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#245237] dark:hover:text-[#21afc2] px-4 py-3"
              >
                View Relevant Case Studies →
              </button>
            </div>

          </div>

          <div className="lg:col-span-5">
            <Card3D maxTilt={7} scale={1.02} className="w-full">
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 shadow-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img
                  src={strategyService?.image || 'https://res.cloudinary.com/detfwst5p/image/upload/v1766658241/bombheq%20webpage/img/Strategy-1_z9eed3.jpg'}
                  alt="Strategy and Policy Advice"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-[#15233c]/90 dark:bg-[#0B111E]/95 text-white backdrop-blur-md p-4 rounded-xl text-center border border-white/10 dark:border-slate-700 shadow-xl transform translate-z-12">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#21afc2] block">
                    Year 2024 Project Value
                  </span>
                  <span className="text-2xl font-extrabold tabular-nums block mt-0.5 font-display">
                    ~$750m
                  </span>
                </div>
              </div>
            </Card3D>
          </div>
        </div>

        {/* Positive Outcomes Grid with 3D Hover Lift */}
        <div className="bg-white dark:bg-[#111C2E] p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl mb-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] block mb-2">
              Positive Outcomes
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#15233c] dark:text-white leading-snug font-display">
              Evidence-based, collaboratively developed, and strategically aligned.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              We measure the success of a strategy by its clarity and ability to provide direction under uncertainty. At Bombheq Partners, we provide strategy and policy advice that helps our clients:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Adapt to a Changing World', desc: 'Anticipate demographic shifts, energy transition mandates, and disruptive technology.' },
              { title: 'Deal with Complex Problems', desc: 'Deconstruct cross-jurisdictional gridlock and align diverging stakeholder groups.' },
              { title: 'Workable & Pragmatic Strategies', desc: 'Craft actionable frameworks backed by realistic commercial funding models.' },
              { title: 'Deliver Public Value', desc: 'Ensure infrastructure investments maximize tangible community and economic benefits.' },
              { title: 'Deliver Better Services', desc: 'Elevate passenger journeys, freight velocity, and regional service reliability.' },
              { title: 'Develop Strong Governance', desc: 'Establish robust decision gates, peer review bodies, and accountability metrics.' },
              { title: 'Strategic Investment Decisions', desc: 'Prioritize capital allocations based on rigorous multi-criteria analysis.' },
              { title: 'Optimize Scarce Resources', desc: 'Extract maximum efficiency from existing asset portfolios and budgets.' }
            ].map((outcome, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-[#f6f7fc] dark:bg-[#070d18] border border-slate-200/60 dark:border-slate-800 hover:border-[#21afc2]/50 transition-all transform hover:-translate-y-1 shadow-2xs hover:shadow-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#245237] dark:text-[#21afc2]" />
                  <h3 className="text-sm font-bold text-[#15233c] dark:text-white font-display">
                    {outcome.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {outcome.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members Section */}
        <TeamSection />

      </div>
    </div>
  );
};
