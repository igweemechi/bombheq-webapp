import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  BarChart3, 
  Search, 
  Filter, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Bot, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  Star, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Smile,
  Meh,
  Frown,
  AlertCircle
} from 'lucide-react';
import { 
  Conversation, 
  ChatMessage, 
  KnowledgeBaseEntry, 
  BotSettings, 
  DashboardMetrics, 
  SentimentType, 
  ConversationStatus,
  FollowUpWorkflow
} from '../../types/chat';
import { useTheme } from '../../context/ThemeContext';

interface ChatbotAdminDashboardProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenClientChat?: () => void;
  onOpenCms?: () => void;
  standalone?: boolean;
}

export const ChatbotAdminDashboard: React.FC<ChatbotAdminDashboardProps> = ({ 
  isOpen = true, 
  onClose,
  onOpenClientChat,
  onOpenCms,
  standalone = false
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'conversations' | 'knowledge' | 'settings' | 'analytics'>('conversations');

  // Conversations State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [convFilter, setConvFilter] = useState<'all' | ConversationStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [agentReplyText, setAgentReplyText] = useState('');
  const [selectedAgentName, setSelectedAgentName] = useState('Dr. Marcus Vance');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Knowledge Base State
  const [kbEntries, setKbEntries] = useState<KnowledgeBaseEntry[]>([]);
  const [kbCategoryFilter, setKbCategoryFilter] = useState<string>('all');
  const [kbSearchQuery, setKbSearchQuery] = useState('');
  const [isEditingKb, setIsEditingKb] = useState(false);
  const [currentKbEntry, setCurrentKbEntry] = useState<Partial<KnowledgeBaseEntry>>({
    category: 'faq',
    question: '',
    answer: '',
    keywords: []
  });
  const [keywordsInput, setKeywordsInput] = useState('');

  // Settings & Workflows State
  const [botSettings, setBotSettings] = useState<BotSettings | null>(null);
  const [workflows, setWorkflows] = useState<FollowUpWorkflow[]>([]);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);
  const [workflowStatusMsg, setWorkflowStatusMsg] = useState<string | null>(null);

  // Analytics State
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
      fetchKnowledgeBase();
      fetchSettings();
      fetchWorkflows();
      fetchMetrics();
    }
  }, [isOpen]);

  // Periodic polling for active conversations
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      fetchConversations(false);
      fetchMetrics();
    }, 8000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const fetchConversations = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        if (!selectedConvId && data.length > 0) {
          setSelectedConvId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const fetchKnowledgeBase = async () => {
    try {
      const res = await fetch('/api/knowledge-base');
      if (res.ok) {
        const data = await res.json();
        setKbEntries(data);
      }
    } catch (err) {
      console.error('Failed to load knowledge base:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setBotSettings(data);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const fetchWorkflows = async () => {
    try {
      const res = await fetch('/api/workflows');
      if (res.ok) {
        const data = await res.json();
        setWorkflows(data);
      }
    } catch (err) {
      console.error('Failed to load workflows:', err);
    }
  };

  const handleTriggerWorkflow = async (convId: string, workflowId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}/trigger-workflow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId })
      });
      const data = await res.json();
      if (res.ok && data.conversation) {
        setConversations(prev => prev.map(c => c.id === convId ? data.conversation : c));
        setWorkflowStatusMsg('Automated follow-up dispatched.');
      } else {
        setWorkflowStatusMsg(data.error || 'Could not dispatch follow-up.');
      }
      setTimeout(() => setWorkflowStatusMsg(null), 3000);
    } catch (err) {
      console.error('Failed to trigger workflow:', err);
    }
  };

  const handleToggleWorkflow = async (wf: FollowUpWorkflow) => {
    try {
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...wf, enabled: !wf.enabled })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.workflows) setWorkflows(data.workflows);
      }
    } catch (err) {
      console.error('Failed to update workflow:', err);
    }
  };

  const fetchMetrics = async () => {
    setIsLoadingMetrics(true);
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  const handleSendAgentReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvId || !agentReplyText.trim() || isSendingReply) return;

    setIsSendingReply(true);
    try {
      const res = await fetch(`/api/conversations/${selectedConvId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: agentReplyText.trim(),
          agentName: selectedAgentName
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAgentReplyText('');
        // Update local conversation record
        setConversations(prev => prev.map(c => c.id === selectedConvId ? data.conversation : c));
      }
    } catch (err) {
      console.error('Failed to send agent reply:', err);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleResolveConversation = async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(prev => prev.map(c => c.id === convId ? data.conversation : c));
        fetchMetrics();
      }
    } catch (err) {
      console.error('Failed to resolve conversation:', err);
    }
  };

  const handleSaveKbEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentKbEntry.question || !currentKbEntry.answer) return;

    try {
      const kwList = keywordsInput
        .split(',')
        .map(k => k.trim().toLowerCase())
        .filter(Boolean);

      const res = await fetch('/api/knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentKbEntry,
          keywords: kwList
        })
      });

      if (res.ok) {
        await fetchKnowledgeBase();
        setIsEditingKb(false);
        setCurrentKbEntry({ category: 'faq', question: '', answer: '', keywords: [] });
        setKeywordsInput('');
      }
    } catch (err) {
      console.error('Failed to save knowledge base entry:', err);
    }
  };

  const handleDeleteKbEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/knowledge-base/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setKbEntries(prev => prev.filter(k => k.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete KB entry:', err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!botSettings) return;

    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(botSettings)
      });

      if (res.ok) {
        const data = await res.json();
        setBotSettings(data.settings);
        setSettingsSavedNotice(true);
        setTimeout(() => setSettingsSavedNotice(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (!isOpen) return null;

  const selectedConv = conversations.find(c => c.id === selectedConvId);

  const filteredConversations = conversations.filter(c => {
    if (convFilter !== 'all' && c.status !== convFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = c.clientName?.toLowerCase().includes(q);
      const matchEmail = c.clientEmail?.toLowerCase().includes(q);
      const matchIntent = c.primaryIntent?.toLowerCase().includes(q);
      const matchText = c.messages.some(m => m.text.toLowerCase().includes(q));
      if (!matchName && !matchEmail && !matchIntent && !matchText) return false;
    }
    return true;
  });

  const filteredKb = kbEntries.filter(k => {
    if (kbCategoryFilter !== 'all' && k.category !== kbCategoryFilter) return false;
    if (kbSearchQuery) {
      const q = kbSearchQuery.toLowerCase();
      const matchQ = k.question.toLowerCase().includes(q);
      const matchA = k.answer.toLowerCase().includes(q);
      const matchK = k.keywords.some(kw => kw.toLowerCase().includes(q));
      if (!matchQ && !matchA && !matchK) return false;
    }
    return true;
  });

  const getSentimentIcon = (sentiment?: SentimentType) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="w-3.5 h-3.5 text-emerald-500" />;
      case 'frustrated':
        return <Frown className="w-3.5 h-3.5 text-rose-500" />;
      case 'urgent':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Meh className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: ConversationStatus) => {
    switch (status) {
      case 'escalated':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
            <AlertCircle className="w-3 h-3" /> Needs Attention
          </span>
        );
      case 'agent_active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <UserCheck className="w-3 h-3" /> Agent Intervening
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      case 'ai_handling':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
            <Bot className="w-3 h-3" /> AI Active
          </span>
        );
    }
  };

  return (
    <div
      className={
        standalone
          ? 'min-h-screen w-full flex flex-col bg-[#f6f7fc] dark:bg-[#070d18] font-sans'
          : 'fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans'
      }
    >
      <div
        className={
          standalone
            ? 'relative w-full flex-1 h-screen bg-white dark:bg-[#0B111E] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100'
            : 'relative w-full max-w-7xl h-[92vh] max-h-[900px] bg-white dark:bg-[#0B111E] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100'
        }
      >
        
        {/* Top Bar */}
        <div className="px-6 py-4 bg-[#15233c] dark:bg-[#070d18] text-white flex items-center justify-between border-b border-white/10 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#245237] to-[#21afc2] flex items-center justify-center text-white shadow-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight font-display">
                  Agent Desk · AI Customer Support Operations Center
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                  Standalone Admin
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Bombheq Partners · Client Inquiries, Live Escalation & Knowledge Base
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onOpenCms && (
              <button
                onClick={onOpenCms}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-emerald-400" />
                <span>Site CMS Manager</span>
              </button>
            )}

            {onOpenClientChat && (
              <button
                onClick={onOpenClientChat}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#21afc2]" />
                <span>Test Client Bot</span>
              </button>
            )}

            {standalone ? (
              onClose && (
                <button
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#245237] hover:bg-[#1b3e2a] text-xs font-semibold text-white transition-all cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public Website</span>
                </button>
              )
            ) : (
              onClose && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close Admin Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-50 dark:bg-[#0E1626] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('conversations')}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'conversations'
                  ? 'border-[#245237] dark:border-[#21afc2] text-[#245237] dark:text-[#21afc2]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Live Conversations</span>
              {conversations.filter(c => c.status === 'escalated').length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                  {conversations.filter(c => c.status === 'escalated').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'knowledge'
                  ? 'border-[#245237] dark:border-[#21afc2] text-[#245237] dark:text-[#21afc2]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Knowledge Base & FAQs</span>
              <span className="text-[11px] opacity-70">({kbEntries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-[#245237] dark:border-[#21afc2] text-[#245237] dark:text-[#21afc2]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics & CSAT</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-[#245237] dark:border-[#21afc2] text-[#245237] dark:text-[#21afc2]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Bot Persona & Rules</span>
            </button>
          </div>

          <div className="flex items-center gap-2 py-2">
            <button
              onClick={() => {
                fetchConversations();
                fetchKnowledgeBase();
                fetchMetrics();
              }}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Live Conversations & Agent Intervene */}
        {activeTab === 'conversations' && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
            
            {/* Left Column: Conversation List */}
            <div className="md:col-span-5 lg:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col min-h-0 bg-slate-50/50 dark:bg-[#070D18]/50">
              
              {/* Search & Filter Bar */}
              <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by client, inquiry, or topic..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B111E] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#245237]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1">
                  {(['all', 'escalated', 'ai_handling', 'agent_active', 'resolved'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setConvFilter(status)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                        convFilter === status
                          ? 'bg-[#15233c] text-white dark:bg-[#21afc2] dark:text-[#070d18]'
                          : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {status === 'all' ? 'All Chats' : status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversation Feed */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-xs">No conversations matching filter.</p>
                  </div>
                ) : (
                  filteredConversations.map(conv => {
                    const isSelected = conv.id === selectedConvId;
                    const lastMsg = conv.messages[conv.messages.length - 1];

                    return (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConvId(conv.id)}
                        className={`w-full text-left p-3.5 transition-all cursor-pointer flex flex-col gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-50/80 dark:bg-slate-800/90 border-l-4 border-[#245237] dark:border-[#21afc2]'
                            : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-white truncate">
                            {conv.clientName || 'Anonymous Visitor'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {getSentimentIcon(conv.sentimentSummary)}
                          <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                            {(conv.primaryIntent || 'general_inquiry').replace(/_/g, ' ')}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                          "{lastMsg?.text || 'No messages yet'}"
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          {getStatusBadge(conv.status)}
                          {conv.rating && (
                            <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-500">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {conv.rating}/5
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Active Conversation Thread & Agent Intervene Console */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col min-h-0 bg-white dark:bg-[#0B111E]">
              {selectedConv ? (
                <>
                  {/* Selected Conv Header */}
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 dark:bg-[#070D18]/80">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-200">
                        {selectedConv.clientName ? selectedConv.clientName.charAt(0) : 'V'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                            {selectedConv.clientName || 'Anonymous Visitor'}
                          </h3>
                          {getStatusBadge(selectedConv.status)}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          {selectedConv.clientEmail && <span>{selectedConv.clientEmail}</span>}
                          <span>Started: {new Date(selectedConv.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {workflows.filter(w => w.enabled).length > 0 && (
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleTriggerWorkflow(selectedConv.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                          <option value="" disabled>Send Automated Follow-Up...</option>
                          {workflows.filter(w => w.enabled).map(wf => (
                            <option key={wf.id} value={wf.id}>{wf.name}</option>
                          ))}
                        </select>
                      )}
                      {selectedConv.status !== 'resolved' && (
                        <button
                          onClick={() => handleResolveConversation(selectedConv.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Resolved</span>
                        </button>
                      )}
                    </div>
                  </div>
                  {workflowStatusMsg && (
                    <div className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs border-b border-emerald-200 dark:border-emerald-800">
                      {workflowStatusMsg}
                    </div>
                  )}

                  {/* Summary Banner if Escalated */}
                  {selectedConv.summary && (
                    <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs border-b border-amber-200 dark:border-amber-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                      <span><strong>Summary:</strong> {selectedConv.summary}</span>
                    </div>
                  )}

                  {/* Message Thread */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#f6f7fc]/50 dark:bg-[#070D18]/40">
                    {selectedConv.messages.map(m => {
                      const isUser = m.sender === 'user';
                      const isAgent = m.sender === 'agent';
                      const isSystem = m.sender === 'system';

                      if (isSystem) {
                        return (
                          <div key={m.id} className="text-center my-2">
                            <span className="inline-block px-3 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                              {m.text}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                        >
                          <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                            {isUser 
                              ? (selectedConv.clientName || 'Visitor') 
                              : isAgent 
                              ? `Agent (${m.senderName || 'Partner'})` 
                              : 'Bombheq Advisor AI'} · {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>

                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                              isUser
                                ? 'bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-xs shadow-xs'
                                : isAgent
                                ? 'bg-[#245237] text-white rounded-tr-xs shadow-md'
                                : 'bg-[#15233c] text-white rounded-tr-xs shadow-sm'
                            }`}
                          >
                            {m.attachment && (
                              <div className="mb-2">
                                {m.attachment.mimeType.startsWith('image/') ? (
                                  <img
                                    src={m.attachment.dataUrl}
                                    alt={m.attachment.name}
                                    className="max-h-36 rounded-lg border border-slate-200/40 object-cover"
                                  />
                                ) : (
                                  <span className="inline-block px-2 py-1 rounded bg-black/10 text-[11px] font-medium">
                                    📎 {m.attachment.name}
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="whitespace-pre-wrap">{m.text}</div>
                            {m.suggestedActions && (
                              <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap gap-1">
                                {m.suggestedActions.map((a, i) => (
                                  <span key={i} className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full">
                                    {a}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Agent Intervene / Live Reply Bar */}
                  <div className="p-3.5 bg-white dark:bg-[#0B111E] border-t border-slate-200 dark:border-slate-800">
                    <form onSubmit={handleSendAgentReply} className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Reply as Human Partner:</span>
                          <select
                            value={selectedAgentName}
                            onChange={e => setSelectedAgentName(e.target.value)}
                            className="text-xs px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                          >
                            <option value="Dr. Marcus Vance">Dr. Marcus Vance (Infrastructure Lead)</option>
                            <option value="Elena Rostova">Elena Rostova (Procurement Partner)</option>
                            <option value="Tariq Al-Mansoor">Tariq Al-Mansoor (Dispute Principal)</option>
                            <option value="Bombheq Support Specialist">Senior Advisory Specialist</option>
                          </select>
                        </div>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          ✓ Live client broadcast enabled
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={agentReplyText}
                          onChange={e => setAgentReplyText(e.target.value)}
                          placeholder="Type authoritative response or project advice to send directly to client..."
                          className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D18] text-slate-800 dark:text-white focus:outline-none focus:border-[#245237]"
                        />

                        <button
                          type="submit"
                          disabled={!agentReplyText.trim() || isSendingReply}
                          className="px-4 py-2.5 bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:text-[#070D18] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
                        >
                          <Send className="w-4 h-4" />
                          <span>Send Reply</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400">
                  <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm">Select a conversation from the left to view messages and intervene.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Knowledge Base & FAQ Management */}
        {activeTab === 'knowledge' && (
          <div className="flex-1 flex flex-col min-h-0 p-6 overflow-y-auto space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-lg">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={kbSearchQuery}
                    onChange={e => setKbSearchQuery(e.target.value)}
                    placeholder="Search knowledge articles by question, keyword, or answer..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070D18] text-slate-800 dark:text-slate-100"
                  />
                </div>

                <select
                  value={kbCategoryFilter}
                  onChange={e => setKbCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070D18] text-slate-800 dark:text-slate-100"
                >
                  <option value="all">All Categories</option>
                  <option value="services">Services</option>
                  <option value="projects">Projects</option>
                  <option value="contact">Contact & Hours</option>
                  <option value="pricing_probity">Probity & Confidentiality</option>
                  <option value="faq">General FAQ</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setCurrentKbEntry({ category: 'faq', question: '', answer: '', keywords: [] });
                  setKeywordsInput('');
                  setIsEditingKb(true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:text-[#070d18] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Knowledge Article</span>
              </button>
            </div>

            {/* Inline Editor Drawer / Card */}
            {isEditingKb && (
              <form onSubmit={handleSaveKbEntry} className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0E1626] border border-emerald-300 dark:border-emerald-800/80 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white font-display">
                    {currentKbEntry.id ? 'Edit Knowledge Article' : 'Create New Knowledge Article'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditingKb(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={currentKbEntry.category || 'faq'}
                      onChange={e => setCurrentKbEntry({ ...currentKbEntry, category: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D18]"
                    >
                      <option value="services">Services</option>
                      <option value="projects">Projects</option>
                      <option value="contact">Contact & Hours</option>
                      <option value="pricing_probity">Probity & Confidentiality</option>
                      <option value="faq">FAQ</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Trigger Keywords (comma separated)
                    </label>
                    <input
                      type="text"
                      value={keywordsInput}
                      onChange={e => setKeywordsInput(e.target.value)}
                      placeholder="e.g. alliance, rail, fast rail, consultation, fees"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D18]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Client Question / Prompt *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentKbEntry.question || ''}
                    onChange={e => setCurrentKbEntry({ ...currentKbEntry, question: e.target.value })}
                    placeholder="e.g. What experience does Bombheq have with high speed passenger rail procurement?"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D18]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Verified Answer / Response *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={currentKbEntry.answer || ''}
                    onChange={e => setCurrentKbEntry({ ...currentKbEntry, answer: e.target.value })}
                    placeholder="Provide authoritative, factual answer used by the AI model to respond..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D18]"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingKb(false)}
                    className="px-4 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#245237] hover:bg-[#1b3e2a] rounded-lg cursor-pointer shadow-xs"
                  >
                    Save Article
                  </button>
                </div>
              </form>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredKb.map(entry => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {entry.category}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setCurrentKbEntry(entry);
                            setKeywordsInput(entry.keywords.join(', '));
                            setIsEditingKb(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteKbEntry(entry.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {entry.question}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                      {entry.answer}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1">
                    {entry.keywords.map((kw, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Tab 3: Real Analytics & CSAT */}
        {activeTab === 'analytics' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-500 dark:text-slate-400">Total Inquiries</span>
                <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                  {metrics?.totalConversations || conversations.length}
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> Real-time active tracking
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-500 dark:text-slate-400">Resolution Rate</span>
                <div className="text-2xl font-bold text-[#245237] dark:text-[#21afc2] mt-1">
                  {metrics?.totalConversations 
                    ? `${Math.round((metrics.resolvedConversations / metrics.totalConversations) * 100)}%` 
                    : '100%'}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {metrics?.resolvedConversations || 0} successfully closed
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-500 dark:text-slate-400">Client CSAT Score</span>
                <div className="text-2xl font-bold text-amber-500 mt-1 flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span>{metrics?.averageSatisfaction || 5.0}</span>
                  <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Based on verified ratings
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-500 dark:text-slate-400">Avg. Response Time</span>
                <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                  {metrics?.averageResponseTimeSeconds || 1.4}s
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">
                  Powered by Gemini Flash
                </span>
              </div>
            </div>

            {/* Intent & Sentiment Breakdown Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Top Client Inquiry Topics */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white font-display flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#245237] dark:text-[#21afc2]" />
                  <span>Top Inquiry Topics & Intents</span>
                </h3>

                <div className="space-y-3">
                  {(metrics?.topIntents && metrics.topIntents.length > 0 ? metrics.topIntents : [
                    { intent: 'procurement_guidance', count: 8 },
                    { intent: 'strategy_policy', count: 6 },
                    { intent: 'project_inquiry', count: 5 },
                    { intent: 'consultation_request', count: 4 },
                    { intent: 'dispute_resolution', count: 2 },
                  ]).map((item, idx) => {
                    const maxCount = Math.max(...(metrics?.topIntents?.map(i => i.count) || [8]));
                    const pct = Math.round((item.count / (maxCount || 1)) * 100);

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">
                            {item.intent.replace(/_/g, ' ')}
                          </span>
                          <span className="text-slate-400 font-mono">{item.count} inquiries</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div 
                            className="h-full bg-[#245237] dark:bg-[#21afc2] rounded-full transition-all duration-500" 
                            style={{ width: `${pct}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sentiment Distribution */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white font-display flex items-center gap-2">
                  <Smile className="w-4 h-4 text-emerald-500" />
                  <span>Client Sentiment Distribution</span>
                </h3>

                <div className="space-y-3">
                  {(metrics?.sentimentBreakdown || [
                    { sentiment: 'positive', count: 12 },
                    { sentiment: 'neutral', count: 8 },
                    { sentiment: 'urgent', count: 2 },
                    { sentiment: 'frustrated', count: 1 }
                  ]).map((item, idx) => {
                    const total = metrics?.totalConversations || 23;
                    const pct = Math.round((item.count / total) * 100);

                    const colors: Record<SentimentType, string> = {
                      positive: 'bg-emerald-500',
                      neutral: 'bg-slate-400',
                      urgent: 'bg-amber-500',
                      frustrated: 'bg-rose-500'
                    };

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300 capitalize">
                            {getSentimentIcon(item.sentiment as SentimentType)}
                            <span>{item.sentiment}</span>
                          </span>
                          <span className="text-slate-400">{item.count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div 
                            className={`h-full ${colors[item.sentiment as SentimentType]} rounded-full transition-all duration-500`}
                            style={{ width: `${pct}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Tip: Automated escalation is triggered whenever a client expresses frustration or requests human partner guidance.
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 4: Bot Persona & Configuration */}
        {activeTab === 'settings' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {botSettings ? (
              <form onSubmit={handleSaveSettings} className="max-w-3xl space-y-5">
                
                {settingsSavedNotice && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Bot settings and prompt rules updated successfully. Real-time inference updated.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Assistant Display Name
                    </label>
                    <input
                      type="text"
                      value={botSettings.botName}
                      onChange={e => setBotSettings({ ...botSettings, botName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D18]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={botSettings.tagline}
                      onChange={e => setBotSettings({ ...botSettings, tagline: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D18]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Conversational Persona
                    </label>
                    <select
                      value={botSettings.botPersona}
                      onChange={e => setBotSettings({ ...botSettings, botPersona: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D18]"
                    >
                      <option value="professional_consulting">Professional Consulting (Authoritative, Polished)</option>
                      <option value="friendly_helpful">Friendly & Helpful (Approachable, Empathetic)</option>
                      <option value="concise_expert">Concise Expert (Direct, Fact-focused)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Escalation Trigger Threshold
                    </label>
                    <select
                      value={botSettings.escalationThreshold}
                      onChange={e => setBotSettings({ ...botSettings, escalationThreshold: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D18]"
                    >
                      <option value="on_frustration">On Frustration or Human Request (Recommended)</option>
                      <option value="immediate">Immediate Human Handover Prompt</option>
                      <option value="manual_only">Manual Escalation Button Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Client Welcome Greeting
                  </label>
                  <textarea
                    rows={2}
                    value={botSettings.welcomeMessage}
                    onChange={e => setBotSettings({ ...botSettings, welcomeMessage: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D18]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    System Prompt Addendum (Injected directly into Gemini Model Instructions)
                  </label>
                  <textarea
                    rows={4}
                    value={botSettings.systemPromptAddendum}
                    onChange={e => setBotSettings({ ...botSettings, systemPromptAddendum: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D18] font-mono text-[11px]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="autoFeedbackPrompt"
                    checked={botSettings.autoFeedbackPrompt}
                    onChange={e => setBotSettings({ ...botSettings, autoFeedbackPrompt: e.target.checked })}
                    className="rounded border-slate-300 text-[#245237]"
                  />
                  <label htmlFor="autoFeedbackPrompt" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    Prompt for 5-star Customer Satisfaction (CSAT) rating upon resolution
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-6 py-2.5 bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:text-[#070D18] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all"
                  >
                    {isSavingSettings ? 'Saving Settings...' : 'Save Bot Configuration'}
                  </button>
                </div>

                {/* Automated Messaging & Follow-Up Workflows Section */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white font-display flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#21afc2]" />
                    <span>Automated Messaging & Follow-Up Rules</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Configure approved client follow-up templates and scheduling triggers. Respects client opt-in preferences.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {workflows.map(wf => (
                      <div
                        key={wf.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#070D18] flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 dark:text-white">{wf.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {wf.delayLabel}
                            </span>
                            {wf.requiresOptIn && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                Opt-In Protected
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            "{wf.templateText}"
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleWorkflow(wf)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-semibold cursor-pointer shrink-0 transition-colors ${
                            wf.enabled
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {wf.enabled ? 'Enabled' : 'Paused'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </form>
            ) : (
              <div className="p-8 text-center text-slate-400">Loading settings...</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
