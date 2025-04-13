export interface Message {
  chatId: string;
  editDate: string;
  edited: boolean;
  message: string;
  messageId: string;
  sendDate: Date;
  senderId: string;
  senderName: string;
  topicId?: string;
}
