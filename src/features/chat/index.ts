import { ChatPanelAsync } from './ui/chat-panel/ChatPanel.async.tsx';
import { Chat, ChatSchema } from './model/types/chat.ts';
import { ChatInfo } from './model/types/chatInfo.ts';
import { Message, MessageTypes } from './model/types/message.ts';
import { chatReducer, chatActions } from './model/slice/chatSlice.ts';
import { getChatDialogs } from './model/selectors/getChatDialogs.ts';
import { getChatIsLoadingDialogs } from './model/selectors/getChatIsLoadingDialogs.ts';
import { fetchChats } from './model/service/fetchChats.ts';
import { fetchChatInfo } from './model/service/fetchChatInfo.ts';
import { getChatSelectedChat } from './model/selectors/getChatSelectedChat.ts';
import ChatWebSocketService from './model/service/ChatWebSocketService.ts';
import { NewMessage } from './model/types/newMessage.ts';
import { ChatTypes } from './model/types/chatTypes.ts';
import { fetchMyContacts } from './model/service/fetchMyContacts.ts';
import { createGroup } from './model/service/createGroup.ts';
import { getChatIsActiveInfoPanel } from './model/selectors/getChatIsActiveInfoPanel.ts';
import { fetchMessages } from './model/service/fetchMessages.ts';
import { getChatIsLoadingMessages } from './model/selectors/getChatIsLoadingMessages.ts';
import { getChatMessageDrafts } from './model/selectors/getChatMessageDrafts.ts';
import { addUserToGroup } from './model/service/addUserToGroup.ts';
import { deleteMessage } from './model/service/deleteMessage.ts';
import { getChatEditableMessage } from './model/selectors/getChatEditableMessage.ts';
import { editMessage } from './model/service/editMessage.ts';
import { getChatDialogsFilter } from './model/selectors/getChatDialogsFilter.ts';
import { getChatIsLoadingSelectedChat } from './model/selectors/getChatIsLoadingSelectedChat.ts';
import { deletePrivateChat } from './model/service/deletePrivateChat.ts';
import { isPublicChat } from './utils/libs/isPublicChat.ts';

export {
  ChatPanelAsync as ChatPanel,

  chatReducer,
  chatActions,

  getChatDialogs,
  getChatIsLoadingDialogs,
  getChatSelectedChat,
  getChatIsActiveInfoPanel,
  getChatIsLoadingMessages,
  getChatMessageDrafts,
  getChatEditableMessage,
  getChatDialogsFilter,
  getChatIsLoadingSelectedChat,

  fetchChats,
  fetchChatInfo,
  ChatWebSocketService,
  fetchMyContacts,
  createGroup,
  fetchMessages,
  addUserToGroup,
  editMessage,
  deleteMessage,
  deletePrivateChat,

  ChatTypes,
  MessageTypes,

  isPublicChat
};

export type {
  Chat,
  ChatSchema,
  ChatInfo,
  Message,
  NewMessage,
};
