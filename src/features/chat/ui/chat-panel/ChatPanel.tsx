import React, { useEffect } from 'react';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import styles from './ChatPanel.module.scss';
import Dialogs from '../dialogs/Dialogs.tsx';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { fetchChats } from '../../model/service/fetchChats.ts';
import SelectedChat from '../selected-chat/SelectedChat.tsx';
import { useSelector } from 'react-redux';
import { getAuthToken } from '@/features/auth';
import ChatWebSocketService from '../../model/service/ChatWebSocketService.ts';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import { Message } from '../../model/types/message.ts';
import { chatActions } from '../../model/slice/chatSlice.ts';
import { ChatNotification } from '../../model/types/chatNotifications.ts';
import { fetchChatInfo } from '../../model/service/fetchChatInfo.ts';
import { Chat } from '../../model/types/chat.ts';
import { ChatTypes } from '../../model/types/chatTypes.ts';
import { getChatIsActiveInfoPanel } from '../../model/selectors/getChatIsActiveInfoPanel.ts';
import InfoChat from '../info-chat/InfoChat.tsx';
import { getChatSelectedChat } from '../../model/selectors/getChatSelectedChat.ts';

export interface ChatProps {
    className?: string;
}

const ChatPanel: React.FC<ChatProps> = (props) => {
  const { className } = props;
  const dispatch = useAppDispatch();
  const token = useSelector(getAuthToken)!;
  const user = useSelector(getUserData)!;
  const isActiveInfoPanel = useSelector(getChatIsActiveInfoPanel);
  const selectedChat = useSelector(getChatSelectedChat);

  useEffect(() => {
    const subscribeChats = async () => {
      try {
        //TODO переделать на получение только айдишников
        const response = await dispatch(fetchChats({ filterMode: ChatTypes.ALL })).unwrap();
        const { chats } = response;

        for (const chat of chats) {
          ChatWebSocketService.subscribe(chat.chatId);
        }
      } catch (error) {
        console.log(error);
      }
    };

    subscribeChats();

    ChatWebSocketService.onMessageCallback = (message: Message) => {
      dispatch(chatActions.addMessage(message));
    };

    ChatWebSocketService.onNotificationsCallback = async (notification: ChatNotification) => {
      try {
        const response = await dispatch(fetchChatInfo({ chatId: notification.chatId })).unwrap();

        ChatWebSocketService.subscribe(notification.chatId);

        const newChat: Chat = {
          chatId: response.chatId,
          lastMessage: response.lastMessages[0],
          chatName: response.chatName,
        };

        dispatch(chatActions.addChat(newChat));
      } catch (error) {
        console.log(error);
      }
    };
    
    return () => {
      ChatWebSocketService.onMessageCallback = () => {};
    };
  }, []);

  useEffect(() => {
    ChatWebSocketService.connect(token, user.userId);

    return () => {
      ChatWebSocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    ChatWebSocketService.updateConnectionToken(token);
  }, [token]);

  return (
    <div className={classNames(styles.ChatPanel, [className])}>
      <Dialogs className={styles.dialogs} />
      <SelectedChat className={styles.selectedChat}/>

      {isActiveInfoPanel && selectedChat && <InfoChat className={styles.infoChat} />}
    </div>
  );
};

export default ChatPanel;
