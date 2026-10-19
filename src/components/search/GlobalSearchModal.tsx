import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useContent } from '../../context/ContentContext';
import {
  Search,
  X,
  Compass,
  Briefcase,
  Users,
  FileText,
  ArrowRight,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  Clock,
  Sparkles,
  Phone,
  SlidersHorizontal,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type SearchCategory = 'all' | 'services' | 'cases' | 'team' | 'pages';

export interface SearchResultItem {
  id: string;
  itemId: string;
  category: Exclude<SearchCategory, 'all'>;
  categoryLabel: string;
  title: string;
  subtitle: string;
  description: string;
  metaText: string;
  image?: string;
  highlights?: string[];
  targetView: string;
  customAction?: () => void;
}

interface GlobalSearchModalProps {
  onOpenChat?: () => void;
}

const RECENT_SEARCHES_KEY = 'bombheq_recent_searches_v1';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  onOpenChat
}) => {
  const {
    content,
    isSearchOpen,
    setIsSearchOpen,
    setActiveView,
    setFocusedItemId
  } = useContent();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : ['NSW Fast Rail', 'Alliance Contracting', 'Dr. Marcus Vance'];
    } catch {
      return ['NSW Fast Rail', 'Alliance Contracting', 'Dr. Marcus Vance'];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcut: Cmd/Ctrl + K to toggle, Escape to close
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 40);
      return () => clearTimeout(timer);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Build unified searchable index from live CMS content
  const allSearchItems = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    // 1. Advisory Services
    (content.services || []).forEach(service => {
      items.push({
        id: `service-${service.id}`,
        itemId: service.id,
        category: 'services',
        categoryLabel: 'Advisory Service',
        title: service.name,
        subtitle: service.kicker,
        description: service.summary || service.fullDescription,
        metaText: `${service.shortName} · ${service.metricsText} ${service.metricsLabel}`,
        image: service.image,
        highlights: service.bulletPoints?.slice(0, 3) || [],
        targetView: service.id === 'strategy' ? 'strategy' : service.id === 'procurement' ? 'transaction' : 'services'
      });
    });

    // 2. Case Studies (including execution timeline milestones)
    (content.caseStudies || []).forEach(cs => {
      const milestoneHighlights = (cs.milestones || []).map(
        m => `${m.phase}: ${m.title} (${m.deliverable})`
      );
      items.push({
        id: `case-${cs.id}`,
        itemId: cs.id,
        category: 'cases',
        categoryLabel: 'Case Study',
        title: cs.title,
        subtitle: `${cs.client} · ${cs.category}`,
        description: cs.summary || cs.description,
        metaText: `${cs.value} Program Value · ${cs.completionDate}`,
        image: cs.image,
        highlights: [...(cs.keyOutcomes?.slice(0, 2) || []), ...milestoneHighlights.slice(0, 2)],
        targetView: 'cases'
      });
    });

    // 3. Team Members
    (content.team?.members || []).forEach(member => {
      items.push({
        id: `team-${member.id}`,
        itemId: member.id,
        category: 'team',
        categoryLabel: 'Leadership & Team',
        title: member.name,
        subtitle: member.role,
        description: member.bio,
        metaText: member.specialization,
        image: member.image,
        highlights: [
          `Role: ${member.role}`,
          `Specialization: ${member.specialization}`
        ],
        targetView: 'team'
      });
    });

    // 4. Careers & Open Roles + Site Pages / Quick Actions
    (content.careers?.openPositions || []).forEach(pos => {
      items.push({
        id: `career-${pos.id}`,
        itemId: pos.id,
        category: 'pages',
        categoryLabel: 'Career Opportunity',
        title: pos.title,
        subtitle: `${pos.department} · ${pos.location}`,
        description: `Open ${pos.type} advisory position in ${pos.location} within our ${pos.department} practice.`,
        metaText: `${pos.location} · ${pos.type}`,
        highlights: [
          `Department: ${pos.department}`,
          `Location: ${pos.location}`,
          `Engagement: ${pos.type}`
        ],
        targetView: 'team'
      });
    });

    // 5. Engineering Services & Consulting Process FAQs
    (content.faqs || []).forEach(faq => {
      items.push({
        id: `faq-${faq.id}`,
        itemId: faq.id,
        category: 'services',
        categoryLabel: `FAQ · ${faq.category}`,
        title: faq.question,
        subtitle: faq.deliverableTag || faq.category,
        description: faq.answer,
        metaText: `Consulting Process FAQ · ${faq.category}`,
        highlights: faq.keyTakeaways || [],
        targetView: 'home'
      });
    });

    // Quick Navigation & Interactive Actions
    items.push(
      {
        id: 'page-contact',
        itemId: 'contact',
        category: 'pages',
        categoryLabel: 'Office & Inquiries',
        title: 'Contact Bombheq Partners & Book Consultation',
        subtitle: `${content.company.addressShort} · ${content.company.phone}`,
        description: content.contact?.intro || 'Schedule a strategic infrastructure consultation with our senior partners.',
        metaText: `${content.company.email} · ${content.company.hours}`,
        highlights: [
          `Address: ${content.company.address}`,
          `Phone: ${content.company.phone}`,
          `Hours: ${content.company.hours}`
        ],
        targetView: 'contact'
      },
      {
        id: 'action-ai-chat',
        itemId: 'ai-chat',
        category: 'pages',
        categoryLabel: 'Interactive Tool',
        title: 'Launch AI Customer Support Assistant',
        subtitle: 'Instant answers on services, projects, and probity',
        description: 'Open the Bombheq Advisor AI chat assistant with voice input, read-aloud TTS, and partner escalation.',
        metaText: 'AI Advisory Assistant · Online 24/7',
        targetView: 'home',
        customAction: () => {
          onOpenChat?.();
        }
      }
    );

    return items;
  }, [content, onOpenChat]);

  // Filter and score results by search query and category
  const filteredResults = useMemo<SearchResultItem[]>(() => {
    const trimmed = query.trim().toLowerCase();
    const terms = trimmed.split(/\s+/).filter(Boolean);

    return allSearchItems
      .filter(item => {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }
        if (terms.length === 0) return true;

        const haystack = `${item.title} ${item.subtitle} ${item.description} ${item.metaText} ${(item.highlights || []).join(' ')}`.toLowerCase();
        return terms.every(term => haystack.includes(term));
      })
      .sort((a, b) => {
        if (terms.length === 0) return 0;
        const aTitleMatch = a.title.toLowerCase().includes(trimmed) ? 1 : 0;
        const bTitleMatch = b.title.toLowerCase().includes(trimmed) ? 1 : 0;
        return bTitleMatch - aTitleMatch;
      });
  }, [allSearchItems, query, selectedCategory]);

  // Keep selectedIndex within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  // Scroll active item into view when navigating via keyboard
  useEffect(() => {
    if (!listContainerRef.current) return;
    const activeEl = listContainerRef.current.querySelector(`[data-result-index="${selectedIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const saveRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches(prev => {
      const updated = [clean, ...prev.filter(item => item.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage error
      }
      return updated;
    });
  };

  const handleSelectResult = (item: SearchResultItem) => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
    } else {
      saveRecentSearch(item.title);
    }

    setIsSearchOpen(false);

    if (item.customAction) {
      item.customAction();
      return;
    }

    setFocusedItemId(item.itemId);
    setActiveView(item.targetView);

    // Smooth scroll to targeted element if it exists on the page after view transition
    setTimeout(() => {
      const targetEl = document.getElementById(`search-target-${item.itemId}`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 180);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredResults[selectedIndex];
      if (current) {
        handleSelectResult(current);
      }
    }
  };

  const activeResult = filteredResults[selectedIndex] || filteredResults[0] || null;

  const getCategoryIcon = (category: SearchResultItem['category'], id: string) => {
    if (id === 'action-ai-chat') return <Sparkles className="w-4 h-4 text-[#21afc2]" />;
    if (id === 'action-agent-desk') return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
    if (id === 'action-cms') return <SlidersHorizontal className="w-4 h-4 text-[#21afc2]" />;
    if (id === 'page-contact') return <Phone className="w-4 h-4 text-[#245237] dark:text-[#21afc2]" />;

    switch (category) {
      case 'services':
        return <Compass className="w-4 h-4 text-[#245237] dark:text-[#21afc2]" />;
      case 'cases':
        return <Briefcase className="w-4 h-4 text-[#245237] dark:text-[#21afc2]" />;
      case 'team':
        return <Users className="w-4 h-4 text-[#245237] dark:text-[#21afc2]" />;
      case 'pages':
      default:
        return <FileText className="w-4 h-4 text-[#245237] dark:text-[#21afc2]" />;
    }
  };

  // Highlight matching substring cleanly
  const highlightText = (text: string, search: string) => {
    const trimmed = search.trim();
    if (!trimmed) return text;
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === trimmed.toLowerCase() ? (
        <mark
          key={i}
          className="bg-emerald-100 dark:bg-[#21afc2]/25 text-[#15233c] dark:text-[#21afc2] rounded-xs px-0.5 font-semibold"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const categoryCounts = useMemo(() => {
    const counts = {
      all: allSearchItems.length,
      services: allSearchItems.filter(i => i.category === 'services').length,
      cases: allSearchItems.filter(i => i.category === 'cases').length,
      team: allSearchItems.filter(i => i.category === 'team').length,
      pages: allSearchItems.filter(i => i.category === 'pages').length
    };
    return counts;
  }, [allSearchItems]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-6 pb-6 bg-[#070d18]/65 backdrop-blur-sm"
          onClick={() => setIsSearchOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Global Site Search"
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            className="w-full max-w-4xl bg-white dark:bg-[#0B111E] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col max-h-[82vh]"
          >
            {/* Top Search Input Bar */}
            <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-[#0B111E]">
              <Search className="w-5 h-5 text-[#245237] dark:text-[#21afc2] shrink-0 ml-1" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search advisory services, $20B rail case studies, partners, or actions..."
                className="flex-1 bg-transparent text-sm sm:text-base text-[#15233c] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                aria-label="Search site content"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className="px-2 py-1 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Category Filter Segmented Bar */}
            <div className="px-4 py-2.5 bg-slate-50/90 dark:bg-[#070d18]/90 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-1">
                {(
                  [
                    { id: 'all', label: 'All', count: categoryCounts.all },
                    { id: 'services', label: 'Services', count: categoryCounts.services },
                    { id: 'cases', label: 'Case Studies', count: categoryCounts.cases },
                    { id: 'team', label: 'Leadership & Team', count: categoryCounts.team },
                    { id: 'pages', label: 'Careers & Actions', count: categoryCounts.pages }
                  ] as { id: SearchCategory; label: string; count: number }[]
                ).map(tab => {
                  const isActive = selectedCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-[#245237] dark:bg-[#21afc2] text-white dark:text-[#070d18] shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className="ml-1.5 opacity-75 tabular-nums">({tab.count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Recent search quick links when query is empty */}
              {!query && recentSearches.length > 0 && (
                <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 shrink-0">
                  <Clock className="w-3 h-3" />
                  {recentSearches.slice(0, 2).map((term, idx) => (
                    <React.Fragment key={term}>
                      {idx > 0 && <span aria-hidden="true">·</span>}
                      <button
                        type="button"
                        onClick={() => setQuery(term)}
                        className="hover:text-[#245237] dark:hover:text-[#21afc2] transition-colors cursor-pointer"
                      >
                        {term}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* Main Split Body: Results List + Rich Preview Pane */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
              
              {/* Left Column: Search Results */}
              <div
                ref={listContainerRef}
                className="lg:col-span-7 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/70 max-h-[55vh] lg:max-h-none"
              >
                {filteredResults.length === 0 ? (
                  <div className="p-10 text-center space-y-3">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      No matching results for "{query}"
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      Try searching for infrastructure terms like "Rail", "Procurement", "Dispute", "Strategy", or a partner's name.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                      {['NSW Fast Rail', 'Cross River Rail', 'Dr. Marcus Vance', 'Procurement'].map(suggestion => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            setSelectedCategory('all');
                            setQuery(suggestion);
                          }}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#245237] dark:hover:text-[#21afc2] cursor-pointer transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  filteredResults.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-result-index={idx}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onClick={() => handleSelectResult(item)}
                        className={`w-full text-left px-4 py-3.5 flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/80 dark:bg-[#131F35]'
                            : 'hover:bg-slate-50 dark:hover:bg-[#0E1626]'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="mt-0.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 shrink-0">
                            {getCategoryIcon(item.category, item.id)}
                          </div>
                          <div className="min-w-0">
                            {/* Unboxed metadata line with typographic separator */}
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              <span className="font-semibold text-[#245237] dark:text-[#21afc2]">
                                {item.categoryLabel}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="truncate">{highlightText(item.subtitle, query)}</span>
                            </div>

                            <h4 className="text-sm font-bold text-[#15233c] dark:text-white truncate mt-0.5 font-display">
                              {highlightText(item.title, query)}
                            </h4>

                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {highlightText(item.description, query)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 self-center">
                          <CornerDownLeft
                            className={`w-3.5 h-3.5 transition-opacity ${
                              isSelected ? 'opacity-100 text-[#245237] dark:text-[#21afc2]' : 'opacity-0'
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Right Column: Live Context Preview Pane (Desktop) */}
              <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-6 bg-slate-50/70 dark:bg-[#070d18]/70 border-l border-slate-200/80 dark:border-slate-800 overflow-y-auto">
                {activeResult ? (
                  <div className="space-y-4">
                    {activeResult.image && (
                      <div className="relative rounded-xl overflow-hidden aspect-16/9 bg-slate-200 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800">
                        <img
                          src={activeResult.image}
                          alt={activeResult.title}
                          className="w-full h-full object-cover object-center"
                          referrerPolicy="no-referrer"
                          onError={e => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-[#245237] dark:text-[#21afc2]">
                          {activeResult.categoryLabel}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{activeResult.metaText}</span>
                      </div>

                      <h3 className="text-lg font-bold text-[#15233c] dark:text-white font-display leading-snug">
                        {activeResult.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {activeResult.description}
                    </p>

                    {activeResult.highlights && activeResult.highlights.length > 0 && (
                      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                          Key Highlights
                        </span>
                        {activeResult.highlights.map((hl, i) => (
                          <div key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                            <span className="text-[#245237] dark:text-[#21afc2] font-bold">·</span>
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={() => handleSelectResult(activeResult)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:hover:bg-[#1994a5] text-white dark:text-[#070d18] text-xs font-semibold transition-all cursor-pointer shadow-xs"
                      >
                        <span>Open {activeResult.categoryLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                    Select an item to preview details
                  </div>
                )}
              </div>
            </div>

            {/* Footer Keyboard Legend */}
            <div className="px-4 py-2.5 bg-slate-100/90 dark:bg-[#070d18] border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  <ArrowDown className="w-3 h-3" />
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <CornerDownLeft className="w-3 h-3" />
                  <span>Open</span>
                </span>
                <span>ESC to close</span>
              </div>

              <span className="tabular-nums">
                {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} indexed
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
