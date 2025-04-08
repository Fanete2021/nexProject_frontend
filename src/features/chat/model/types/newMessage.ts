export interface NewMessage {
  senderId: string;
  recipientId?: string;
  chatId?: string;
  topicId?: string;
  message: string;
}
