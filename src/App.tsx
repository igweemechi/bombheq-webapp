import React, { useState, useEffect } from 'react';
import { ContentProvider, useContent } from './context/ContentContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { BreadcrumbBar } from './components/layout/BreadcrumbBar';
import { Footer } from './components/layout/Footer';
import { HeroSlider } from './components/home/HeroSlider';
import { OverviewSection } from './components/home/OverviewSection';
import { CaseStudiesSection } from './components/home/CaseStudiesSection';
import { TeamSection } from './components/home/TeamSection';
import { FaqSection } from './components/home/FaqSection';
import { CareersSection } from './components/home/CareersSection';
import { ServicesPage } from './components/pages/ServicesPage';
import { StrategyPage } from './components/pages/StrategyPage';
import { TransactionPage } from './components/pages/TransactionPage';
import { CaseStudiesPage } from './components/pages/CaseStudiesPage';
import { TeamPage } from './components/pages/TeamPage';
import { ContactPage } from './components/pages/ContactPage';
import { PageTransition } from './components/ui/PageTransition';
import { ScrollProgressBar } from './components/ui/ScrollProgressBar';
import { ChatbotWidget } from './components/chat/ChatbotWidget';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { CheckCircle2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeView, toastMessage } = useContent();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  const renderCurrentView = () => {
    switch (activeView) {
      case 'services':
        return <ServicesPage />;
      case 'strategy':
        return <StrategyPage />;
      case 'transaction':
        return <TransactionPage />;
      case 'cases':
        return <CaseStudiesPage />;
      case 'team':
        return <TeamPage />;
      case 'contact':
        return <ContactPage />;
      case 'home':
      default:
        return (
          <>
            <HeroSlider />
            <OverviewSection />
            <CaseStudiesSection />
            <TeamSection />
            <FaqSection onOpenChat={() => setIsChatOpen(true)} />
            <CareersSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7fc] dark:bg-[#070d18] text-[#15233c] dark:text-slate-100 antialiased transition-colors duration-300">
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Subtle Top Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Top Navbar with Global Search (Cmd/Ctrl+K) and Theme Toggle */}
      <Navbar 
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Global SPA Hierarchy & Section Breadcrumb Bar */}
      <BreadcrumbBar />

      {/* Global Site Search Modal (Cmd/Ctrl + K) */}
      <GlobalSearchModal
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main View Area with 3D Page Transitions */}
      <main className="flex-1">
        <PageTransition viewKey={activeView}>
          {renderCurrentView()}
        </PageTransition>
      </main>

      {/* Footer */}
      <Footer 
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Intelligent AI Customer Support Bot Widget (Bottom Right) */}
      <ChatbotWidget
        isOpen={isChatOpen}
        onToggleOpen={setIsChatOpen}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-2.5 bg-slate-900/95 dark:bg-[#111C2E]/95 backdrop-blur-md text-white text-xs font-medium rounded-full shadow-2xl border border-slate-700/80 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ContentProvider>
        <MainLayout />
      </ContentProvider>
    </ThemeProvider>
  );
}
