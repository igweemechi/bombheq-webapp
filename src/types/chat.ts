export type MessageSender = 'user' | 'assistant' | 'agent' | 'system';

export type SentimentType = 'positive' | 'neutral' | 'frustrated' | 'urgent';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
  senderName?: string;
  intent?: string;
  sentiment?: SentimentType;
  suggestedActions?: string[];
  isEscalated?: boolean;
  ratingPrompt?: boolean;
}

export type ConversationStatus = 'ai_handling' | 'escalated' | 'agent_active' | 'resolved';

export interface Conversation {
  id: string;
  clientId: string;
  clientName?: string;
  clientEmail?: string;
  status: ConversationStatus;
  createdAt: string;
  updatedAt: string;
  summary?: string;
  messages: ChatMessage[];
  rating?: number;
  feedback?: string;
  assignedAgent?: string;
  primaryIntent?: string;
  sentimentSummary?: SentimentType;
}

export interface KnowledgeBaseEntry {
  id: string;
  category: 'services' | 'projects' | 'contact' | 'pricing_probity' | 'methodology' | 'faq';
  question: string;
  answer: string;
  keywords: string[];
  updatedAt: string;
}

export interface SupportAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
}

export interface BotSettings {
  botName: string;
  tagline: string;
  welcomeMessage: string;
  botPersona: 'professional_consulting' | 'friendly_helpful' | 'concise_expert';
  escalationThreshold: 'immediate' | 'on_frustration' | 'manual_only';
  autoFeedbackPrompt: boolean;
  systemPromptAddendum: string;
  activeAgents: SupportAgent[];
}

export interface DashboardMetrics {
  totalConversations: number;
  activeConversations: number;
  escalatedConversations: number;
  resolvedConversations: number;
  averageSatisfaction: number;
  totalRatingsCount: number;
  averageResponseTimeSeconds: number;
  topIntents: { intent: string; count: number }[];
  sentimentBreakdown: { sentiment: SentimentType; count: number }[];
}

export type VoicePersona = 'vance' | 'rostova' | 'assistant';

export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  isThinking: boolean;
  transcript: string;
  error?: string;
}

