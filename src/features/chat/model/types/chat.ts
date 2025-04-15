import { ChatInfo } from '../types/chatInfo.ts';
import { Message } from './message.ts';
import { ChatTypes } from './chatTypes.ts';

export interface Chat {
  chatId: string;
  chatName: string;
  lastMessage?: Message;
  chatType: ChatTypes;
}

export interface ChatSchema {
  dialogs: Chat[];
  isLoadingDialogs: boolean;
  selectedChat?: ChatInfo;
  isLoadingSelectedChat: boolean;
  isActiveInfoPanel: boolean;
  isLoadingMessages: boolean;
}
