import React from 'react';
import { useContent } from '../../context/ContentContext';
import { TeamSection } from '../home/TeamSection';
import { CareersSection } from '../home/CareersSection';
import { ShieldCheck, Award, Globe2 } from 'lucide-react';
import { Card3D } from '../ui/Card3D';
import { PerspectiveHeading } from '../ui/PerspectiveText';

export const TeamPage: React.FC = () => {
  const { content } = useContent();

  return (
    <div className="py-12 lg:py-16 bg-[#f6f7fc] dark:bg-[#070d18] min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-14 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-2">
            <span>About Us</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">/</span>
            <span>Our People</span>
          </div>

          <PerspectiveHeading
            text="Our People & Leadership"
            as="h1"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#15233c] dark:text-white tracking-tight mb-4 [text-wrap:balance] font-display"
          />

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Our people are the best in the business, with real hands-on experience and a genuine passion for infrastructure. At Bombheq Partners, we work as a cohesive team to solve complex problems, provide wisdom and insight, realise success for our clients, and have fun in the process.
          </p>
        </div>

        {/* Culture & Affiliation Cards with 3D Depth */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card3D maxTilt={6} scale={1.02} className="w-full">
            <div className="h-full p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:border-[#21afc2]/50 transition-all duration-300">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2] w-fit mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#15233c] dark:text-white mb-1 font-display">
                Engineering Excellence
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Our local Australian teams leverage multi-disciplinary engineering and commercial specialists to deliver complex infrastructure mandates.
              </p>
            </div>
          </Card3D>

          <Card3D maxTilt={6} scale={1.02} className="w-full">
            <div className="h-full p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:border-[#21afc2]/50 transition-all duration-300">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2] w-fit mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#15233c] dark:text-white mb-1 font-display">
                Senior-Led Advisory
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Our partners and directors are actively embedded on the project coalface, providing direct counsel rather than delegating to junior tiers.
              </p>
            </div>
          </Card3D>

          <Card3D maxTilt={6} scale={1.02} className="w-full">
            <div className="h-full p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:border-[#21afc2]/50 transition-all duration-300">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2] w-fit mb-3">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#15233c] dark:text-white mb-1 font-display">
                Diverse Perspectives
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Our team members bring diverse engineering, commercial, legal, and operational backgrounds to examine problems from every angle.
              </p>
            </div>
          </Card3D>
        </div>

        {/* Team Section */}
        <TeamSection />

        {/* Careers Section */}
        <div className="mt-16">
          <CareersSection />
        </div>

      </div>
    </div>
  );
};
