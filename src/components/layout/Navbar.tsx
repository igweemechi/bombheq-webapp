import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Phone, 
  Mail, 
  Clock, 
  SlidersHorizontal, 
  Menu, 
  X, 
  ChevronRight,
  Sun,
  Moon,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onOpenAdmin?: () => void;
  onOpenChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onOpenChat }) => {
  const { content, activeView, setActiveView, toggleCms, isCmsOpen } = useContent();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-300">
      {/* Top Utility Bar (Contact info, Hours & Affiliation) */}
      <div className="bg-[#15233c] dark:bg-[#070d18] text-white/80 dark:text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 hidden md:block border-b border-white/5 dark:border-slate-800/80 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a 
              href={`tel:${content.company.phone.replace(/[^0-9+]/g, '')}`} 
              className="flex items-center gap-1.5 hover:text-white dark:hover:text-[#21afc2] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#21afc2]" />
              <span className="tabular-nums">{content.company.phone}</span>
            </a>
            <a 
              href={`mailto:${content.company.email}`} 
              className="flex items-center gap-1.5 hover:text-white dark:hover:text-[#21afc2] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#21afc2]" />
              <span>{content.company.email}</span>
            </a>
            <div className="flex items-center gap-1.5 text-white/60 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-[#21afc2]" />
              <span>{content.company.hours}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-white/70 dark:text-slate-400 text-[11px] font-medium tracking-wide">
              {content.company.affiliation}
            </span>
          </div>
        </div>
      </div>

      {/* Main Top Navigation - 3-Zone Contract with Glassmorphism */}
      <div className="bg-white/95 dark:bg-[#0B111E]/95 backdrop-blur-md shadow-xs dark:shadow-2xl border-b border-slate-200/80 dark:border-slate-800/90 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 lg:gap-8 h-20">
            
            {/* Zone 1: Brand Logo as Index Link (Image Only) */}
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center group shrink-0 cursor-pointer focus:outline-none py-1"
              aria-label={`${content.company.name} Home`}
            >
              <img 
                src={theme === 'dark' ? (content.company.logoWhite || content.company.logoPrimary) : content.company.logoPrimary} 
                alt={content.company.name} 
                className="h-11 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </button>

            {/* Zone 2: Navigation Links (single line, clean typography) */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
              {content.navigation.links.map(link => {
                const isActive = activeView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative py-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      isActive 
                        ? 'text-[#245237] dark:text-[#21afc2] font-semibold' 
                        : 'hover:text-[#245237] dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span 
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#245237] dark:bg-[#21afc2] rounded-full shadow-[0_0_8px_rgba(33,175,194,0.6)]" 
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Theme Toggle, CMS Switch & Primary Action */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              
              {/* Theme Toggle Button (Light / Dark) */}
              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="p-2 sm:px-2.5 sm:py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs group"
                title={`Current mode: ${theme}. Click to switch.`}
              >
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <AnimatePresence mode="wait" initial={false}>
                    {theme === 'dark' ? (
                      <motion.div
                        key="moon"
                        initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="sun"
                        initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>


              {/* Agent Operations Center Toggle */}
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                  title="Open AI Operations Center & Agent Takeover"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden lg:inline">Agent Desk</span>
                </button>
              )}

              {/* Headless CMS / JSON Editor Toggle */}
              <button
                onClick={toggleCms}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  isCmsOpen 
                    ? 'bg-[#245237] text-white border-[#245237] shadow-sm' 
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-[#245237] dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                }`}
                title="Open Headless CMS & JSON live editor"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CMS & JSON</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>

              {/* Primary Action Button with 3D Depth */}
              <button
                onClick={() => handleNavClick('contact')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:hover:bg-[#1994a5] dark:text-[#0b111e] rounded-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0 cursor-pointer shadow-xs hover:shadow-md font-medium"
              >
                {content.navigation.ctaButton.label}
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Dark Mode & Theme Toggle */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B111E] px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {content.navigation.links.map(link => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-50 dark:bg-slate-800/80 text-[#245237] dark:text-[#21afc2] font-semibold' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#245237] dark:text-[#21afc2]' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Interface Appearance
              </span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-amber-300" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </div>


            {onOpenAdmin && (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Agent Operations Center</span>
              </button>
            )}

            <button
              onClick={() => {
                toggleCms();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-[#245237] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Headless CMS & JSON Editor</span>
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-[#245237] dark:bg-[#21afc2] dark:text-[#0b111e] rounded-lg text-center cursor-pointer shadow-xs"
            >
              {content.navigation.ctaButton.label}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
