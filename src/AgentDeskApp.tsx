import React, { useState } from 'react';
import { ContentProvider, useContent } from './context/ContentContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChatbotAdminDashboard } from './components/chat/ChatbotAdminDashboard';
import { ChatbotWidget } from './components/chat/ChatbotWidget';
import { ContentManagerDrawer } from './components/cms/ContentManagerDrawer';
import { CheckCircle2 } from 'lucide-react';

interface AgentDeskLayoutProps {
  onReturnToSite?: () => void;
}

const AgentDeskLayout: React.FC<AgentDeskLayoutProps> = ({ onReturnToSite }) => {
  const { toggleCms, toastMessage } = useContent();
  const [isTestChatOpen, setIsTestChatOpen] = useState(false);

  const handleGoToWebsite = () => {
    if (onReturnToSite) {
      onReturnToSite();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7fc] dark:bg-[#070d18] text-[#15233c] dark:text-slate-100 antialiased">
      {/* Full-Screen Standalone Agent Desk & Operations Dashboard */}
      <ChatbotAdminDashboard
        isOpen={true}
        standalone={true}
        onClose={handleGoToWebsite}
        onOpenCms={toggleCms}
        onOpenClientChat={() => setIsTestChatOpen(true)}
      />

      {/* Headless CMS & Site JSON Manager Drawer */}
      <ContentManagerDrawer />

      {/* Optional Client Chat Preview Widget for Admin Testing */}
      <ChatbotWidget
        isOpen={isTestChatOpen}
        onToggleOpen={setIsTestChatOpen}
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

export interface AgentDeskAppProps {
  onReturnToSite?: () => void;
}

export default function AgentDeskApp({ onReturnToSite }: AgentDeskAppProps) {
  return (
    <ThemeProvider>
      <ContentProvider>
        <AgentDeskLayout onReturnToSite={onReturnToSite} />
      </ContentProvider>
    </ThemeProvider>
  );
}
