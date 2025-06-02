import { Message } from '@/features/chat';
import { GroupTypes } from './groupTypes.ts';

export type GroupedMessage = {
  type: GroupTypes;
  date?: string;
  messages?: Message[];
};
