import React, { useState, useEffect, useMemo } from 'react';
import { useContent } from '../../context/ContentContext';
import {
  Home,
  ChevronRight,
  Compass,
  Briefcase,
  Users,
  Mail,
  Layers,
  ArrowLeft,
  Sparkles,
  X
} from 'lucide-react';

export interface BreadcrumbNode {
  id: string;
  label: string;
  view?: string;
  sectionAnchor?: string;
  isCurrent?: boolean;
  badge?: string;
}

const HOME_SECTIONS = [
  { id: 'overview', label: 'Overview', selector: '#overview-section' },
  { id: 'cases', label: 'Case Studies', selector: '#cases-section' },
  { id: 'team', label: 'Leadership', selector: '#team-section' },
  { id: 'faq', label: 'Process FAQ', selector: '#faq-section' },
  { id: 'careers', label: 'Careers', selector: '#careers-section' }
];

export const BreadcrumbBar: React.FC = () => {
  const {
    content,
    activeView,
    setActiveView,
    focusedItemId,
    setFocusedItemId
  } = useContent();

  const [viewHistory, setViewHistory] = useState<string[]>(['home']);
  const [activeHomeSection, setActiveHomeSection] = useState<string>('Executive Overview');

  // Track SPA view navigation history
  useEffect(() => {
    setViewHistory(prev => {
      if (prev[prev.length - 1] === activeView) return prev;
      return [...prev.slice(-9), activeView];
    });
  }, [activeView]);

  // Track active section while scrolling on the homepage
  useEffect(() => {
    if (activeView !== 'home') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 380) {
        setActiveHomeSection('Executive Overview');
        return;
      }

      const faqEl = document.getElementById('faq-section');
      const teamEl = document.getElementById('team-section');
      const casesEl = document.getElementById('cases-section');

      if (faqEl && scrollY >= faqEl.offsetTop - 260) {
        setActiveHomeSection('Engineering & Process FAQ');
      } else if (teamEl && scrollY >= teamEl.offsetTop - 260) {
        setActiveHomeSection('Expert Leadership');
      } else if (casesEl && scrollY >= casesEl.offsetTop - 260) {
        setActiveHomeSection('Case Studies ($45B+ Portfolio)');
      } else {
        setActiveHomeSection('Value Proposition & Rigor');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeView]);

  // Resolve focused deep-linked item title if present
  const focusedEntity = useMemo(() => {
    if (!focusedItemId) return null;

    const service = content.services?.find(s => s.id === focusedItemId);
    if (service) {
      return {
        label: service.shortName || service.name,
        badge: 'Service'
      };
    }

    const project = content.caseStudies?.find(c => c.id === focusedItemId);
    if (project) {
      return {
        label: project.title,
        badge: project.value
      };
    }

    const member = content.team?.members?.find(m => m.id === focusedItemId);
    if (member) {
      return {
        label: member.name,
        badge: member.role
      };
    }

    const faq = content.faqs?.find(f => f.id === focusedItemId);
    if (faq) {
      return {
        label: faq.deliverableTag || faq.category,
        badge: 'FAQ'
      };
    }

    const pos = content.careers?.openPositions?.find(p => p.id === focusedItemId);
    if (pos) {
      return {
        label: pos.title,
        badge: pos.location
      };
    }

    return null;
  }, [focusedItemId, content]);

  // Build hierarchical breadcrumb trail based on activeView + focusedEntity
  const breadcrumbs = useMemo<BreadcrumbNode[]>(() => {
    const trail: BreadcrumbNode[] = [
      {
        id: 'root-home',
        label: 'Home',
        view: 'home',
        isCurrent: activeView === 'home' && !focusedEntity
      }
    ];

    switch (activeView) {
      case 'home': {
        trail.push({
          id: 'home-section',
          label: activeHomeSection,
          isCurrent: !focusedEntity
        });
        break;
      }
      case 'services': {
        trail.push(
          {
            id: 'cat-advisory',
            label: 'Advisory Practice',
            view: 'services'
          },
          {
            id: 'view-services',
            label: 'Our Services',
            view: 'services',
            isCurrent: !focusedEntity,
            badge: `${content.services?.length || 4} Pillars`
          }
        );
        break;
      }
      case 'strategy': {
        trail.push(
          {
            id: 'cat-advisory',
            label: 'Advisory Practice',
            view: 'services'
          },
          {
            id: 'view-strategy',
            label: 'Strategy & Policy Advice',
            view: 'strategy',
            isCurrent: !focusedEntity,
            badge: 'Pillar 01'
          }
        );
        break;
      }
      case 'transaction': {
        trail.push(
          {
            id: 'cat-advisory',
            label: 'Advisory Practice',
            view: 'services'
          },
          {
            id: 'view-transaction',
            label: 'Transaction & Procurement Management',
            view: 'transaction',
            isCurrent: !focusedEntity,
            badge: 'Pillar 02'
          }
        );
        break;
      }
      case 'cases': {
        trail.push(
          {
            id: 'cat-portfolio',
            label: 'Proven Track Record',
            view: 'cases'
          },
          {
            id: 'view-cases',
            label: 'Case Studies & Execution Timelines',
            view: 'cases',
            isCurrent: !focusedEntity,
            badge: '$45B+ Portfolio'
          }
        );
        break;
      }
      case 'team': {
        trail.push(
          {
            id: 'cat-about',
            label: 'About Us',
            view: 'team'
          },
          {
            id: 'view-team',
            label: 'Our People & Skill Matrix',
            view: 'team',
            isCurrent: !focusedEntity,
            badge: `${content.team?.members?.length || 4} Partners`
          }
        );
        break;
      }
      case 'contact': {
        trail.push(
          {
            id: 'cat-engagement',
            label: 'Client Engagement',
            view: 'contact'
          },
          {
            id: 'view-contact',
            label: 'Contact Our Offices',
            view: 'contact',
            isCurrent: !focusedEntity,
            badge: content.company?.addressShort || 'QLD, Australia'
          }
        );
        break;
      }
      default:
        break;
    }

    if (focusedEntity) {
      trail.push({
        id: `focused-${focusedItemId}`,
        label: focusedEntity.label,
        badge: focusedEntity.badge,
        isCurrent: true
      });
    }

    return trail;
  }, [activeView, activeHomeSection, focusedEntity, focusedItemId, content]);

  const handleNavigate = (view: string, clearFocus = true) => {
    if (clearFocus) {
      setFocusedItemId(null);
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (viewHistory.length > 1) {
      const nextHistory = viewHistory.slice(0, -1);
      const previousView = nextHistory[nextHistory.length - 1] || 'home';
      setViewHistory(nextHistory);
      setFocusedItemId(null);
      setActiveView(previousView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (activeView !== 'home') {
      handleNavigate('home');
    }
  };

  const getViewIcon = () => {
    switch (activeView) {
      case 'services':
      case 'strategy':
        return <Compass className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />;
      case 'transaction':
        return <Layers className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />;
      case 'cases':
        return <Briefcase className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />;
      case 'team':
        return <Users className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />;
      case 'contact':
        return <Mail className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />;
    }
  };

  return (
    <div className="bg-slate-100/90 dark:bg-[#080f1d]/95 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Back Action + Semantic Breadcrumb Trail */}
        <div className="flex items-center gap-2.5 min-w-0 overflow-x-auto no-scrollbar">
          {activeView !== 'home' && (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-[#111C2E] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 text-[11px] font-semibold transition-colors shrink-0 cursor-pointer shadow-2xs"
              title="Return to previous view"
            >
              <ArrowLeft className="w-3 h-3 text-[#245237] dark:text-[#21afc2]" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex items-center gap-1.5 text-xs whitespace-nowrap">
              {breadcrumbs.map((node, index) => {
                const isFirst = index === 0;
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <li key={node.id} className="inline-flex items-center gap-1.5">
                    {index > 0 && (
                      <ChevronRight
                        aria-hidden="true"
                        className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0"
                      />
                    )}

                    {node.view && !isLast ? (
                      <button
                        type="button"
                        onClick={() => handleNavigate(node.view!)}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-[#245237] dark:hover:text-[#21afc2] hover:bg-white/70 dark:hover:bg-[#111C2E] font-medium transition-colors cursor-pointer"
                      >
                        {isFirst && <Home className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />}
                        <span>{node.label}</span>
                      </button>
                    ) : (
                      <span
                        aria-current={node.isCurrent ? 'page' : undefined}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold ${
                          isLast
                            ? 'bg-white dark:bg-[#111C2E] text-[#15233c] dark:text-white border border-slate-200/80 dark:border-slate-800 shadow-2xs'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {isFirst ? (
                          <Home className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />
                        ) : (
                          isLast && getViewIcon()
                        )}
                        <span className="truncate max-w-[220px] sm:max-w-xs">{node.label}</span>
                        {node.badge && (
                          <span className="ml-1 px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-cyan-950/70 text-[#245237] dark:text-[#21afc2] text-[10px] font-mono font-bold border border-emerald-200/60 dark:border-cyan-800/50">
                            {node.badge}
                          </span>
                        )}
                        {focusedEntity && isLast && (
                          <button
                            type="button"
                            onClick={() => setFocusedItemId(null)}
                            aria-label="Clear focused item filter"
                            className="ml-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            title="Clear focused item"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Right: Contextual Quick-Jump Hierarchy Links */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px]">
          {activeView === 'home' ? (
            <>
              <span className="text-slate-400 dark:text-slate-500 font-mono mr-1">
                On this page:
              </span>
              {HOME_SECTIONS.map(sec => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    const el = document.querySelector(sec.selector);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-[#245237] dark:hover:text-[#21afc2] hover:bg-white dark:hover:bg-[#111C2E] font-medium transition-colors cursor-pointer"
                >
                  {sec.label}
                </button>
              ))}
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 dark:text-slate-500 font-mono mr-1">
                Related Views:
              </span>
              {[
                { id: 'services', label: 'All Services' },
                { id: 'strategy', label: 'Strategy' },
                { id: 'transaction', label: 'Transactions' },
                { id: 'cases', label: 'Case Studies' },
                { id: 'team', label: 'Our People' }
              ]
                .filter(v => v.id !== activeView)
                .slice(0, 4)
                .map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleNavigate(v.id)}
                    className="px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-[#245237] dark:hover:text-[#21afc2] hover:bg-white dark:hover:bg-[#111C2E] font-medium transition-colors cursor-pointer"
                  >
                    {v.label}
                  </button>
                ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
