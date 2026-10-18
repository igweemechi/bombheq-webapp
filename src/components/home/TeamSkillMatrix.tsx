import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';
import * as d3 from 'd3';
import { TeamMember, SkillMetric } from '../../types/content';
import { useTheme } from '../../context/ThemeContext';
import {
  Radar as RadarIcon,
  Layers,
  GitCompare,
  Award,
  Sparkles,
  CheckCircle2,
  BarChart3,
  Users
} from 'lucide-react';

interface TeamSkillMatrixProps {
  members: TeamMember[];
  selectedMemberId: string;
  onSelectMember: (id: string) => void;
}

const DEFAULT_AXES: SkillMetric[] = [
  {
    axis: 'Strategy & Policy',
    shortLabel: 'Strategy',
    score: 88,
    benchmark: 82,
    description: 'Cabinet-level business cases, multimodal network masterplanning, and statutory reform.'
  },
  {
    axis: 'Procurement & PPP',
    shortLabel: 'Procurement',
    score: 88,
    benchmark: 80,
    description: 'Market sounding, collaborative contracting, and multi-billion-dollar packaging strategy.'
  },
  {
    axis: 'Commercial Governance',
    shortLabel: 'Commercial',
    score: 92,
    benchmark: 84,
    description: 'Executive board assurance, sovereign risk allocation, and investment gate reviews.'
  },
  {
    axis: 'Forensic & Disputes',
    shortLabel: 'Disputes',
    score: 84,
    benchmark: 75,
    description: 'Independent expert witness testimony, claims resolution, and delay analysis.'
  },
  {
    axis: 'Energy & Decarbonisation',
    shortLabel: 'Energy',
    score: 85,
    benchmark: 78,
    description: 'Renewable Energy Zones, transmission corridors, and net-zero fleet transition.'
  },
  {
    axis: 'Rail & Civil Systems',
    shortLabel: 'Systems',
    score: 90,
    benchmark: 85,
    description: 'High-speed rail corridors, TBM underground caverns, and ETCS systems integration.'
  }
];

export const MiniMemberRadar: React.FC<{
  skills?: SkillMetric[];
  isSelected?: boolean;
}> = ({ skills, isSelected }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const data = skills && skills.length > 0 ? skills : DEFAULT_AXES;

  const { polygonPath, gridPolygons, axesLines } = useMemo(() => {
    const size = 68;
    const center = size / 2;
    const radius = 26;
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);
    const total = data.length;

    const getCoords = (value: number, i: number) => {
      const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
      const r = rScale(value);
      return [center + r * Math.cos(angle), center + r * Math.sin(angle)] as [number, number];
    };

    const points = data.map((d, i) => getCoords(d.score, i));
    const lineGen = d3.line<[number, number]>().x(d => d[0]).y(d => d[1]).curve(d3.curveLinearClosed);

    const grids = [50, 100].map(level => {
      const pts = data.map((_, i) => getCoords(level, i));
      return lineGen(pts) || '';
    });

    const lines = data.map((_, i) => {
      const [x, y] = getCoords(100, i);
      return { x1: center, y1: center, x2: x, y2: y };
    });

    return {
      polygonPath: lineGen(points) || '',
      gridPolygons: grids,
      axesLines: lines
    };
  }, [data]);

  const strokeColor = isSelected
    ? isDark ? '#21afc2' : '#245237'
    : isDark ? '#38bdf8' : '#245237';

  return (
    <svg width={68} height={68} viewBox="0 0 68 68" className="shrink-0 overflow-visible" aria-hidden="true">
      {gridPolygons.map((path, idx) => (
        <path
          key={idx}
          d={path}
          fill="none"
          stroke={isDark ? '#1e293b' : '#e2e8f0'}
          strokeWidth={1}
        />
      ))}
      {axesLines.map((l, idx) => (
        <line
          key={idx}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={isDark ? '#1e293b' : '#e2e8f0'}
          strokeWidth={0.75}
        />
      ))}
      <path
        d={polygonPath}
        fill={strokeColor}
        fillOpacity={isSelected ? 0.32 : 0.2}
        stroke={strokeColor}
        strokeWidth={1.75}
      />
    </svg>
  );
};

export const TeamSkillMatrix: React.FC<TeamSkillMatrixProps> = ({
  members,
  selectedMemberId,
  onSelectMember
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [compareMemberId, setCompareMemberId] = useState<string>('benchmark');
  const [activeAxis, setActiveAxis] = useState<string | null>(null);
  const [chartMode, setChartMode] = useState<'recharts-radar' | 'd3-matrix'>('recharts-radar');

  const primaryMember = useMemo(
    () => members.find(m => m.id === selectedMemberId) || members[0],
    [members, selectedMemberId]
  );

  const secondaryMember = useMemo(
    () => (compareMemberId !== 'benchmark' && compareMemberId !== 'composite'
      ? members.find(m => m.id === compareMemberId) || null
      : null),
    [members, compareMemberId]
  );

  // Build unified radar dataset using D3 statistics across the team
  const radarData = useMemo(() => {
    const baseSkills = primaryMember?.skillMatrix?.length
      ? primaryMember.skillMatrix
      : DEFAULT_AXES;

    return baseSkills.map((skill, idx) => {
      const allScoresForAxis = members.map(
        m => m.skillMatrix?.[idx]?.score ?? DEFAULT_AXES[idx]?.score ?? 85
      );
      const teamCompositeMax = d3.max(allScoresForAxis) ?? 95;
      const teamMean = Math.round(d3.mean(allScoresForAxis) ?? 86);
      const compareScore =
        compareMemberId === 'benchmark'
          ? skill.benchmark ?? 80
          : compareMemberId === 'composite'
          ? teamCompositeMax
          : secondaryMember?.skillMatrix?.[idx]?.score ?? 85;

      return {
        axis: skill.axis,
        shortLabel: skill.shortLabel,
        primaryScore: skill.score,
        compareScore,
        benchmark: skill.benchmark ?? 80,
        teamMean,
        teamMax: teamCompositeMax,
        description: skill.description || ''
      };
    });
  }, [primaryMember, secondaryMember, compareMemberId, members]);

  // Compute D3 polygon coverage index and peak domain metrics
  const d3Metrics = useMemo(() => {
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, 1]);
    const total = radarData.length;

    const getUnitPolygon = (key: 'primaryScore' | 'compareScore') =>
      radarData.map((d, i) => {
        const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
        const r = rScale(d[key]);
        return [r * Math.cos(angle), r * Math.sin(angle)] as [number, number];
      });

    const maxPolygon = radarData.map((_, i) => {
      const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
      return [Math.cos(angle), Math.sin(angle)] as [number, number];
    });

    const maxArea = Math.abs(d3.polygonArea(maxPolygon)) || 1;
    const primaryArea = Math.abs(d3.polygonArea(getUnitPolygon('primaryScore')));
    const coverageIndex = Math.round(Math.sqrt(primaryArea / maxArea) * 100);

    const avgScore = Math.round(d3.mean(radarData, d => d.primaryScore) ?? 90);
    const topDomain = [...radarData].sort((a, b) => b.primaryScore - a.primaryScore)[0];

    return {
      coverageIndex,
      avgScore,
      topDomain
    };
  }, [radarData]);

  // Focused axis detail (either hovered/clicked axis or member's strongest domain)
  const focusedAxisDetail = useMemo(() => {
    if (activeAxis) {
      const found = radarData.find(d => d.axis === activeAxis || d.shortLabel === activeAxis);
      if (found) return found;
    }
    return d3Metrics.topDomain || radarData[0];
  }, [activeAxis, radarData, d3Metrics.topDomain]);

  // Colors adapted for light/dark theme
  const primaryColor = isDark ? '#21afc2' : '#245237';
  const compareColor = isDark ? '#f59e0b' : '#0284c7';
  const gridStroke = isDark ? '#1e293b' : '#cbd5e1';
  const labelColor = isDark ? '#e2e8f0' : '#1e293b';

  // D3 heat scale for matrix table
  const heatScale = useMemo(
    () => d3.scaleLinear<string>()
      .domain([70, 88, 100])
      .range(
        isDark
          ? ['rgba(30, 41, 59, 0.7)', 'rgba(33, 175, 194, 0.28)', 'rgba(33, 175, 194, 0.55)']
          : ['rgba(241, 245, 249, 0.9)', 'rgba(36, 82, 55, 0.16)', 'rgba(36, 82, 55, 0.34)']
      ),
    [isDark]
  );

  if (!primaryMember) return null;

  const compareLabel =
    compareMemberId === 'benchmark'
      ? 'Industry Practice Benchmark'
      : compareMemberId === 'composite'
      ? 'Bombheq All-Partners Composite'
      : secondaryMember?.name || 'Comparison';

  return (
    <div
      id="team-skill-matrix"
      className="mt-14 bg-white dark:bg-[#111C2E] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300"
    >
      {/* Top Control Header Bar */}
      <div className="p-6 sm:p-8 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0b1320]/70">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-1.5">
              <RadarIcon className="w-3.5 h-3.5" />
              <span>Interactive Competency Telemetry · Recharts & D3 Matrix</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#15233c] dark:text-white tracking-tight font-display">
              Leadership Advisory Skill Matrix
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Inspect quantitative areas of expertise across our senior leadership team, overlay partner profiles for multidisciplinary project fit, or explore the full cross-practice competency matrix.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            <div className="inline-flex p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/90 border border-slate-300/60 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setChartMode('recharts-radar')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  chartMode === 'recharts-radar'
                    ? 'bg-white dark:bg-[#15233c] text-[#245237] dark:text-[#21afc2] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <RadarIcon className="w-3.5 h-3.5" />
                <span>Interactive Radar</span>
              </button>
              <button
                type="button"
                onClick={() => setChartMode('d3-matrix')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  chartMode === 'd3-matrix'
                    ? 'bg-white dark:bg-[#15233c] text-[#245237] dark:text-[#21afc2] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Full Team Matrix (D3)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Member Selector & Comparison Controls */}
        <div className="mt-6 pt-5 border-t border-slate-200/70 dark:border-slate-800/80 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Primary Member Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">
              Primary Advisor:
            </span>
            {members.map(member => {
              const active = member.id === primaryMember.id;
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => onSelectMember(member.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    active
                      ? 'bg-[#245237] dark:bg-[#21afc2] text-white dark:text-[#070d18] border-[#245237] dark:border-[#21afc2] shadow-xs'
                      : 'bg-white dark:bg-[#111C2E] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#245237]/50 dark:hover:border-[#21afc2]/50'
                  }`}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-5 h-5 rounded-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                  <span>{member.name}</span>
                </button>
              );
            })}
          </div>

          {/* Overlay Comparison Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <GitCompare className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />
              <span>Overlay Comparison:</span>
            </div>
            <select
              aria-label="Select comparison benchmark or partner"
              value={compareMemberId}
              onChange={e => setCompareMemberId(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#111C2E] text-[#15233c] dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#245237] dark:focus:border-[#21afc2] cursor-pointer"
            >
              <option value="benchmark">Industry Practice Benchmark</option>
              <option value="composite">All-Partners Composite Peak</option>
              {members
                .filter(m => m.id !== primaryMember.id)
                .map(m => (
                  <option key={m.id} value={m.id}>
                    Compare vs. {m.name} ({m.role})
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {chartMode === 'recharts-radar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 dark:divide-slate-800">
          {/* Left 7 Cols: Interactive Recharts Radar Visualization */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-white to-slate-50/50 dark:from-[#111C2E] dark:to-[#0c1524]">
            {/* Legend & Telemetry Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="inline-flex items-center gap-2 font-bold text-[#15233c] dark:text-white">
                  <span
                    className="w-3 h-3 rounded-xs inline-block"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <span>{primaryMember.name}</span>
                </div>
                <div className="inline-flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
                  <span
                    className="w-3 h-0.5 inline-block border-t-2 border-dashed"
                    style={{ borderColor: compareColor }}
                  />
                  <span>{compareLabel}</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-3 text-xs">
                <div className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-mono">
                  Mean: <strong className="text-[#245237] dark:text-[#21afc2]">{d3Metrics.avgScore}/100</strong>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-mono">
                  D3 Coverage: <strong className="text-[#245237] dark:text-[#21afc2]">{d3Metrics.coverageIndex}%</strong>
                </div>
              </div>
            </div>

            {/* Recharts RadarChart Container */}
            <div className="w-full h-[360px] sm:h-[400px] select-none">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="73%"
                  data={radarData}
                  onMouseMove={(state: any) => {
                    if (state && state.activeLabel) {
                      setActiveAxis(String(state.activeLabel));
                    }
                  }}
                >
                  <PolarGrid stroke={gridStroke} strokeDasharray="3 3" />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={({ payload, x, y, textAnchor }: any) => {
                      const isSelectedAxis = focusedAxisDetail?.axis === payload.value;
                      return (
                        <g
                          className="cursor-pointer"
                          onClick={() => setActiveAxis(payload.value)}
                        >
                          <text
                            x={x}
                            y={y}
                            textAnchor={textAnchor}
                            fill={isSelectedAxis ? primaryColor : labelColor}
                            fontSize={11}
                            fontWeight={isSelectedAxis ? 800 : 600}
                          >
                            {payload.value}
                          </text>
                        </g>
                      );
                    }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tickCount={5}
                    tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }}
                    axisLine={false}
                  />
                  <Radar
                    name={compareLabel}
                    dataKey="compareScore"
                    stroke={compareColor}
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    fill={compareColor}
                    fillOpacity={0.12}
                    isAnimationActive={true}
                  />
                  <Radar
                    name={primaryMember.name}
                    dataKey="primaryScore"
                    stroke={primaryColor}
                    strokeWidth={2.75}
                    fill={primaryColor}
                    fillOpacity={0.32}
                    dot={{
                      r: 4,
                      fill: primaryColor,
                      stroke: isDark ? '#070d18' : '#ffffff',
                      strokeWidth: 1.5
                    }}
                    activeDot={{
                      r: 6,
                      fill: primaryColor,
                      stroke: '#ffffff',
                      strokeWidth: 2
                    }}
                    isAnimationActive={true}
                  />
                  <Tooltip
                    content={({ active, payload }: any) => {
                      if (!active || !payload || !payload.length) return null;
                      const item = payload[0]?.payload;
                      if (!item) return null;
                      return (
                        <div className="p-3.5 rounded-xl bg-white/95 dark:bg-[#0b1320]/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl max-w-xs">
                          <div className="text-xs font-bold text-[#15233c] dark:text-white mb-1.5 font-display">
                            {item.axis}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2.5">
                            {item.description}
                          </p>
                          <div className="space-y-1 text-xs font-mono">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[#245237] dark:text-[#21afc2] font-semibold">
                                {primaryMember.name}:
                              </span>
                              <span className="font-bold text-[#15233c] dark:text-white">
                                {item.primaryScore} / 100
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-sky-600 dark:text-amber-400 font-medium">
                                {compareLabel}:
                              </span>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {item.compareScore} / 100
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Interactive Domain Inspection Strip */}
            <div className="mt-2 p-4 rounded-xl bg-slate-100/80 dark:bg-[#0b1320] border border-slate-200/80 dark:border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#15233c] dark:text-white">
                    {focusedAxisDetail.axis}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#245237] dark:text-[#21afc2]">
                    {focusedAxisDetail.primaryScore}/100
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {focusedAxisDetail.description}
                </p>
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                Delta vs. Benchmark:{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">
                  +{focusedAxisDetail.primaryScore - focusedAxisDetail.benchmark} pts
                </strong>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Member Profile & Quantitative Breakdown Bars */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Selected Member Header */}
              <div className="flex items-start gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800">
                <img
                  src={primaryMember.image}
                  alt={primaryMember.name}
                  className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-[#245237]/30 dark:border-[#21afc2]/40 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-lg font-bold text-[#15233c] dark:text-white font-display truncate">
                      {primaryMember.name}
                    </h4>
                    {primaryMember.yearsExperience && (
                      <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-[#245237] dark:text-[#21afc2] border border-emerald-200/60 dark:border-emerald-800/50 rounded-md shrink-0">
                        {primaryMember.yearsExperience}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#245237] dark:text-[#21afc2] mt-0.5">
                    {primaryMember.role} · {primaryMember.specialization}
                  </p>

                  {/* Credentials */}
                  {primaryMember.keyCredentials && primaryMember.keyCredentials.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {primaryMember.keyCredentials.map((cred, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          <Award className="w-2.5 h-2.5 text-[#245237] dark:text-[#21afc2]" />
                          {cred}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive 6-Axis Competency Bars */}
              <div className="mt-5 space-y-3.5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <span>Competency Domain (Click to Inspect)</span>
                  <span>Score vs. Overlay</span>
                </div>

                {radarData.map(item => {
                  const isFocused = focusedAxisDetail.axis === item.axis;
                  const diff = item.primaryScore - item.compareScore;
                  return (
                    <button
                      key={item.axis}
                      type="button"
                      onClick={() => setActiveAxis(item.axis)}
                      onMouseEnter={() => setActiveAxis(item.axis)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isFocused
                          ? 'bg-emerald-50/60 dark:bg-slate-800/90 border-[#245237]/40 dark:border-[#21afc2]/50'
                          : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-[#15233c] dark:text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />
                          {item.axis}
                        </span>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="font-bold text-[#245237] dark:text-[#21afc2]">
                            {item.primaryScore}%
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded ${
                              diff >= 0
                                ? 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                                : 'bg-amber-100/80 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {diff >= 0 ? `+${diff}` : diff}
                          </span>
                        </div>
                      </div>

                      {/* Dual-Layer Progress Track */}
                      <div className="relative h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.primaryScore}%`,
                            backgroundColor: primaryColor
                          }}
                        />
                        {/* Comparison Marker Tick */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-amber-500 dark:bg-amber-400"
                          style={{ left: `${item.compareScore}%` }}
                          title={`${compareLabel}: ${item.compareScore}%`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Summary Callout */}
            <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Primary Strength: <strong className="text-[#15233c] dark:text-white">{d3Metrics.topDomain?.axis}</strong></span>
              <span className="font-mono text-[#245237] dark:text-[#21afc2] font-semibold">
                {d3Metrics.topDomain?.primaryScore}/100 Peak Index
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Full Team Cross-Practice D3 Competency Matrix Table */
        <div className="p-6 sm:p-8 overflow-x-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h4 className="text-base font-bold text-[#15233c] dark:text-white font-display flex items-center gap-2">
                <Users className="w-4 h-4 text-[#245237] dark:text-[#21afc2]" />
                <span>Cross-Practice Multidisciplinary Coverage Matrix (D3 Scale)</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Click any partner row to focus their individual radar telemetry. Cell shading is scaled via <code className="font-mono">d3.scaleLinear</code>.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
              <span>Legend:</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">70–84 Core</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100/70 dark:bg-cyan-950/70 text-[#245237] dark:text-[#21afc2] font-bold">
                90–99 Practice Lead
              </span>
            </div>
          </div>

          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="py-3 pr-4">Team Member & Role</th>
                {DEFAULT_AXES.map(axis => (
                  <th key={axis.axis} className="py-3 px-2.5 text-center">
                    {axis.shortLabel}
                  </th>
                ))}
                <th className="py-3 pl-4 text-right">D3 Mean</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/80 text-xs">
              {members.map(member => {
                const skills = member.skillMatrix?.length ? member.skillMatrix : DEFAULT_AXES;
                const meanScore = Math.round(d3.mean(skills, s => s.score) ?? 88);
                const isSelected = member.id === primaryMember.id;

                return (
                  <tr
                    key={member.id}
                    onClick={() => {
                      onSelectMember(member.id);
                      setChartMode('recharts-radar');
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/50 dark:bg-slate-800/60'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-9 h-9 rounded-xl object-cover object-top shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-[#15233c] dark:text-white flex items-center gap-1.5">
                            <span>{member.name}</span>
                            {isSelected && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#245237] dark:bg-[#21afc2] text-white dark:text-[#070d18] font-semibold">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {member.role} · {member.specialization}
                          </div>
                        </div>
                      </div>
                    </td>

                    {skills.map(skill => (
                      <td key={skill.axis} className="p-1.5 text-center">
                        <div
                          className="py-2 px-2 rounded-lg font-mono font-bold text-[#15233c] dark:text-white transition-transform hover:scale-105"
                          style={{ backgroundColor: heatScale(skill.score) }}
                          title={`${member.name} — ${skill.axis}: ${skill.score}/100`}
                        >
                          {skill.score}
                        </div>
                      </td>
                    ))}

                    <td className="py-3.5 pl-4 text-right font-mono font-extrabold text-[#245237] dark:text-[#21afc2]">
                      {meanScore}%
                    </td>
                  </tr>
                );
              })}

              {/* Firm Peak Coverage Row */}
              <tr className="bg-slate-50/90 dark:bg-[#0b1320] font-mono text-xs border-t-2 border-slate-300 dark:border-slate-700">
                <td className="py-3.5 pr-4 font-sans font-bold text-[#15233c] dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#245237] dark:text-[#21afc2]" />
                  <span>All-Partners Combined Peak Capacity</span>
                </td>
                {DEFAULT_AXES.map((axis, idx) => {
                  const peak = d3.max(
                    members.map(m => m.skillMatrix?.[idx]?.score ?? axis.score)
                  ) ?? 95;
                  return (
                    <td key={axis.axis} className="p-1.5 text-center font-extrabold text-[#245237] dark:text-[#21afc2]">
                      {peak}%
                    </td>
                  );
                })}
                <td className="py-3.5 pl-4 text-right font-extrabold text-[#245237] dark:text-[#21afc2]">
                  98%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
