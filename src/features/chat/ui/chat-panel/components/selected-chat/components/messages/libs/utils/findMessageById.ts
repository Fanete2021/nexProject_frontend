import { GroupedMessage } from '../../model/types/groupedMessage';

export const findMessageById = (groupedMessages: GroupedMessage[], targetId: string) => {
  for (const group of groupedMessages) {
    if (group.type === 'message' && group.messages) {
      const foundMessage = group.messages.find(msg => msg.messageId === targetId);
      if (foundMessage) return foundMessage;
    }
  }
  return null; 
};
