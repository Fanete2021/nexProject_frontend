import { ChatPanelAsync } from './ui/chat-panel/ChatPanel.async.tsx';
import { Chat, ChatSchema } from './model/types/chat.ts';
import { ChatInfo } from './model/types/chatInfo.ts';
import { Message } from './model/types/message.ts';
import { chatReducer, chatActions } from './model/slice/chatSlice.ts';
import { getChatDialogs } from './model/selectors/getChatDialogs.ts';
import { getChatIsLoadingDialogs } from './model/selectors/getChatIsLoadingDialogs.ts';
import { fetchChats } from './model/service/fetchChats.ts';
import { fetchChatInfo } from './model/service/fetchChatInfo.ts';
import { getChatSelectedChat } from './model/selectors/getChatSelectedChat.ts';
import ChatWebSocketService from './model/service/ChatWebSocketService.ts';
import { NewMessage } from './model/types/newMessage.ts';
import { searchContacts } from './model/service/searchContacts.ts';
import { ChatTypes } from './model/types/chatTypes.ts';
import { fetchMyContacts } from './model/service/fetchMyContacts.ts';
import { createGroup } from './model/service/createGroup.ts';
import { getChatIsActiveInfoPanel } from './model/selectors/getChatIsActiveInfoPanel.ts';
import { fetchInterlocutors } from './model/service/fetchInterlocutors.ts';
import { fetchMessages } from './model/service/fetchMessages.ts';
import { getChatIsLoadingMessages } from './model/selectors/getChatIsLoadingMessages.ts';

export {
  ChatPanelAsync as ChatPanel,

  chatReducer,
  chatActions,

  getChatDialogs,
  getChatIsLoadingDialogs,
  getChatSelectedChat,
  getChatIsActiveInfoPanel,
  getChatIsLoadingMessages,

  fetchChats,
  fetchChatInfo,
  ChatWebSocketService,
  searchContacts,
  fetchMyContacts,
  createGroup,
  fetchInterlocutors,
  fetchMessages
};

export type {
  Chat,
  ChatSchema,
  ChatInfo,
  Message,
  NewMessage,
  ChatTypes
};
