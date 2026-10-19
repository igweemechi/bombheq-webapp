import React from 'react';
import { useContent } from '../../context/ContentContext';
import { useTheme } from '../../context/ThemeContext';
import { MapPin, Phone, Mail, ArrowUp, Sun, Moon, Bot } from 'lucide-react';

interface FooterProps {
  onOpenChat?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenChat }) => {
  const { content, setActiveView } = useContent();
  const { theme, toggleTheme } = useTheme();

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#15233c] dark:bg-[#070d18] text-slate-300 pt-16 pb-12 border-t border-slate-800 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={content.company.logoWhite}
                alt={content.company.name}
                className="h-9 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-xl font-bold text-white tracking-tight font-display">
                {content.company.name}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {content.footer.tagline}
            </p>

            <div className="pt-2 text-xs text-slate-400">
              <p className="text-[11px] text-slate-400">
                Global engineering intelligence & transaction advisory.
              </p>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {content.footer.quickLinks.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleNavClick(link.path)}
                    className="hover:text-white dark:hover:text-[#21afc2] transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Head Office
            </h4>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#21afc2] shrink-0 mt-0.5" />
                <span>{content.company.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#21afc2] shrink-0" />
                <a 
                  href={`tel:${content.company.phone.replace(/[^0-9+]/g, '')}`} 
                  className="hover:text-white dark:hover:text-[#21afc2] transition-colors tabular-nums"
                >
                  {content.company.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#21afc2] shrink-0" />
                <a 
                  href={`mailto:${content.company.email}`} 
                  className="hover:text-white dark:hover:text-[#21afc2] transition-colors"
                >
                  {content.company.email}
                </a>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-2.5">
              {onOpenChat && (
                <button
                  onClick={onOpenChat}
                  className="inline-flex items-center gap-1.5 text-[11px] text-[#245237] dark:text-[#21afc2] hover:text-white transition-colors border border-[#245237]/40 dark:border-[#21afc2]/40 rounded-lg px-2.5 py-1.5 cursor-pointer bg-[#245237]/10 dark:bg-[#21afc2]/10 hover:bg-[#245237]"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Support</span>
                </button>
              )}

              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white transition-colors border border-slate-700/80 rounded-lg px-2.5 py-1.5 cursor-pointer bg-slate-900/60 hover:bg-slate-800"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-amber-300" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                <span className="capitalize">{theme}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} {content.footer.copyrightText}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavClick('contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Probity & Terms
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white dark:hover:text-[#21afc2] transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
