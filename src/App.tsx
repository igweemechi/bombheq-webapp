import React, { useState } from 'react';
import { ContentProvider, useContent } from './context/ContentContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { BreadcrumbBar } from './components/layout/BreadcrumbBar';
import { Footer } from './components/layout/Footer';
import { HeroSlider } from './components/home/HeroSlider';
import { OverviewSection } from './components/home/OverviewSection';
import { ServicesSection } from './components/home/ServicesSection';
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
import { ChatbotAdminDashboard } from './components/chat/ChatbotAdminDashboard';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { CheckCircle2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeView, toastMessage } = useContent();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

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
            <ServicesSection />
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
      {/* Subtle Top Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Top Navbar with Global Search (Cmd/Ctrl+K), Theme Toggle and Agent Desk */}
      <Navbar 
        onOpenChat={() => setIsChatOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Global SPA Hierarchy & Section Breadcrumb Bar */}
      <BreadcrumbBar />

      {/* Global Site Search Modal (Cmd/Ctrl + K) */}
      <GlobalSearchModal
        onOpenChat={() => setIsChatOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
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
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Intelligent AI Customer Support Bot Widget (Bottom Right) */}
      <ChatbotWidget
        isOpen={isChatOpen}
        onToggleOpen={setIsChatOpen}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Chatbot Admin & Agent Operations Dashboard Modal */}
      <ChatbotAdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onOpenClientChat={() => {
          setIsAdminOpen(false);
          setIsChatOpen(true);
        }}
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
