export interface SocialLinks {
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  affiliation: string;
  address: string;
  addressShort: string;
  phone: string;
  email: string;
  hours: string;
  logoPrimary: string;
  logoWhite: string;
  favicon: string;
  socials: SocialLinks;
}

export interface NavLinkItem {
  id: string;
  label: string;
  path: string;
  hasDropdown?: boolean;
}

export interface HeroSlide {
  id: string;
  kicker: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  bgImage: string;
}

export interface MetricItem {
  id: string;
  label: string;
  value: string;
  subtext: string;
}

export interface ValueProposition {
  badge: string;
  title: string;
  description: string;
  secondaryDescription: string;
  image: string;
  metrics: MetricItem[];
}

export interface AdvisoryService {
  id: string;
  shortName: string;
  name: string;
  kicker: string;
  headline: string;
  summary: string;
  fullDescription: string;
  metricsText: string;
  metricsLabel: string;
  image: string;
  iconName: string;
  bulletPoints: string[];
  methodologySteps?: {
    step: string;
    title: string;
    description: string;
  }[];
}

export interface ProjectMilestone {
  id: string;
  phase: string;
  title: string;
  period: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  deliverable: string;
  description: string;
  keyMetric?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  value: string;
  completionDate: string;
  category: string;
  summary: string;
  description: string;
  image: string;
  keyOutcomes: string[];
  milestones?: ProjectMilestone[];
}

export interface SkillMetric {
  axis: string;
  shortLabel: string;
  score: number;
  benchmark?: number;
  description?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialization: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  yearsExperience?: string;
  keyCredentials?: string[];
  skillMatrix?: SkillMetric[];
}

export interface CareersContent {
  kicker: string;
  title: string;
  description: string;
  affiliationNotice: string;
  image: string;
  ctaText: string;
  openPositions: {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
  }[];
}

export interface ContactContent {
  title: string;
  subtitle: string;
  intro: string;
  officeAddress: string;
  phone: string;
  email: string;
  hours: string;
  mapEmbedUrl: string;
}

export interface FooterContent {
  tagline: string;
  copyrightText: string;
  quickLinks: { label: string; path: string }[];
}

export interface FaqItem {
  id: string;
  category: 'Strategy & Policy' | 'Procurement & PPP' | 'Commercial & Delivery' | 'Engagement & Disputes';
  question: string;
  answer: string;
  keyTakeaways?: string[];
  deliverableTag?: string;
  relatedView?: string;
  relatedLabel?: string;
}

export interface SiteContent {
  version: string;
  lastUpdated: string;
  company: CompanyInfo;
  navigation: {
    links: NavLinkItem[];
    ctaButton: {
      label: string;
      actionView: string;
    };
  };
  hero: {
    slides: HeroSlide[];
    autoPlayIntervalMs: number;
  };
  valueProposition: ValueProposition;
  services: AdvisoryService[];
  caseStudies: CaseStudy[];
  team: {
    kicker: string;
    title: string;
    description: string;
    members: TeamMember[];
  };
  careers: CareersContent;
  contact: ContactContent;
  footer: FooterContent;
  faqs?: FaqItem[];
}
