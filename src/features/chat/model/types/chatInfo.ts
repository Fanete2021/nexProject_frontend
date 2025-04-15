import { Message } from './message.ts';
import { Member } from './member.ts';

export interface ChatInfo {
  chatName: string;
  lastMessages: Message[];
  members: Member[];
  ownerId?: string;
  chatId: string;
  messageCount: number;

  //TODO заполнить тип для топиков
  // topics: [];
}
