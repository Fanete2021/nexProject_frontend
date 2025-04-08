import { ChatInfo } from '../types/chatInfo.ts';

export interface Chat {
  chatId: string;
  chatName: string;
}

export interface ChatSchema {
  data: Chat[];
  selectedChat?: ChatInfo;
  isLoading: boolean;
}
