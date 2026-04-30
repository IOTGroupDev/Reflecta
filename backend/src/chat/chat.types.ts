export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatMessageDto {
  message: string;
  history?: ChatTurn[];
  userId?: string;
}

export interface ChatMessageResponse {
  message: string;
  source: 'openai' | 'local';
  suggestions: string[];
  safety: 'none' | 'crisis';
}
