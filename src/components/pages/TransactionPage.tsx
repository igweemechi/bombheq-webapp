import React from 'react';
import { useContent } from '../../context/ContentContext';
import { Layers, CheckCircle2, ArrowRight, Database, Network } from 'lucide-react';
import { TeamSection } from '../home/TeamSection';
import { Card3D } from '../ui/Card3D';
import { PerspectiveHeading } from '../ui/PerspectiveText';

export const TransactionPage: React.FC = () => {
  const { content, setActiveView } = useContent();
  const transactionService = content.services.find(s => s.id === 'transaction') || content.services[1];

  return (
    <div className="py-12 lg:py-16 bg-[#f6f7fc] dark:bg-[#070d18] min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-3">
          <span>Services</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">/</span>
          <span>Procurement & Transaction Management</span>
        </div>

        {/* Hero Section of Transaction with 3D Depth */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2] border border-emerald-100 dark:border-emerald-800/80 text-xs font-semibold mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>Next Generation Procurement</span>
            </div>

            <PerspectiveHeading
              text="Leading edge of procurement and collaborative contracting."
              as="h1"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#15233c] dark:text-white tracking-tight leading-tight mb-6 [text-wrap:balance] font-display"
            />

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Infrastructure projects are continuing to grow in both size and complexity. Costs are increasing, timeframes tightening, and contractors and supply chains are consolidating and globalising. Procurement needs to evolve in order to position the project and its stakeholders for success.
            </p>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              At Bombheq Partners, our people are at the leading edge of procurement; from introducing alliances into public infrastructure to using artificial intelligence to aid the development of project documentation. We have developed relationships across the globe and across industries to identify new technologies, processes, and techniques.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setActiveView('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold text-white bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:hover:bg-[#1994a5] dark:text-[#0b111e] rounded-xl transition-all transform hover:-translate-y-0.5 shadow-xs hover:shadow-md cursor-pointer"
              >
                <span>Engage Transaction Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setActiveView('cases');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#245237] dark:hover:text-[#21afc2] px-4 py-3"
              >
                Review Mega-Project Deals →
              </button>
            </div>

          </div>

          <div className="lg:col-span-5">
            <Card3D maxTilt={7} scale={1.02} className="w-full">
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 shadow-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img
                  src={transactionService?.image || 'https://res.cloudinary.com/detfwst5p/image/upload/v1766658242/bombheq%20webpage/img/transcation-1_rhvods.jpg'}
                  alt="Procurement and Transaction Management"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-[#15233c]/90 dark:bg-[#0B111E]/95 text-white backdrop-blur-md p-4 rounded-xl text-center border border-white/10 dark:border-slate-700 shadow-xl transform translate-z-12">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#21afc2] block">
                    Procurement Innovation
                  </span>
                  <span className="text-xl font-extrabold tabular-nums block mt-0.5 font-display">
                    AI & Alliance
                  </span>
                </div>
              </div>
            </Card3D>
          </div>
        </div>

        {/* Section 2: Data Rich Digital Environments & Institutional Knowledge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-[#111C2E] p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="p-3 w-fit rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2] border border-emerald-100 dark:border-emerald-800/80 mb-4">
                <Database className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] block mb-1">
                Simple and Effective Processes
              </span>
              <h2 className="text-2xl font-bold text-[#15233c] dark:text-white mb-4 font-display">
                Data Rich Digital Environments
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Our next-generation procurement approach maximises the benefits of collaboration, utilises the adoption of data rich digital environments, and runs compliance and control in the background to ensure participants remain focussed on outcomes and not process.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                By automating repetitive compliance checks and deploying collaborative evaluation portals, we condense procurement timelines while reducing transactional friction.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-[#245237] dark:text-[#21afc2] font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Accelerated Evaluation Workflows</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111C2E] p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="p-3 w-fit rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2] border border-emerald-100 dark:border-emerald-800/80 mb-4">
                <Network className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] block mb-1">
                Extensive Industry Experience
              </span>
              <h2 className="text-2xl font-bold text-[#15233c] dark:text-white mb-4 font-display">
                Institutional Knowledge & Risk Models
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Our team draws on our vast institutional knowledge and library of commercial and risk models, contract types, and project costings to ensure clients are well prepared.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                We empower clients to clearly differentiate between real market issues and contractors’ negotiating positions, preventing value leakage before contract award.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-[#245237] dark:text-[#21afc2] font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Defensible Commercial Stances</span>
            </div>
          </div>
        </div>

        {/* Second Visual Showcase */}
        <div className="bg-[#15233c] dark:bg-[#070d18] text-white p-8 sm:p-12 rounded-3xl mb-16 relative overflow-hidden border border-white/10 dark:border-slate-800 shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#21afc2] block mb-2">
              Next-Gen Execution
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 font-display">
              Collaborative Alliances & AI-Aided Documentation
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              We pioneered introducing alliances into public transit infrastructure and continuously adopt AI tools to enhance contract drafting precision, risk analysis, and bidder response cross-referencing.
            </p>
            <button
              onClick={() => {
                setActiveView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold bg-[#21afc2] hover:bg-[#1b8e9e] text-[#070d18] font-bold rounded-xl transition-all transform hover:-translate-y-0.5 shadow-md cursor-pointer"
            >
              <span>Discuss Your Upcoming Procurement</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block opacity-25 pointer-events-none">
            <img
              src="https://res.cloudinary.com/detfwst5p/image/upload/v1766658242/bombheq%20webpage/img/transcation-2_botudh.jpg"
              alt="Transaction Advisory"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Team Section */}
        <TeamSection />

      </div>
    </div>
  );
};
