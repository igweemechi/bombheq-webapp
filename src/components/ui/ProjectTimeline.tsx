import React, { useState, useEffect, useRef } from 'react';
import { CaseStudy, ProjectMilestone } from '../../types/content';
import {
  CheckCircle2,
  Clock,
  CircleDot,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  FileCheck2,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectTimelineProps {
  project: CaseStudy;
  compact?: boolean;
}

function getFallbackMilestones(project: CaseStudy): ProjectMilestone[] {
  return [
    {
      id: `${project.id}-m1`,
      phase: 'Phase 01',
      title: 'Strategic Options & Corridor Definition',
      period: 'Stage 1 · Definition',
      status: 'completed',
      deliverable: 'Strategic Business Case',
      description: `Established investment objectives, demand modeling, and preliminary alignment options for ${project.title} with ${project.client}.`,
      keyMetric: `${project.value} Program Scope Defined`
    },
    {
      id: `${project.id}-m2`,
      phase: 'Phase 02',
      title: 'Commercial Structuring & Risk Matrix',
      period: 'Stage 2 · Structuring',
      status: 'completed',
      deliverable: 'Packaging & Risk Allocation Model',
      description: 'Conducted quantitative risk analysis, value-for-money assessment, and packaging options across civil and systems contracts.',
      keyMetric: '100% Gateway Assurance Compliance'
    },
    {
      id: `${project.id}-m3`,
      phase: 'Phase 03',
      title: 'Market Sounding & Collaborative Procurement',
      period: 'Stage 3 · Transaction',
      status: 'completed',
      deliverable: 'Tender Documentation & Probity Plan',
      description: 'Led structured market engagement, interactive tender workshops, and collaborative contract drafting.',
      keyMetric: 'Tier-1 Delivery Partners Engaged'
    },
    {
      id: `${project.id}-m4`,
      phase: 'Phase 04',
      title: 'Execution Governance & Interface Management',
      period: 'Stage 4 · Delivery',
      status: 'in-progress',
      deliverable: 'Commercial Governance Framework',
      description: 'Ongoing commercial advisory, variation assessment, and multi-agency interface management during active delivery.',
      keyMetric: project.completionDate
    },
    {
      id: `${project.id}-m5`,
      phase: 'Phase 05',
      title: 'Commissioning & Operational Handover',
      period: 'Stage 5 · Operations',
      status: 'upcoming',
      deliverable: 'Operational Readiness & Close-Out',
      description: 'Finalizing commercial close-out, whole-of-life asset transition, and benefits realization verification.',
      keyMetric: 'Long-Term Network Performance'
    }
  ];
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  project,
  compact = false
}) => {
  const milestones: ProjectMilestone[] =
    project.milestones && project.milestones.length > 0
      ? project.milestones
      : getFallbackMilestones(project);

  // Default to the active 'in-progress' phase if present, otherwise first phase
  const initialIdx = Math.max(
    0,
    milestones.findIndex(m => m.status === 'in-progress') !== -1
      ? milestones.findIndex(m => m.status === 'in-progress')
      : 0
  );

  const [activeIndex, setActiveIndex] = useState<number>(initialIdx);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Reset active index if project changes
  useEffect(() => {
    const inProgIdx = milestones.findIndex(m => m.status === 'in-progress');
    setActiveIndex(inProgIdx !== -1 ? inProgIdx : 0);
    setIsAutoPlaying(false);
  }, [project.id]);

  // Auto-play walkthrough timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % milestones.length);
    }, 3400);
    return () => clearInterval(timer);
  }, [isAutoPlaying, milestones.length]);

  // Keep selected node visible inside horizontal scroll container on mobile/tablet
  useEffect(() => {
    if (!trackRef.current) return;
    const nodeEl = trackRef.current.querySelector(`[data-milestone-idx="${activeIndex}"]`) as HTMLElement | null;
    if (nodeEl) {
      const container = trackRef.current;
      const targetLeft = nodeEl.offsetLeft - container.clientWidth / 2 + nodeEl.clientWidth / 2;
      container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    }
  }, [activeIndex]);

  const activeMilestone = milestones[activeIndex] || milestones[0];
  const progressPercentage =
    milestones.length > 1 ? (activeIndex / (milestones.length - 1)) * 100 : 100;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setIsAutoPlaying(false);
      setActiveIndex(prev => (prev + 1) % milestones.length);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setIsAutoPlaying(false);
      setActiveIndex(prev => (prev - 1 + milestones.length) % milestones.length);
    }
  };

  const getStatusLabel = (status: ProjectMilestone['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed Milestone';
      case 'in-progress':
        return 'Active Execution Phase';
      case 'upcoming':
      default:
        return 'Scheduled Phase';
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`${project.title} interactive execution timeline`}
      className={`w-full rounded-2xl bg-[#f6f7fc] dark:bg-[#070d18]/90 border border-slate-200/80 dark:border-slate-800/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#21afc2] transition-colors ${
        compact ? 'p-4 sm:p-5' : 'p-5 sm:p-7'
      }`}
    >
      {/* Header Bar: Title, Phase Counter & Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[#245237] dark:text-[#21afc2]">
              Execution Lifecycle & Milestones
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              Stage {activeIndex + 1} of {milestones.length}
            </span>
          </div>
          {!compact && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any horizontal phase node or use arrow keys to inspect deliverables and commercial milestones.
            </p>
          )}
        </div>

        {/* Interactive Stepper & Auto-Play Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsAutoPlaying(prev => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isAutoPlaying
                ? 'bg-[#245237] dark:bg-[#21afc2] text-white dark:text-[#070d18] border-transparent shadow-xs'
                : 'bg-white dark:bg-[#111C2E] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
            title={isAutoPlaying ? 'Pause automatic phase walkthrough' : 'Auto-play execution phases'}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Walkthrough</span>
              </>
            )}
          </button>

          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111C2E] p-0.5">
            <button
              type="button"
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveIndex(prev => (prev - 1 + milestones.length) % milestones.length);
              }}
              className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Previous milestone phase"
              title="Previous Phase"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveIndex(prev => (prev + 1) % milestones.length);
              }}
              className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Next milestone phase"
              title="Next Phase"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Timeline Track */}
      <div
        ref={trackRef}
        className="relative overflow-x-auto pb-3 pt-1 scrollbar-thin"
      >
        <div className="relative min-w-[640px] lg:min-w-full">
          {/* Background Horizontal Connecting Line */}
          <div
            className="absolute top-[19px] left-[10%] right-[10%] h-[3px] bg-slate-200 dark:bg-slate-800 rounded-full"
            aria-hidden="true"
          >
            {/* Animated Active Fill Bar */}
            <motion.div
              className="h-full bg-gradient-to-r from-[#245237] to-[#21afc2] rounded-full"
              initial={false}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* Milestone Nodes Grid */}
          <div
            className="relative grid gap-2"
            style={{ gridTemplateColumns: `repeat(${milestones.length}, minmax(0, 1fr))` }}
          >
            {milestones.map((milestone, idx) => {
              const isSelected = idx === activeIndex;
              const isPastOrCurrent = idx <= activeIndex;
              const isCompleted = milestone.status === 'completed';
              const isInProgress = milestone.status === 'in-progress';

              return (
                <button
                  key={milestone.id}
                  type="button"
                  data-milestone-idx={idx}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveIndex(idx);
                  }}
                  className="group flex flex-col items-center text-center px-2 focus:outline-none cursor-pointer"
                >
                  {/* Node Circle */}
                  <div className="relative flex items-center justify-center mb-3">
                    {isSelected && (
                      <motion.span
                        layoutId={`timeline-ring-${project.id}`}
                        className="absolute -inset-1.5 rounded-full bg-[#245237]/15 dark:bg-[#21afc2]/20 border border-[#245237]/40 dark:border-[#21afc2]/50"
                        transition={{ duration: 0.25 }}
                      />
                    )}
                    <div
                      className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#245237] dark:bg-[#21afc2] border-[#245237] dark:border-[#21afc2] text-white dark:text-[#070d18] scale-110 shadow-md'
                          : isPastOrCurrent
                          ? 'bg-white dark:bg-[#111C2E] border-[#245237] dark:border-[#21afc2] text-[#245237] dark:text-[#21afc2]'
                          : 'bg-white dark:bg-[#111C2E] border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-slate-400 dark:group-hover:border-slate-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isInProgress ? (
                        <CircleDot className="w-4 h-4 animate-pulse" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Phase Index & Period */}
                  <div className="flex items-center gap-1 text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    <span
                      className={
                        isSelected
                          ? 'font-bold text-[#245237] dark:text-[#21afc2]'
                          : 'font-medium'
                      }
                    >
                      {milestone.phase}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{milestone.period.split('–')[0].trim()}</span>
                  </div>

                  {/* Milestone Title */}
                  <span
                    className={`mt-1 text-xs font-display leading-snug line-clamp-2 transition-colors ${
                      isSelected
                        ? 'font-bold text-[#15233c] dark:text-white'
                        : 'font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
                    }`}
                  >
                    {milestone.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Milestone Detail Card */}
      {activeMilestone && (
        <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMilestone.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-white dark:bg-[#111C2E] p-4 sm:p-5 rounded-xl border border-slate-200/70 dark:border-slate-800/90"
            >
              {/* Left 8 Columns: Phase Details & Description */}
              <div className="lg:col-span-8 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono font-bold text-[#245237] dark:text-[#21afc2]">
                    {activeMilestone.phase}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{activeMilestone.period}</span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={`font-semibold ${
                      activeMilestone.status === 'completed'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : activeMilestone.status === 'in-progress'
                        ? 'text-[#21afc2]'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {getStatusLabel(activeMilestone.status)}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-[#15233c] dark:text-white font-display">
                  {activeMilestone.title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeMilestone.description}
                </p>
              </div>

              {/* Right 4 Columns: Deliverable & Quantified Milestone Metric */}
              <div className="lg:col-span-4 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-5 space-y-3">
                <div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />
                    <span>Primary Advisory Deliverable</span>
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#15233c] dark:text-white mt-0.5">
                    {activeMilestone.deliverable}
                  </p>
                </div>

                {activeMilestone.keyMetric && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Verified Phase Benchmark</span>
                    </span>
                    <p className="text-sm font-extrabold font-mono tabular-nums text-[#245237] dark:text-[#21afc2] mt-0.5">
                      {activeMilestone.keyMetric}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
