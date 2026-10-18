import React, { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { Compass, Layers, Scale, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card3D } from '../ui/Card3D';
import { PerspectiveHeading } from '../ui/PerspectiveText';

const iconMap: Record<string, React.ElementType> = {
  Compass,
  Layers,
  Scale,
  ShieldCheck
};

export const ServicesPage: React.FC = () => {
  const { content, setActiveView, focusedItemId } = useContent();
  const [selectedServiceId, setSelectedServiceId] = useState<string>(content.services[0]?.id || 'strategy');

  useEffect(() => {
    if (focusedItemId && content.services.some(s => s.id === focusedItemId)) {
      setSelectedServiceId(focusedItemId);
    }
  }, [focusedItemId, content.services]);

  const selectedService = content.services.find(s => s.id === selectedServiceId) || content.services[0];
  const IconComponent = selectedService ? (iconMap[selectedService.iconName] || Compass) : Compass;

  return (
    <div className="py-12 lg:py-16 bg-[#f6f7fc] dark:bg-[#070d18] min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Page Title */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-2">
            <span>Bombheq Partners</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">/</span>
            <span>Advisory Practice</span>
          </div>

          <PerspectiveHeading
            text="Our Advisory Services"
            as="h1"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#15233c] dark:text-white tracking-tight mb-4 [text-wrap:balance] font-display"
          />

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            We set our clients up for success through trusted advice, based on collective experience and backed up through advanced analysis and ideas generation. We work with our clients to implement bespoke solutions, being with them every step of the journey.
          </p>
        </div>

        {/* Interactive Service Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-slate-200 dark:border-slate-800">
          {content.services.map(service => {
            const isCurrent = service.id === selectedServiceId;
            return (
              <button
                key={service.id}
                onClick={() => setSelectedServiceId(service.id)}
                className={`px-5 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer transform hover:-translate-y-0.5 ${
                  isCurrent
                    ? 'bg-[#245237] dark:bg-[#21afc2] text-white dark:text-[#0b111e] shadow-md'
                    : 'bg-white dark:bg-[#111C2E] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#17263E] border border-slate-200 dark:border-slate-800'
                }`}
              >
                {service.shortName}
              </button>
            );
          })}
        </div>

        {/* Selected Service Detailed 3D Breakdown */}
        {selectedService && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white dark:bg-[#111C2E] p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl mb-16">
            
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2] border border-emerald-100 dark:border-emerald-800/80">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#245237] dark:text-[#21afc2] uppercase tracking-wider block">
                    {selectedService.kicker}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#15233c] dark:text-white font-display">
                    {selectedService.name}
                  </h2>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 leading-snug">
                {selectedService.headline}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {selectedService.fullDescription}
              </p>

              {/* Bullet Points */}
              <div className="space-y-3 mb-8">
                <h4 className="text-xs font-bold text-[#15233c] dark:text-white uppercase tracking-wider">
                  Core Capabilities & Advisory Focus:
                </h4>
                {selectedService.bulletPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-[#245237] dark:text-[#21afc2] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Methodology Steps with 3D Pills */}
              {selectedService.methodologySteps && (
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-[#15233c] dark:text-white uppercase tracking-wider mb-4">
                    Our Engagement Methodology:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {selectedService.methodologySteps.map(step => (
                      <div key={step.step} className="p-4 rounded-xl bg-[#f6f7fc] dark:bg-[#070d18] border border-slate-200/60 dark:border-slate-800 hover:border-[#21afc2]/50 transition-colors">
                        <span className="text-xs font-mono font-bold text-[#245237] dark:text-[#21afc2]">
                          {step.step}
                        </span>
                        <h5 className="text-xs font-bold text-[#15233c] dark:text-white mt-1 mb-1 font-display">
                          {step.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Route Links */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {selectedService.id === 'strategy' && (
                  <button
                    onClick={() => {
                      setActiveView('strategy');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:hover:bg-[#1994a5] dark:text-[#0b111e] rounded-xl transition-all transform hover:-translate-y-0.5 shadow-xs cursor-pointer"
                  >
                    <span>View Dedicated Strategy Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {selectedService.id === 'transaction' && (
                  <button
                    onClick={() => {
                      setActiveView('transaction');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:hover:bg-[#1994a5] dark:text-[#0b111e] rounded-xl transition-all transform hover:-translate-y-0.5 shadow-xs cursor-pointer"
                  >
                    <span>View Dedicated Transaction Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#15233c] dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <span>Request Specific Advisory Brief</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            <div className="lg:col-span-5">
              <Card3D maxTilt={7} scale={1.02} className="w-full mb-6">
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 shadow-lg bg-slate-100 dark:bg-slate-800">
                  <img
                    src={selectedService.image}
                    alt={selectedService.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </Card3D>

              {/* 3D Metric Card */}
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-[#070d18] border border-emerald-200/80 dark:border-slate-800 shadow-sm">
                <span className="text-xs text-[#245237] dark:text-[#21afc2] font-semibold block">
                  {selectedService.metricsLabel}
                </span>
                <span className="text-3xl font-extrabold text-[#15233c] dark:text-white tracking-tight tabular-nums mt-0.5 block font-display">
                  {selectedService.metricsText}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Every advisory engagement is grounded in quantifiable evidence, industry benchmarks, and institutional models.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
