import { ChatPanelAsync } from './ui/chat-panel/ChatPanel.async.tsx';
import { Chat, ChatSchema } from './model/types/chat.ts';
import { ChatInfo } from './model/types/chatInfo.ts';
import { Message } from './model/types/message.ts';
import { chatReducer, chatActions } from './model/slice/chatSlice.ts';
import { getChatData } from './model/selectors/getChatData.ts';
import { getChatIsLoading } from './model/selectors/getChatIsLoading.ts';
import { fetchChats } from './model/service/fetchChats.ts';
import { fetchSelectedChatInfo } from './model/service/fetchSelectedChatInfo.ts';
import { getChatSelectedChat } from './model/selectors/getChatSelectedChat.ts';
import ChatWebSocketService from './model/service/ChatWebSocketService.ts';
import { NewMessage } from './model/types/newMessage.ts';

export {
    ChatPanelAsync as ChatPanel,

    chatReducer,
    chatActions,

    getChatData,
    getChatIsLoading,
    getChatSelectedChat,

    fetchChats,
    fetchSelectedChatInfo,
    ChatWebSocketService
};

export type {
    Chat,
    ChatSchema,
    ChatInfo,
    Message,
    NewMessage
};
