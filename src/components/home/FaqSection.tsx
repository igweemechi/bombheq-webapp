import React, { useState, useMemo, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { FaqItem } from '../../types/content';
import { PerspectiveHeading } from '../ui/PerspectiveText';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  Search,
  X,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Compass,
  Layers,
  Scale,
  ShieldCheck,
  ChevronsUpDown,
  MessageSquareText
} from 'lucide-react';

interface FaqSectionProps {
  onOpenChat?: () => void;
}

const CATEGORIES = [
  'All',
  'Strategy & Policy',
  'Procurement & PPP',
  'Commercial & Delivery',
  'Engagement & Disputes'
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Diagnostic & Mandate Scoping',
    timing: 'Days 1–5',
    description: 'Confidential partner discovery, probity clearance, and baseline technical/commercial diagnostic.'
  },
  {
    step: '02',
    title: 'Options & Risk Structuring',
    timing: 'Weeks 2–6',
    description: 'Treasury-aligned business case modeling, market sounding, and bespoke risk allocation matrices.'
  },
  {
    step: '03',
    title: 'Transaction & Procurement Execution',
    timing: 'Mandate Phase',
    description: 'EOI/RFT documentation, interactive tender workshops, TOC validation, and contract award.'
  },
  {
    step: '04',
    title: 'Embedded Coalface Assurance',
    timing: 'Delivery Lifecycle',
    description: 'Senior-led interface governance, GBR administration, and proactive dispute avoidance.'
  }
];

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenChat }) => {
  const { content, setActiveView, focusedItemId } = useContent();
  const faqs: FaqItem[] = content.faqs || [];

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<string[]>(() =>
    faqs.length > 0 ? [faqs[0].id] : ['faq-1']
  );

  // If navigated from Global Search to a specific FAQ item, expand it and reset filters
  useEffect(() => {
    if (focusedItemId && faqs.some(f => f.id === focusedItemId)) {
      setSelectedCategory('All');
      setSearchQuery('');
      setOpenIds(prev => (prev.includes(focusedItemId) ? prev : [...prev, focusedItemId]));
    }
  }, [focusedItemId, faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(item => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const inQuestion = item.question.toLowerCase().includes(q);
      const inAnswer = item.answer.toLowerCase().includes(q);
      const inCategory = item.category.toLowerCase().includes(q);
      const inTakeaways = item.keyTakeaways?.some(t => t.toLowerCase().includes(q)) ?? false;
      return inQuestion || inAnswer || inCategory || inTakeaways;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setOpenIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const allFilteredOpen =
    filteredFaqs.length > 0 && filteredFaqs.every(f => openIds.includes(f.id));

  const handleToggleAll = () => {
    if (allFilteredOpen) {
      setOpenIds([]);
    } else {
      setOpenIds(filteredFaqs.map(f => f.id));
    }
  };

  const getCategoryIcon = (category: FaqItem['category']) => {
    switch (category) {
      case 'Strategy & Policy':
        return <Compass className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />;
      case 'Procurement & PPP':
        return <Layers className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />;
      case 'Commercial & Delivery':
        return <ShieldCheck className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />;
      case 'Engagement & Disputes':
      default:
        return <Scale className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />;
    }
  };

  if (faqs.length === 0) return null;

  return (
    <section
      id="faq-section"
      className="py-20 lg:py-24 bg-white dark:bg-[#0b1320] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Engineering Services & Advisory Process FAQ</span>
            </div>

            <PerspectiveHeading
              text="Clarity on Complex Infrastructure Mandates"
              as="h2"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#15233c] dark:text-white tracking-tight leading-tight [text-wrap:balance] font-display"
            />
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
            Explore how our senior engineering and commercial specialists structure business cases, manage multi-billion-dollar transactions, and safeguard project delivery.
          </p>
        </div>

        {/* Category Filter Tabs & Search Bar */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          {/* Category Segmented Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map(category => {
              const count =
                category === 'All'
                  ? faqs.length
                  : faqs.filter(f => f.category === category).length;
              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#245237] dark:bg-[#21afc2] text-white dark:text-[#070d18] border-[#245237] dark:border-[#21afc2] shadow-xs'
                      : 'bg-slate-50 dark:bg-[#111C2E] text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-800 hover:border-[#245237]/40 dark:hover:border-[#21afc2]/40'
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/20 text-white dark:text-[#070d18]'
                        : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input & Expand/Collapse All */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter questions or processes..."
                aria-label="Filter FAQ questions"
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#111C2E] text-[#15233c] dark:text-slate-100 placeholder:text-slate-400 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#245237] dark:focus:border-[#21afc2] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear filter"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleToggleAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-[#111C2E] text-slate-700 dark:text-slate-300 hover:text-[#245237] dark:hover:text-[#21afc2] border border-slate-200 dark:border-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <ChevronsUpDown className="w-3.5 h-3.5" />
              <span>{allFilteredOpen ? 'Collapse All' : 'Expand All'}</span>
            </button>
          </div>
        </div>

        {/* 12-Column Asymmetric Layout: 4-Col Consulting Process Blueprint + 8-Col Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left 4 Columns: Consulting Process & Direct Briefing Card */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="p-6 rounded-2xl bg-[#f6f7fc] dark:bg-[#111C2E] border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-1">
                Standard Engagement Architecture
              </div>
              <h3 className="text-lg font-extrabold text-[#15233c] dark:text-white font-display mb-4">
                How We Mobilize & Deliver
              </h3>

              <div className="space-y-4 relative before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
                {PROCESS_STEPS.map(item => (
                  <div key={item.step} className="relative flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[11px] font-mono font-extrabold text-[#245237] dark:text-[#21afc2] shrink-0 z-10 shadow-2xs">
                      {item.step}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#15233c] dark:text-white">
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                          {item.timing}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800 space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#245237] hover:bg-[#1b3f29] dark:bg-[#21afc2] dark:hover:bg-[#1b95a6] text-white dark:text-[#070d18] text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <span>Request a Partner Scoping Call</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {onOpenChat && (
                  <button
                    type="button"
                    onClick={onOpenChat}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0b1320] hover:bg-slate-100 dark:hover:bg-slate-800 text-[#15233c] dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <MessageSquareText className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />
                    <span>Ask Our Advisory Assistant</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right 8 Columns: Interactive Accordion List */}
          <div className="lg:col-span-8 space-y-3.5">
            {filteredFaqs.length === 0 ? (
              <div className="p-10 rounded-2xl bg-slate-50 dark:bg-[#111C2E] border border-slate-200/80 dark:border-slate-800 text-center">
                <p className="text-sm font-bold text-[#15233c] dark:text-white mb-1">
                  No matching engineering or process questions found
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Try clearing your search filter or switching to "All" categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#245237] dark:bg-[#21afc2] text-white dark:text-[#070d18] cursor-pointer"
                >
                  Reset FAQ Filters
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isOpen = openIds.includes(faq.id);
                const isHighlighted = focusedItemId === faq.id;

                return (
                  <div
                    key={faq.id}
                    id={`search-target-${faq.id}`}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'bg-[#f6f7fc]/90 dark:bg-[#111C2E] border-[#245237]/40 dark:border-[#21afc2]/50 shadow-md'
                        : 'bg-white dark:bg-[#111C2E]/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    } ${
                      isHighlighted
                        ? 'ring-2 ring-[#245237]/30 dark:ring-[#21afc2]/40'
                        : ''
                    }`}
                  >
                    {/* Accordion Trigger Header */}
                    <button
                      type="button"
                      onClick={() => toggleItem(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${faq.id}`}
                      className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <span className="mt-0.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#0b1320] border border-slate-200/80 dark:border-slate-800 text-[11px] font-mono font-bold text-[#245237] dark:text-[#21afc2] shrink-0">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#245237] dark:text-[#21afc2]">
                              {getCategoryIcon(faq.category)}
                              <span>{faq.category}</span>
                            </span>
                            {faq.deliverableTag && (
                              <>
                                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                  {faq.deliverableTag}
                                </span>
                              </>
                            )}
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-[#15233c] dark:text-white leading-snug font-display">
                            {faq.question}
                          </h3>
                        </div>
                      </div>

                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                          isOpen
                            ? 'bg-[#245237] dark:bg-[#21afc2] text-white dark:text-[#070d18] border-[#245237] dark:border-[#21afc2] rotate-180'
                            : 'bg-slate-50 dark:bg-[#0b1320] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {/* Expandable Answer Content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${faq.id}`}
                          key={`panel-${faq.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-slate-200/70 dark:border-slate-800/80">
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
                              {faq.answer}
                            </p>

                            {/* Key Consulting Takeaways & Deliverables */}
                            {faq.keyTakeaways && faq.keyTakeaways.length > 0 && (
                              <div className="mt-4 p-4 rounded-xl bg-white dark:bg-[#0b1320]/90 border border-slate-200/80 dark:border-slate-800/90">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                                  Key Engineering & Commercial Deliverables
                                </div>
                                <ul className="space-y-2">
                                  {faq.keyTakeaways.map((point, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2] shrink-0 mt-0.5" />
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Deep-Link Action Footer */}
                            {faq.relatedView && (
                              <div className="mt-4 flex items-center justify-between gap-4 pt-2">
                                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                                  Bombheq Advisory Practice Standard
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveView(faq.relatedView!);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#245237] dark:text-[#21afc2] hover:underline cursor-pointer"
                                >
                                  <span>{faq.relatedLabel || 'Learn More'}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
