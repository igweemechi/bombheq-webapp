import React from 'react';
import { useContent } from '../../context/ContentContext';
import { Linkedin, Twitter, ArrowRight } from 'lucide-react';
import { Card3D } from '../ui/Card3D';
import { PerspectiveHeading } from '../ui/PerspectiveText';

export const TeamSection: React.FC = () => {
  const { content, setActiveView } = useContent();
  const { team } = content;
  const members = team?.members || [];

  return (
    <section className="py-20 lg:py-24 bg-[#f6f7fc] dark:bg-[#070d18] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-2">
            <span>{team.kicker}</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400 normal-case font-normal">Expert Leadership</span>
          </div>
          
          <PerspectiveHeading
            text={team.title}
            as="h2"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#15233c] dark:text-white tracking-tight leading-tight mb-4 [text-wrap:balance] font-display"
          />

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {team.description}
          </p>
        </div>

        {/* 4-Column 3D Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map(member => (
            <Card3D
              key={member.id}
              maxTilt={7}
              scale={1.02}
              className="w-full"
            >
              <div className="group h-full bg-white dark:bg-[#111C2E] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl dark:hover:border-[#21afc2]/50 transition-all duration-300 flex flex-col">
                
                {/* Photo Aspect Container */}
                <div className="relative aspect-4/5 overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex items-center gap-2 text-white">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-white/20 hover:bg-white/40 backdrop-blur-md transition-colors"
                          aria-label={`${member.name} LinkedIn`}
                        >
                          <Linkedin className="w-4 h-4 text-white" />
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-white/20 hover:bg-white/40 backdrop-blur-md transition-colors"
                          aria-label={`${member.name} Twitter`}
                        >
                          <Twitter className="w-4 h-4 text-white" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio & Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#15233c] dark:text-white group-hover:text-[#245237] dark:group-hover:text-[#21afc2] transition-colors font-display">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#245237] dark:text-[#21afc2] mt-0.5 mb-1">
                      {member.role}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-3">
                      {member.specialization}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                    <span>Bombheq Advisory</span>
                    <span className="text-[#245237] dark:text-[#21afc2] font-semibold">Verified</span>
                  </div>
                </div>
              </div>
            </Card3D>
          ))}
        </div>

        {/* View all team CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={() => {
              setActiveView('team');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-[#245237] dark:text-[#21afc2] bg-white dark:bg-[#111C2E] hover:bg-emerald-50 dark:hover:bg-[#17263E] border border-slate-200 dark:border-slate-800 rounded-xl transition-all shadow-xs cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>Learn More About Our People</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
