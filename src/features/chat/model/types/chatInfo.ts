import { Message } from './message.ts';
import { Member } from './member.ts';
import { Topic } from './topic.ts';

export interface ChatInfo {
  chatName: string;
  lastMessages: Message[];
  members: Member[];
  ownerId?: string;
  chatId: string;
  messageCount: number;
  topics: Topic[];
}
