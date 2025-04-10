import { Message } from './message.ts';
import { Member } from './member.ts';

export interface ChatInfo {
  chatName: string;
  lastMessages: Message[];
  members: Member[];
  ownerId?: string;
  chatId: string;

  //TODO заполнить тип для топиков
  // topics: [];
}
