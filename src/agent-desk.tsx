import { createRoot } from 'react-dom/client';
import AgentDeskApp from './AgentDeskApp.tsx';
import './index.css';

createRoot(document.getElementById('agent-desk-root')!).render(<AgentDeskApp />);
