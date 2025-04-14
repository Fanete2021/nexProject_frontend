import { ChatInfo } from '../types/chatInfo.ts';
import { Message } from './message.ts';

export interface Chat {
  chatId: string;
  chatName: string;
  lastMessage?: Message;
}

export interface ChatSchema {
  dialogs: Chat[];
  isLoadingDialogs: boolean;
  selectedChat?: ChatInfo;
  isLoadingSelectedChat: boolean;
  isActiveInfoPanel: boolean;
}
