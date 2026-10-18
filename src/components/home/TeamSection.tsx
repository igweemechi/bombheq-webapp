import React, { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { Linkedin, Twitter, ArrowRight, Radar } from 'lucide-react';
import { Card3D } from '../ui/Card3D';
import { PerspectiveHeading } from '../ui/PerspectiveText';
import { TeamSkillMatrix, MiniMemberRadar } from './TeamSkillMatrix';

export const TeamSection: React.FC = () => {
  const { content, setActiveView, focusedItemId } = useContent();
  const { team } = content;
  const members = team?.members || [];

  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    members[0]?.id || 'member-1'
  );

  // Sync with Global Search deep-link selection
  useEffect(() => {
    if (focusedItemId && members.some(m => m.id === focusedItemId)) {
      setSelectedMemberId(focusedItemId);
    }
  }, [focusedItemId, members]);

  const handleInspectMatrix = (memberId: string) => {
    setSelectedMemberId(memberId);
    const matrixEl = document.getElementById('team-skill-matrix');
    if (matrixEl) {
      matrixEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <section className="py-20 lg:py-24 bg-[#f6f7fc] dark:bg-[#070d18] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-2">
            <span>{team.kicker}</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400 normal-case font-normal">Expert Leadership & Skill Matrix</span>
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
          {members.map(member => {
            const isSelected = selectedMemberId === member.id || focusedItemId === member.id;
            const topSkills = [...(member.skillMatrix || [])]
              .sort((a, b) => b.score - a.score)
              .slice(0, 2);

            return (
              <Card3D
                key={member.id}
                maxTilt={7}
                scale={1.02}
                className="w-full"
              >
                <div
                  id={`search-target-${member.id}`}
                  className={`group h-full bg-white dark:bg-[#111C2E] rounded-2xl border overflow-hidden shadow-xs hover:shadow-xl dark:hover:border-[#21afc2]/50 transition-all duration-300 flex flex-col ${
                    isSelected
                      ? 'border-[#245237] dark:border-[#21afc2] ring-2 ring-[#245237]/20 dark:ring-[#21afc2]/30'
                      : 'border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  
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
                    {member.yearsExperience && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/15">
                        {member.yearsExperience}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
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

                      <button
                        type="button"
                        onClick={() => handleInspectMatrix(member.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#245237] dark:bg-[#21afc2] text-white dark:text-[#070d18] text-[11px] font-bold shadow-md cursor-pointer"
                      >
                        <Radar className="w-3.5 h-3.5" />
                        <span>Skill Radar</span>
                      </button>
                    </div>
                  </div>

                  {/* Bio & Mini D3 Skill Radar Preview */}
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

                      {/* Inline Mini D3 Radar + Top Expertise Domains */}
                      <div
                        onClick={() => handleInspectMatrix(member.id)}
                        className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1320]/90 border border-slate-200/70 dark:border-slate-800/80 flex items-center gap-3 cursor-pointer hover:border-[#245237]/40 dark:hover:border-[#21afc2]/40 transition-colors"
                        title="Click to inspect full 6-axis Skill Matrix"
                      >
                        <MiniMemberRadar
                          skills={member.skillMatrix}
                          isSelected={isSelected}
                        />
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                            <span>Peak Domains</span>
                            <span className="text-[#245237] dark:text-[#21afc2]">Matrix ↗</span>
                          </div>
                          {topSkills.map(skill => (
                            <div key={skill.axis} className="text-[11px]">
                              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-medium">
                                <span className="truncate pr-1">{skill.shortLabel}</span>
                                <span className="font-mono font-bold text-[#245237] dark:text-[#21afc2]">
                                  {skill.score}%
                                </span>
                              </div>
                              <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-0.5">
                                <div
                                  className="h-full rounded-full bg-[#245237] dark:bg-[#21afc2]"
                                  style={{ width: `${skill.score}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                      <span>Bombheq Advisory</span>
                      <button
                        type="button"
                        onClick={() => handleInspectMatrix(member.id)}
                        className={`inline-flex items-center gap-1 font-semibold cursor-pointer ${
                          isSelected
                            ? 'text-[#245237] dark:text-[#21afc2]'
                            : 'text-slate-500 dark:text-slate-400 hover:text-[#245237] dark:hover:text-[#21afc2]'
                        }`}
                      >
                        <Radar className="w-3 h-3" />
                        <span>{isSelected ? 'Active in Matrix' : 'Compare Skills'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card3D>
            );
          })}
        </div>

        {/* Interactive Recharts + D3 Skill Matrix Workbench */}
        {members.length > 0 && (
          <TeamSkillMatrix
            members={members}
            selectedMemberId={selectedMemberId}
            onSelectMember={setSelectedMemberId}
          />
        )}

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
