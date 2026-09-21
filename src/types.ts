export interface Sender {
  name: string;
  username?: string;
  avatarColor?: string;
  isMe?: boolean;
}

export interface ForwardedFrom {
  name: string;
  username?: string;
}

export interface TopicItem {
  name: string;
  percentage: number;
  color: string;
  description?: string;
}

export interface KeyTakeaway {
  text: string;
  importance: 'high' | 'medium' | 'normal';
  category?: string;
}

export interface ActionItem {
  id: string;
  title: string;
  assignee?: string;
  priority: 'urgent' | 'medium' | 'low';
  deadline?: string;
  completed: boolean;
}

export interface TimelineMoment {
  timestamp: string;
  seconds: number;
  label: string;
  detail: string;
}

export interface EntityItem {
  category: 'Люди' | 'Проекты' | 'Дедлайны' | 'Метрики' | 'Инструменты' | 'Финансы';
  name: string;
}

export interface VoiceMessageSummary {
  headline: string;
  overview: string;
  category: 'Работа' | 'Встречи' | 'Идеи' | 'Финансы' | 'Личное' | 'Срочно';
  urgency: number; // 0 - 100
  urgencyLevel: 'low' | 'medium' | 'high';
  sentiment: 'Позитивный' | 'Конструктивный' | 'Нейтральный' | 'Тревожный' | 'Критический';
  sentimentScore: number; // 0 - 100
  timeSavedPercent: number; // e.g. 84%
  readingTimeSeconds: number;
}

export interface VoiceMessageInfographics {
  topics: TopicItem[];
  keyTakeaways: KeyTakeaway[];
  actionItems: ActionItem[];
  timeline: TimelineMoment[];
  entities: EntityItem[];
}

export interface VoiceMessage {
  id: string;
  telegramMessageId?: number;
  telegramChatId?: number;
  sender: Sender;
  forwardedFrom?: ForwardedFrom;
  receivedAt: string;
  durationSeconds: number;
  status: 'processing' | 'completed' | 'error';
  errorMessage?: string;
  transcription: {
    fullText: string;
    wordCount: number;
    language?: string;
  };
  summary: VoiceMessageSummary;
  infographics: VoiceMessageInfographics;
  audioUrl?: string;
  waveform?: number[];
}

export interface TelegramBotStatus {
  isConfigured: boolean;
  botUsername?: string;
  botName?: string;
  webhookUrl?: string;
  lastSyncAt?: string;
  messageCount: number;
}
