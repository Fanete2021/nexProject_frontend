import { Message } from '@/features/chat';
import { formatDateLocalized } from '@/shared/lib/utils/formatDateLocalized.ts';
import { GroupedMessage } from '../../model/types/groupedMessage';
import { GroupTypes } from '../../model/types/groupTypes';

export const groupMessages = (messages: Message[], timeGap = 10 * 60 * 1000): GroupedMessage[] => {
  const grouped: GroupedMessage[] = [];
  let lastTimestamp = 0;
  let lastSenderId = '';

  const isNewGroup = (message: Message, timestamp: number): boolean => {
    return (
      timestamp - lastTimestamp > timeGap ||
      message.senderId !== lastSenderId
    );
  };

  for (let i = 0; i < messages.length; i += 1) {
    const currentMessage = messages[i];

    const messageDate = formatDateLocalized(currentMessage.sendDate.toLocaleString());
    const messageTimestamp = new Date(currentMessage.sendDate).getTime();

    if (isNewGroup(currentMessage, messageTimestamp)) {
      grouped.push({ type: GroupTypes.MESSAGE, messages: [currentMessage] });
    } else {
      grouped[grouped.length - 1].messages!.unshift(currentMessage);
    }

    lastTimestamp = messageTimestamp;
    lastSenderId = currentMessage.senderId;

    if (i + 1 !== messages.length) {
      const nextMessage = messages[i + 1];
      const nextMessageDate = formatDateLocalized(nextMessage.sendDate.toLocaleString());

      if (messageDate !== nextMessageDate) {
        grouped.push({ type: GroupTypes.DATE, date: messageDate });
        lastTimestamp = 0;
        lastSenderId = '';
      }
    } else {
      grouped.push({ type: GroupTypes.DATE, date: messageDate });
    }
  }

  return grouped;
};
