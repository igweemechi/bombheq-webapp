import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../../context/ContentContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  MessageSquare, 
  X, 
  Send, 
  User, 
  Bot, 
  Sparkles, 
  UserCheck, 
  Star, 
  ChevronDown, 
  RefreshCw, 
  AlertCircle, 
  ShieldCheck, 
  CornerDownLeft, 
  Volume2, 
  VolumeX,
  ExternalLink,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, Conversation } from '../../types/chat';

interface ChatbotWidgetProps {
  isOpen?: boolean;
  onToggleOpen?: (open: boolean) => void;
  onOpenAdmin?: () => void;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  isOpen: controlledIsOpen,
  onToggleOpen,
  onOpenAdmin
}) => {
  const { content, setActiveView } = useContent();
  const { theme } = useTheme();

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(isOpen) : val;
    if (onToggleOpen) {
      onToggleOpen(nextVal);
    } else {
      setInternalIsOpen(nextVal);
    }
  };

  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [isEscalated, setIsEscalated] = useState(false);
  const [assignedAgentName, setAssignedAgentName] = useState<string | null>(null);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [escalationForm, setEscalationForm] = useState({ name: '', email: '', reason: '' });
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // CSAT rating state
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [ratingHover, setRatingHover] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or load conversation from localStorage
  useEffect(() => {
    const savedConvId = localStorage.getItem('bombheq_active_conv_id');
    if (savedConvId) {
      setConversationId(savedConvId);
      // Fetch conversation history
      fetch(`/api/conversations/${savedConvId}`)
        .then(res => res.ok ? res.json() : null)
        .then((conv: Conversation | null) => {
          if (conv && conv.messages && conv.messages.length > 0) {
            setMessages(conv.messages);
            setIsEscalated(conv.status === 'escalated' || conv.status === 'agent_active');
            if (conv.assignedAgent) setAssignedAgentName(conv.assignedAgent);
          } else {
            initWelcomeMessage(savedConvId);
          }
        })
        .catch(() => initWelcomeMessage(savedConvId));
    } else {
      const newId = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setConversationId(newId);
      localStorage.setItem('bombheq_active_conv_id', newId);
      initWelcomeMessage(newId);
    }
  }, []);

  const initWelcomeMessage = (convId: string) => {
    const welcomeMsg: ChatMessage = {
      id: `msg-welcome-${Date.now()}`,
      sender: 'assistant',
      senderName: 'Bombheq Advisor AI',
      text: `Welcome to Bombheq Partners. I am your AI Advisory Assistant. How can I assist you with our engineering advisory, next-generation procurement, or mega-project delivery services today?`,
      timestamp: new Date().toISOString(),
      suggestedActions: [
        'Advisory Services Overview',
        'Procurement & Alliances',
        'NSW Fast Rail ($20B)',
        'Book Partner Consultation'
      ]
    };
    setMessages([welcomeMsg]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const playNotificationSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setInputText('');

    // Append user message immediately
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: text,
          clientInfo: {
            clientId: localStorage.getItem('bombheq_client_id') || 'client-anon',
            name: escalationForm.name || undefined,
            email: escalationForm.email || undefined
          }
        })
      });

      if (!res.ok) {
        throw new Error('Server returned an error response');
      }

      const data = await res.json();
      if (data.message) {
        setMessages(prev => [...prev, data.message]);
        playNotificationSound();
        if (!isOpen) setUnreadCount(prev => prev + 1);
      }

      if (data.isEscalated) {
        setIsEscalated(true);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: 'system',
        text: 'Unable to reach the advisory server. Please verify your connection or call our office directly at +0410-826-339.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (actionText: string) => {
    if (actionText === 'Book Partner Consultation') {
      setActiveView('contact');
      handleSendMessage('I would like to book a strategic consultation with a partner.');
    } else {
      handleSendMessage(actionText);
    }
  };

  const handleEscalateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalationForm.name.trim() || !escalationForm.email.trim()) return;

    try {
      const res = await fetch(`/api/conversations/${conversationId}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: escalationForm.reason || 'Client requested direct human partner escalation.',
          clientName: escalationForm.name,
          clientEmail: escalationForm.email
        })
      });

      if (res.ok) {
        setIsEscalated(true);
        setShowEscalationModal(false);
        const alertMsg: ChatMessage = {
          id: `msg-${Date.now()}-esc`,
          sender: 'system',
          text: `Escalation confirmed. Dr. Marcus Vance & Elena Rostova have been notified of your project brief (${escalationForm.email}). An advisor will respond here or via email promptly.`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, alertMsg]);
      }
    } catch (err) {
      console.error('Escalation failed:', err);
    }
  };

  const handleRatingSubmit = async () => {
    if (selectedRating === 0) return;
    try {
      await fetch(`/api/conversations/${conversationId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: selectedRating,
          feedback: feedbackText
        })
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      
      {/* 1. Floating Launch Button (When chat is closed) */}
      {!isOpen && (
        <motion.button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center gap-3 px-4 sm:px-5 py-3 rounded-full bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:hover:bg-[#1994a5] text-white dark:text-[#070d18] shadow-2xl border border-white/20 dark:border-slate-700 cursor-pointer group transition-all"
          aria-label="Open AI Advisory Support Chat"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white dark:text-[#070d18] transition-transform group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 dark:bg-emerald-600 border-2 border-white dark:border-[#070d18] animate-pulse" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-bold leading-tight tracking-wide font-display">
              AI Support Bot
            </span>
            <span className="text-[10px] opacity-80 leading-none mt-0.5">
              Online · Ask anything
            </span>
          </div>

          {unreadCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-amber-400 text-slate-900 rounded-full animate-bounce">
              {unreadCount}
            </span>
          )}
        </motion.button>
      )}

      {/* 2. Chat Window Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '70px' : '580px' 
            }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`w-[92vw] sm:w-[410px] bg-white dark:bg-[#0B111E] rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col overflow-hidden backdrop-blur-xl ${
              isMinimized ? 'h-[70px]' : 'h-[580px] max-h-[85vh]'
            }`}
          >
            {/* Header */}
            <div className="p-4 bg-[#15233c] dark:bg-[#070d18] text-white flex items-center justify-between border-b border-white/10 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#245237] to-[#21afc2] flex items-center justify-center text-white shadow-md">
                    {isEscalated ? <UserCheck className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#15233c]" />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold tracking-tight font-display">
                      {isEscalated ? (assignedAgentName || 'Senior Advisory Specialist') : 'Bombheq Advisor AI'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                      {isEscalated ? 'Human Handover' : 'AI Grounded'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300">
                    {isEscalated ? 'Direct Partner Channel Active' : 'Infrastructure & Procurement Counsel'}
                  </span>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1 text-slate-400">
                <button
                  onClick={() => setSoundEnabled(prev => !prev)}
                  className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsMinimized(prev => !prev)}
                  className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title={isMinimized ? 'Expand window' : 'Minimize'}
                >
                  <Minimize2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body (Messages & Controls) - Hidden if Minimized */}
            {!isMinimized && (
              <>
                {/* AI Compliance / Notice Bar */}
                <div className="px-4 py-1.5 bg-slate-100 dark:bg-[#070d18]/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />
                    <span>Verified Knowledge Base · Probity compliant</span>
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {onOpenAdmin && (
                      <button
                        onClick={onOpenAdmin}
                        className="text-slate-500 dark:text-slate-400 hover:text-[#245237] dark:hover:text-[#21afc2] underline cursor-pointer font-medium"
                        title="Open AI Operations & Agent Takeover Console"
                      >
                        Admin Desk
                      </button>
                    )}
                    {!isEscalated && (
                      <button
                        onClick={() => setShowEscalationModal(true)}
                        className="text-[#245237] dark:text-[#21afc2] hover:underline font-semibold cursor-pointer"
                      >
                        Talk to Human
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#f6f7fc] dark:bg-[#0B111E]">
                  {messages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    const isSystem = msg.sender === 'system';
                    const isAgent = msg.sender === 'agent';

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="flex justify-center my-2">
                          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs text-center max-w-[90%] leading-relaxed">
                            {msg.text}

                            {/* CSAT Rating Prompt if flagged */}
                            {msg.ratingPrompt && !feedbackSubmitted && (
                              <div className="mt-3 pt-2.5 border-t border-amber-200 dark:border-amber-800/80">
                                <span className="text-[11px] font-semibold block mb-2 text-slate-700 dark:text-slate-200">
                                  Rate Your Advisory Experience:
                                </span>
                                
                                <div className="flex items-center justify-center gap-1 mb-2.5">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                      key={star}
                                      onClick={() => setSelectedRating(star)}
                                      onMouseEnter={() => setRatingHover(star)}
                                      onMouseLeave={() => setRatingHover(0)}
                                      className="p-1 cursor-pointer transition-transform hover:scale-120"
                                      aria-label={`${star} Stars`}
                                    >
                                      <Star
                                        className={`w-5 h-5 ${
                                          (ratingHover || selectedRating) >= star 
                                            ? 'fill-amber-400 text-amber-400' 
                                            : 'text-slate-300 dark:text-slate-600'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>

                                {selectedRating > 0 && (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={feedbackText}
                                      onChange={e => setFeedbackText(e.target.value)}
                                      placeholder="Optional written feedback..."
                                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                                    />
                                    <button
                                      onClick={handleRatingSubmit}
                                      className="px-3 py-1 bg-[#245237] text-white text-xs font-semibold rounded-md hover:bg-[#1b3e2a] cursor-pointer"
                                    >
                                      Submit Rating
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {msg.ratingPrompt && feedbackSubmitted && (
                              <span className="block mt-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                                ✓ Thank you for your feedback!
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                      >
                        {/* Sender Label */}
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mb-1 px-1">
                          {isUser ? 'You' : (msg.senderName || 'Bombheq Advisor AI')} · {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        {/* Message Bubble */}
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                            isUser
                              ? 'bg-[#245237] text-white rounded-tr-xs'
                              : isAgent
                              ? 'bg-white dark:bg-[#111C2E] text-slate-800 dark:text-white border-2 border-[#21afc2] rounded-tl-xs shadow-md'
                              : 'bg-white dark:bg-[#111C2E] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-tl-xs'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{msg.text}</div>

                          {/* Quick Action Chips attached to message */}
                          {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                              {msg.suggestedActions.map((action, aIdx) => (
                                <button
                                  key={aIdx}
                                  onClick={() => handleQuickAction(action)}
                                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-[#245237] dark:hover:text-[#21afc2] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs px-2 py-1">
                      <Bot className="w-4 h-4 text-[#245237] dark:text-[#21afc2] animate-spin" />
                      <span className="flex items-center gap-1">
                        <span>Formulating advisory response</span>
                        <span className="inline-flex gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" />
                          <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                        </span>
                      </span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white dark:bg-[#070d18] border-t border-slate-200 dark:border-slate-800">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      placeholder="Ask about strategy, projects, procurement..."
                      disabled={isLoading}
                      className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B111E] text-slate-800 dark:text-white focus:outline-none focus:border-[#245237] dark:focus:border-[#21afc2]"
                    />

                    <button
                      type="submit"
                      disabled={!inputText.trim() || isLoading}
                      className="p-2.5 rounded-xl bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:hover:bg-[#1994a5] text-white dark:text-[#070d18] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Escalation & Quick Support Link */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-2">
                    <span>Press Enter to send</span>
                    <button
                      onClick={() => setShowEscalationModal(true)}
                      className="hover:text-[#245237] dark:hover:text-[#21afc2] transition-colors cursor-pointer"
                    >
                      Request Partner Callback
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 3. Escalation Handover Modal */}
            {showEscalationModal && (
              <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="w-full bg-white dark:bg-[#111C2E] rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-[#245237] dark:text-[#21afc2]">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white font-display">
                        Escalate to Human Partner
                      </h4>
                    </div>
                    <button
                      onClick={() => setShowEscalationModal(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Connect directly with Dr. Marcus Vance or Elena Rostova for confidential commercial or high-value infrastructure inquiries.
                  </p>

                  <form onSubmit={handleEscalateSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={escalationForm.name}
                        onChange={e => setEscalationForm({ ...escalationForm, name: e.target.value })}
                        placeholder="e.g. Rachel Adams"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Organization / Agency Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={escalationForm.email}
                        onChange={e => setEscalationForm({ ...escalationForm, email: e.target.value })}
                        placeholder="e.g. rachel@transport.gov.au"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Project Scope / Issue Details
                      </label>
                      <textarea
                        rows={2}
                        value={escalationForm.reason}
                        onChange={e => setEscalationForm({ ...escalationForm, reason: e.target.value })}
                        placeholder="Brief overview of transaction or dispute requirement..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-slate-800 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowEscalationModal(false)}
                        className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:text-[#070d18] rounded-lg cursor-pointer shadow-xs"
                      >
                        Transfer to Partner
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
