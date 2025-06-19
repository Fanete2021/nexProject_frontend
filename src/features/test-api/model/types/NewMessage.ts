export type NewMessage = {
  senderId: string;
  recipientId?: string;
  chatId?: string;
  topicId?: string;
  message?: string;
} | {
  chatId: string;
  messageId: string;
};
