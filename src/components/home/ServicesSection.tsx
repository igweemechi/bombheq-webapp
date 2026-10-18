import React from 'react';
import { useContent } from '../../context/ContentContext';
import { 
  Compass, 
  Layers, 
  Scale, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Card3D } from '../ui/Card3D';
import { PerspectiveHeading } from '../ui/PerspectiveText';
import { ScrollReveal } from '../ui/ScrollReveal';

const iconMap: Record<string, React.ElementType> = {
  Compass,
  Layers,
  Scale,
  ShieldCheck
};

export const ServicesSection: React.FC = () => {
  const { content, setActiveView } = useContent();
  const services = content.services || [];

  const handleServiceClick = (serviceId: string) => {
    if (serviceId === 'strategy') {
      setActiveView('strategy');
    } else if (serviceId === 'transaction') {
      setActiveView('transaction');
    } else {
      setActiveView('services');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="services-section"
      className="py-20 lg:py-24 bg-[#f6f7fc] dark:bg-[#070d18] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal
          variant="fade-up"
          duration={700}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-2">
              <span>Trusted Infrastructure Advisory</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-slate-500 dark:text-slate-400 normal-case font-normal">Core Disciplines</span>
            </div>
            
            <PerspectiveHeading
              text="Setting our clients up for success through advanced analysis and ideas generation."
              as="h2"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#15233c] dark:text-white tracking-tight leading-tight [text-wrap:balance] font-display"
            />
          </div>

          <button
            onClick={() => {
              setActiveView('services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#245237] dark:text-[#21afc2] bg-white dark:bg-[#111C2E] hover:bg-emerald-50 dark:hover:bg-[#17263E] border border-slate-200 dark:border-slate-800 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </ScrollReveal>

        {/* 4-Card 3D Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.iconName] || Compass;
            const indexNumber = `0${index + 1}`;

            return (
              <ScrollReveal
                key={service.id}
                variant="fade-up"
                delay={index * 110}
                duration={720}
                className="h-full"
              >
                <Card3D
                  maxTilt={6}
                  scale={1.015}
                  className="w-full h-full"
                >
                  <div className="group h-full bg-white dark:bg-[#111C2E] rounded-2xl border border-slate-200/80 dark:border-slate-800/90 overflow-hidden shadow-xs hover:shadow-xl dark:hover:border-[#21afc2]/50 transition-all duration-300 flex flex-col">
                    
                    {/* Image Aspect Box with 3D Depth Scrim */}
                    <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      
                      {/* Floating Number and Metric Tag */}
                      <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white">
                        <span className="text-xs font-mono tracking-wider font-bold opacity-90">
                          {indexNumber}
                        </span>
                        <span className="text-xs font-medium bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[#21afc2] border border-white/15">
                          {service.metricsLabel}: <strong className="text-white">{service.metricsText}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2] border border-emerald-100 dark:border-emerald-800/60">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2]">
                            {service.kicker}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-[#15233c] dark:text-white mb-3 group-hover:text-[#245237] dark:group-hover:text-[#21afc2] transition-colors leading-snug font-display">
                          {service.name}
                        </h3>

                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                          {service.summary}
                        </p>

                        {/* Key Highlights */}
                        <div className="space-y-2 mb-6">
                          {service.bulletPoints.slice(0, 3).map((bp, bpIdx) => (
                            <div key={bpIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2] shrink-0 mt-0.5" />
                              <span>{bp}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <button
                          onClick={() => handleServiceClick(service.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#245237] dark:text-[#21afc2] hover:underline transition-colors cursor-pointer"
                        >
                          <span>Deep Dive & Case Insights</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                          Bombheq Advisory
                        </span>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
