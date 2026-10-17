import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { 
  X, 
  SlidersHorizontal, 
  FileCode2, 
  Download, 
  Upload, 
  Copy, 
  RotateCcw, 
  Check, 
  Building2, 
  Layout, 
  Briefcase, 
  Award, 
  Users, 
  Save
} from 'lucide-react';

type TabKey = 'company' | 'hero' | 'services' | 'cases' | 'team' | 'careers' | 'json';

export const ContentManagerDrawer: React.FC = () => {
  const { 
    content, 
    updateContent, 
    resetToDefault, 
    isCmsOpen, 
    toggleCms, 
    exportJson, 
    downloadJsonFile, 
    importJson,
    showToast
  } = useContent();

  const [activeTab, setActiveTab] = useState<TabKey>('company');
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleOpenJsonTab = () => {
    setActiveTab('json');
    setJsonText(exportJson());
    setJsonError(null);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(exportJson());
    setCopied(true);
    showToast('JSON copied to clipboard! Ready to paste into Headless CMS');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyJson = () => {
    const result = importJson(jsonText);
    if (!result.success) {
      setJsonError(result.message);
    } else {
      setJsonError(null);
      showToast('JSON applied to site in real-time!');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJsonText(text);
      const res = importJson(text);
      if (!res.success) {
        setJsonError(res.message);
      } else {
        setJsonError(null);
        showToast('Imported and applied JSON file successfully');
      }
    };
    reader.readAsText(file);
  };

  if (!isCmsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0B111E] text-slate-800 dark:text-slate-100 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-900 dark:bg-[#070d18] text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#245237] text-white">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-none font-display">
                Bombheq Headless CMS & JSON Manager
              </h2>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Live editor & content schema sync
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetToDefault}
              className="p-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-slate-800"
              title="Reset all content to original defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={toggleCms}
              className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-slate-800"
              aria-label="Close CMS editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 dark:bg-[#070d18] border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          {[
            { key: 'company', label: 'Company', icon: Building2 },
            { key: 'hero', label: 'Hero Slides', icon: Layout },
            { key: 'services', label: 'Services', icon: Briefcase },
            { key: 'cases', label: 'Case Studies', icon: Award },
            { key: 'team', label: 'Team', icon: Users },
            { key: 'careers', label: 'Careers', icon: Briefcase },
            { key: 'json', label: 'Raw JSON / Sync', icon: FileCode2 },
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  if (tab.key === 'json') {
                    handleOpenJsonTab();
                  } else {
                    setActiveTab(tab.key as TabKey);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isCurrent 
                    ? 'bg-white dark:bg-[#111C2E] text-[#245237] dark:text-[#21afc2] shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* 1. Company Tab */}
          {activeTab === 'company' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#15233c] dark:text-white uppercase tracking-wider font-display">
                Company & Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={content.company.name}
                    onChange={e => updateContent(prev => ({
                      ...prev,
                      company: { ...prev.company, name: e.target.value }
                    }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white focus:border-[#245237] dark:focus:border-[#21afc2] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={content.company.tagline}
                    onChange={e => updateContent(prev => ({
                      ...prev,
                      company: { ...prev.company, tagline: e.target.value }
                    }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white focus:border-[#245237] dark:focus:border-[#21afc2] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Affiliation</label>
                  <input
                    type="text"
                    value={content.company.affiliation}
                    onChange={e => updateContent(prev => ({
                      ...prev,
                      company: { ...prev.company, affiliation: e.target.value }
                    }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white focus:border-[#245237] dark:focus:border-[#21afc2] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={content.company.phone}
                    onChange={e => updateContent(prev => ({
                      ...prev,
                      company: { ...prev.company, phone: e.target.value }
                    }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white focus:border-[#245237] dark:focus:border-[#21afc2] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={content.company.email}
                    onChange={e => updateContent(prev => ({
                      ...prev,
                      company: { ...prev.company, email: e.target.value }
                    }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white focus:border-[#245237] dark:focus:border-[#21afc2] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Hours</label>
                  <input
                    type="text"
                    value={content.company.hours}
                    onChange={e => updateContent(prev => ({
                      ...prev,
                      company: { ...prev.company, hours: e.target.value }
                    }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white focus:border-[#245237] dark:focus:border-[#21afc2] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Head Office Address</label>
                <input
                  type="text"
                  value={content.company.address}
                  onChange={e => updateContent(prev => ({
                    ...prev,
                    company: { ...prev.company, address: e.target.value }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white focus:border-[#245237] dark:focus:border-[#21afc2] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Logo URL (Primary Light Theme)</label>
                <input
                  type="text"
                  value={content.company.logoPrimary}
                  onChange={e => updateContent(prev => ({
                    ...prev,
                    company: { ...prev.company, logoPrimary: e.target.value }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] font-mono text-slate-600 dark:text-slate-300 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 2. Hero Slides Tab */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-[#15233c] dark:text-white uppercase tracking-wider font-display">
                Hero Banner Slides ({content.hero.slides.length})
              </h3>

              {content.hero.slides.map((slide, sIdx) => (
                <div key={slide.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#f6f7fc] dark:bg-[#111C2E] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#245237] dark:text-[#21afc2]">
                      Slide {sIdx + 1}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Kicker</label>
                    <input
                      type="text"
                      value={slide.kicker}
                      onChange={e => {
                        const val = e.target.value;
                        updateContent(prev => {
                          const updated = [...prev.hero.slides];
                          updated[sIdx] = { ...updated[sIdx], kicker: val };
                          return { ...prev, hero: { ...prev.hero, slides: updated } };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Headline</label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={e => {
                        const val = e.target.value;
                        updateContent(prev => {
                          const updated = [...prev.hero.slides];
                          updated[sIdx] = { ...updated[sIdx], title: val };
                          return { ...prev, hero: { ...prev.hero, slides: updated } };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Subtitle</label>
                    <textarea
                      rows={2}
                      value={slide.subtitle}
                      onChange={e => {
                        const val = e.target.value;
                        updateContent(prev => {
                          const updated = [...prev.hero.slides];
                          updated[sIdx] = { ...updated[sIdx], subtitle: val };
                          return { ...prev, hero: { ...prev.hero, slides: updated } };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Background Image URL</label>
                    <input
                      type="text"
                      value={slide.bgImage}
                      onChange={e => {
                        const val = e.target.value;
                        updateContent(prev => {
                          const updated = [...prev.hero.slides];
                          updated[sIdx] = { ...updated[sIdx], bgImage: val };
                          return { ...prev, hero: { ...prev.hero, slides: updated } };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-[#15233c] dark:text-white uppercase tracking-wider font-display">
                Advisory Services ({content.services.length})
              </h3>

              {content.services.map((service, idx) => (
                <div key={service.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#f6f7fc] dark:bg-[#111C2E] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#245237] dark:text-[#21afc2]">
                      0{idx + 1}. {service.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Service Title</label>
                      <input
                        type="text"
                        value={service.name}
                        onChange={e => {
                          const val = e.target.value;
                          updateContent(prev => {
                            const updated = [...prev.services];
                            updated[idx] = { ...updated[idx], name: val };
                            return { ...prev, services: updated };
                          });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Metric Tag</label>
                      <input
                        type="text"
                        value={service.metricsText}
                        onChange={e => {
                          const val = e.target.value;
                          updateContent(prev => {
                            const updated = [...prev.services];
                            updated[idx] = { ...updated[idx], metricsText: val };
                            return { ...prev, services: updated };
                          });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Headline</label>
                    <input
                      type="text"
                      value={service.headline}
                      onChange={e => {
                        const val = e.target.value;
                        updateContent(prev => {
                          const updated = [...prev.services];
                          updated[idx] = { ...updated[idx], headline: val };
                          return { ...prev, services: updated };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Summary</label>
                    <textarea
                      rows={2}
                      value={service.summary}
                      onChange={e => {
                        const val = e.target.value;
                        updateContent(prev => {
                          const updated = [...prev.services];
                          updated[idx] = { ...updated[idx], summary: val };
                          return { ...prev, services: updated };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={service.image}
                      onChange={e => {
                        const val = e.target.value;
                        updateContent(prev => {
                          const updated = [...prev.services];
                          updated[idx] = { ...updated[idx], image: val };
                          return { ...prev, services: updated };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. Case Studies Tab */}
          {activeTab === 'cases' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-[#15233c] dark:text-white uppercase tracking-wider font-display">
                Case Studies ({content.caseStudies.length})
              </h3>

              {content.caseStudies.map((project, idx) => (
                <div key={project.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#f6f7fc] dark:bg-[#111C2E] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#245237] dark:text-[#21afc2]">
                      {project.title}
                    </span>
                    <span className="text-xs font-bold text-[#15233c] dark:text-white">
                      {project.value}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Client</label>
                      <input
                        type="text"
                        value={project.client}
                        onChange={e => {
                          const val = e.target.value;
                          updateContent(prev => {
                            const updated = [...prev.caseStudies];
                            updated[idx] = { ...updated[idx], client: val };
                            return { ...prev, caseStudies: updated };
                          });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Project Value</label>
                      <input
                        type="text"
                        value={project.value}
                        onChange={e => {
                          const val = e.target.value;
                          updateContent(prev => {
                            const updated = [...prev.caseStudies];
                            updated[idx] = { ...updated[idx], value: val };
                            return { ...prev, caseStudies: updated };
                          });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={project.description}
                      onChange={e => {
                        const val = e.target.value;
                        updateContent(prev => {
                          const updated = [...prev.caseStudies];
                          updated[idx] = { ...updated[idx], description: val };
                          return { ...prev, caseStudies: updated };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={project.image}
                      onChange={e => {
                        const val = e.target.value;
                        updateContent(prev => {
                          const updated = [...prev.caseStudies];
                          updated[idx] = { ...updated[idx], image: val };
                          return { ...prev, caseStudies: updated };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-[#15233c] dark:text-white uppercase tracking-wider font-display">
                Leadership & Team Members ({content.team.members.length})
              </h3>

              {content.team.members.map((member, idx) => (
                <div key={member.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#f6f7fc] dark:bg-[#111C2E] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Name</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={e => {
                          const val = e.target.value;
                          updateContent(prev => {
                            const updated = [...prev.team.members];
                            updated[idx] = { ...updated[idx], name: val };
                            return { ...prev, team: { ...prev.team, members: updated } };
                          });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Designation</label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={e => {
                          const val = e.target.value;
                          updateContent(prev => {
                            const updated = [...prev.team.members];
                            updated[idx] = { ...updated[idx], role: val };
                            return { ...prev, team: { ...prev.team, members: updated } };
                          });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Bio</label>
                    <textarea
                      rows={2}
                      value={member.bio}
                      onChange={e => {
                        const val = e.target.value;
                        updateContent(prev => {
                          const updated = [...prev.team.members];
                          updated[idx] = { ...updated[idx], bio: val };
                          return { ...prev, team: { ...prev.team, members: updated } };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Photo URL</label>
                    <input
                      type="text"
                      value={member.image}
                      onChange={e => {
                        const val = e.target.value;
                        updateContent(prev => {
                          const updated = [...prev.team.members];
                          updated[idx] = { ...updated[idx], image: val };
                          return { ...prev, team: { ...prev.team, members: updated } };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 6. Careers Tab */}
          {activeTab === 'careers' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#15233c] dark:text-white uppercase tracking-wider font-display">
                Careers & Open Positions
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Headline</label>
                <input
                  type="text"
                  value={content.careers.title}
                  onChange={e => updateContent(prev => ({
                    ...prev,
                    careers: { ...prev.careers, title: e.target.value }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={content.careers.description}
                  onChange={e => updateContent(prev => ({
                    ...prev,
                    careers: { ...prev.careers, description: e.target.value }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 7. Raw JSON & Headless CMS Integration Tab */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#15233c] dark:text-white uppercase tracking-wider font-display">
                    Site Content JSON
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Import, export, or sync directly with any Headless CMS.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyJson}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                  </button>

                  <button
                    onClick={downloadJsonFile}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:hover:bg-[#1994a5] dark:text-[#0b111e] rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .json</span>
                  </button>
                </div>
              </div>

              {/* Upload file trigger */}
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
                <span className="text-xs text-[#245237] dark:text-emerald-400 font-medium">
                  Load custom JSON file from your computer:
                </span>
                <label className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-[#111C2E] border border-emerald-300 dark:border-emerald-700 rounded-lg text-[#245237] dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-slate-800 cursor-pointer transition-colors shadow-2xs">
                  <span>Browse .json</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {jsonError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-800 font-mono">
                  Error: {jsonError}
                </div>
              )}

              {/* Code Textarea */}
              <div className="relative">
                <textarea
                  rows={14}
                  value={jsonText}
                  onChange={e => setJsonText(e.target.value)}
                  className="w-full p-4 text-xs font-mono bg-slate-900 text-emerald-300 rounded-2xl focus:outline-none border border-slate-800 selection:bg-emerald-800 shadow-inner"
                  spellCheck={false}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleApplyJson}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:hover:bg-[#1994a5] dark:text-[#0b111e] rounded-xl transition-all shadow-xs cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Apply Raw JSON to Site</span>
                </button>

                <span className="text-xs text-slate-400">
                  Instant live preview
                </span>
              </div>

              {/* Headless CMS Integration Guide */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-[#15233c] dark:text-white uppercase tracking-wider font-display">
                  How to Connect to a Headless CMS:
                </h4>
                
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                  <p>
                    <strong>1. Strapi / Directus:</strong> Create a Single Type (or Collection Types) matching the keys in this JSON (<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400">company</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400">services</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400">caseStudies</code>).
                  </p>
                  <p>
                    <strong>2. Sanity.io / Contentful:</strong> Import this schema into your studio models. Replace <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400">defaultContent.json</code> with your client fetcher.
                  </p>
                  <p>
                    <strong>3. GitHub Content CMS (Decap / Forestry):</strong> Commit this file at <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400">src/data/defaultContent.json</code>.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070d18] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Schema: Bombheq v1.0.0</span>
          <button
            onClick={toggleCms}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer"
          >
            Done Editing
          </button>
        </div>

      </div>
    </div>
  );
};
