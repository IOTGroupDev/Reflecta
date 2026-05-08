export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatAttachment {
  id: string;
  kind: 'document' | 'image';
  name: string;
  mimeType?: string;
  size?: number;
  url: string;
}

export interface ChatMessageDto {
  attachments?: ChatAttachment[];
  message: string;
  history?: ChatTurn[];
  language?: 'ru' | 'en' | 'es';
  userId: string;
}

export interface ChatMessageResponse {
  message: string;
  source: 'openai' | 'local';
  suggestions: string[];
  safety: 'none' | 'crisis';
}
