import { ChatTypes } from './chatTypes.ts';

export type ChatNotification = NewChatNotification;

export interface NewChatNotification {
  chatId: string;
  chatName: string;
  chatType: ChatTypes;
}
