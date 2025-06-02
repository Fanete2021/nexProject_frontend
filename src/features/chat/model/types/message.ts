export enum MessageTypes {
  NEW_MESSAGE = 'NEW_MESSAGE',
  EDIT_MESSAGE = 'EDIT_MESSAGE',
  DELETE_MESSAGE = 'DELETE_MESSAGE'
}

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
  type?: MessageTypes
}
