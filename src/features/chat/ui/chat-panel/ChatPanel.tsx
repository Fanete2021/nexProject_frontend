import React, {useEffect} from 'react';
import {classNames} from '@/shared/lib/utils/classNames.ts';
import styles from './ChatPanel.module.scss';
import Dialogs from './ui/dialogs/Dialogs.tsx';
import {useAppDispatch} from '@/shared/lib/hooks/useAppDispatch.ts';
import {fetchChats} from '../../model/service/fetchChats.ts';
import SelectedChat from './ui/selected-chat/SelectedChat.tsx';
import {useSelector} from 'react-redux';
import {getAuthToken} from '@/features/auth';
import ChatWebSocketService from '../../model/service/ChatWebSocketService.ts';
import {getUserData} from '@/entities/user/model/selectors/getUserData.ts';
import {Message, typesMessage} from '../../model/types/message.ts';
import {chatActions} from '../../model/slice/chatSlice.ts';
import {ChatNotification} from '../../model/types/chatNotifications.ts';
import {fetchChatInfo} from '../../model/service/fetchChatInfo.ts';
import {Chat} from '../../model/types/chat.ts';
import {ChatTypes} from '../../model/types/chatTypes.ts';
import {getChatIsActiveInfoPanel} from '../../model/selectors/getChatIsActiveInfoPanel.ts';
import InfoChat from '@/features/chat/ui/chat-panel/ui/info-chat/InfoChat.tsx';
import {getChatSelectedChat} from '../../model/selectors/getChatSelectedChat.ts';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';
import {isPublicChat} from '@/shared/lib/utils/isPublicChat.ts';
import {MOBILE_MAX_BREAKPOINT} from '@/shared/const/WindowBreakpoints.ts';

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
  const windowWidth = useWindowWidth();

  useEffect(() => {
    ChatWebSocketService.connect(token, user.userId);

    ChatWebSocketService.onMessageCallback = (message: Message) => {
      console.log(message.type === typesMessage.DELETE_MESSAGE)
      switch (message.type) {
        case typesMessage.NEW_MESSAGE:
          dispatch(chatActions.addMessage(message));
          break;
        case typesMessage.EDIT_MESSAGE:
          dispatch(chatActions.editMessage(message));
          break;
        case typesMessage.DELETE_MESSAGE:
          dispatch(chatActions.deleteMessage(message));
          break;
        default: break;
      }
    };
    
    return () => {
      ChatWebSocketService.onMessageCallback = () => {};
      ChatWebSocketService.disconnect();
    };
  }, [token]);

  useEffect(() => {
    const subscribeChats = async () => {
      try {
        const response = await dispatch(fetchChats(
          { filterMode: ChatTypes.ALL, getLastMess: false, pageSize: 999999 } //Получение всех чатов у пользователя
        )).unwrap();
        const { chats } = response;

        for (const chat of chats) {
          ChatWebSocketService.subscribe(chat.chatId);
        }
      } catch (error) {
        console.log(error);
      }
    };

    subscribeChats();
  }, []);

  useEffect(() => {
    ChatWebSocketService.onNotificationsCallback = async (notification: ChatNotification) => {
      try {
        const response = await dispatch(fetchChatInfo({ chatId: notification.chatId })).unwrap();

        ChatWebSocketService.subscribe(notification.chatId);

        const newChat: Chat = {
          chatId: response.chatId,
          lastMessage: response.lastMessages[0],
          chatName: response.chatName,
          chatType: isPublicChat(response) ? ChatTypes.PUBLIC : ChatTypes.PRIVATE,
        };

        dispatch(chatActions.addChat(newChat));
      } catch (error) {
        console.log(error);
      }
    };

    return () => {
      ChatWebSocketService.onNotificationsCallback = () => {};
    };
  }, [dispatch]);

  if (windowWidth <= MOBILE_MAX_BREAKPOINT) {
    return (
      <div className={classNames(styles.ChatPanel, [className])}>
        {!selectedChat && <Dialogs className={styles.dialogs} />}

        {selectedChat && !isActiveInfoPanel && <SelectedChat className={styles.selectedChat} /> }

        {isActiveInfoPanel && <InfoChat className={styles.infoChat} /> }
      </div>
    );
  }

  return (
    <div className={classNames(styles.ChatPanel, [className])}>
      <Dialogs className={styles.dialogs} />
      <SelectedChat className={styles.selectedChat}/>

      {isActiveInfoPanel && selectedChat && <InfoChat className={styles.infoChat} />}
    </div>
  );
};

export default ChatPanel;
