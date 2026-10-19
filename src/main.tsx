import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AgentDeskApp from './AgentDeskApp.tsx';
import './index.css';

(window as any).gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
};
const origError = console.error;
console.error = (...args: unknown[]) => {
  origError.apply(console, args);
  const msg = args.map((a) => String(a)).join(' ');
  if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
};

function checkIsAgentDeskUrl(): boolean {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = new URLSearchParams(window.location.search);
  return (
    path === '/agent-desk' ||
    path === '/agent-desk/' ||
    path === '/agent-desk.html' ||
    path === '/admin' ||
    path === '/admin/' ||
    hash === '#agent-desk' ||
    hash === '#admin' ||
    search.has('agent-desk') ||
    search.get('portal') === 'agent-desk'
  );
}

const RootRouter: React.FC = () => {
  const [isAgentDesk, setIsAgentDesk] = useState<boolean>(checkIsAgentDeskUrl);

  useEffect(() => {
    const syncRoute = () => setIsAgentDesk(checkIsAgentDeskUrl());
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);

    // Owner keyboard shortcut: Ctrl+Shift+A / Cmd+Shift+A to switch to standalone Agent Desk
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAgentDesk((prev) => {
          const next = !prev;
          window.history.pushState({}, '', next ? '/agent-desk' : '/');
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (isAgentDesk) {
    return (
      <AgentDeskApp
        onReturnToSite={() => {
          window.history.pushState({}, '', '/');
          setIsAgentDesk(false);
        }}
      />
    );
  }

  return <App />;
};

createRoot(document.getElementById('root')!).render(<RootRouter />);

