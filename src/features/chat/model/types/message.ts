export interface Message {
  chatId: string;
  message: string;
  messageId: string;
  sendDate: Date;
  senderId: string;
  topicId?: string;
}
