import { useSelector } from 'react-redux';
import { getChatSelectedChat } from '../../../../model/selectors/getChatSelectedChat.ts';
import styles from './SelectedChat.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { ChatTypes } from '../../../../model/types/chatTypes.ts';
import Header from './components/header/Header.tsx';
import Messages from './components/messages/Messages.tsx';
import MessageInput from './components/message-input/MessageInput.tsx';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import React, { useEffect, useState } from 'react';
import { GroupedMessage } from './components/messages/model/types/groupedMessage.ts';
import { groupMessages } from './components/messages/libs/utils/groupMessages.ts';
import ChatWebSocketService from '../../../../model/service/ChatWebSocketService.ts';
import { getAuthToken } from '@/features/account/auth';
import { getUserData } from '@/entities/user';
import { editMessage, EditMessageProps } from '../../../../model/service/editMessage.ts';
import { deleteMessage, DeleteMessageProps } from '../../../../model/service/deleteMessage.ts';
import { getChatIsLoadingMessages } from '../../../../model/selectors/getChatIsLoadingMessages.ts';
import { Message, MessageTypes } from '../../../../model/types/message.ts';
import { chatActions } from '../../../../model/slice/chatSlice.ts';
import { fetchMessages } from '../../../../model/service/fetchMessages.ts';
import { isPublicChat } from '../../../../utils/libs/isPublicChat.ts';
import { icons, SvgIcon } from '@/shared/ui';

export interface SelectedChatProps {
  className?: string;
}

const MESSAGE_FETCH_LIMIT  = 50;

const SelectedChat: React.FC<SelectedChatProps> = (props) => {
  const { className } = props;
  
  const dispatch = useAppDispatch();

  const token = useSelector(getAuthToken)!;
  const user = useSelector(getUserData)!;
  const selectedChat = useSelector(getChatSelectedChat);
  const isLoadingMessages = useSelector(getChatIsLoadingMessages);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageCount, setMessageCount] = useState(0);
  const [groupedMessages, setGroupedMessages] = useState<GroupedMessage[]>([]);

  useEffect(() => {
    ChatWebSocketService.connect(token, user.userId);

    ChatWebSocketService.onMessageCallback = (message: Message) => {
      switch (message.type) {
        case MessageTypes.NEW_MESSAGE:
          dispatch(chatActions.addMessage(message));

          if (selectedChat?.chatId === message.chatId) {
            setMessages(prev => [message, ...prev]);
            setMessageCount(prev => prev + 1);
          }
          break;
        case MessageTypes.EDIT_MESSAGE:
          dispatch(chatActions.editMessage(message));

          if (selectedChat?.chatId === message.chatId) {
            const messageIndex = messages.findIndex(
              message => message.messageId === message.messageId
            );

            if (messageIndex !== -1) {
              setMessages(prev => prev.map(msg =>
                msg.messageId === message.messageId ? message : msg
              ));
            }
          }
          break;
        case MessageTypes.DELETE_MESSAGE:
          if (selectedChat?.chatId === message.chatId) {
            setMessages(prev => prev.filter(msg => msg.messageId !== message.messageId));
            setMessageCount(prev => prev - 1);
          }
          break;
        default: break;
      }
    };

    return () => {
      ChatWebSocketService.onMessageCallback = () => {};
      ChatWebSocketService.disconnect();
    };
  }, [token, messages]);

  useEffect(() => {
    setCurrentPage(1);
    setMessageCount(selectedChat?.messageCount || 0);
  }, [selectedChat]);

  useEffect(() => {
    const grouped = groupMessages(messages);
    setGroupedMessages(grouped);
  }, [messages]);

  useEffect(() => {
    if (selectedChat?.lastMessages) {
      setMessages(selectedChat.lastMessages);
    } else {
      setMessages([]);
    }
  }, [selectedChat?.lastMessages]);
  
  const changeMessage = async (props: EditMessageProps) => {
    dispatch(editMessage(props));
  };

  const deleteMessageHandler = async (props: DeleteMessageProps) => {
    dispatch(deleteMessage(props));
  };

  if (!selectedChat) {
    return (
      <div className={styles.empty}>
        <SvgIcon
          iconName={icons.PEOPLE}
          className={styles.iconPeople}
          applyHover={false}
          applyStroke
          applyFill={false}
        />

        Select a chat to start messaging
      </div>
    );
  }

  const loadMessages = async () => {
    if (!isLoadingMessages && messageCount > messages.length) {
      try {
        const response = await dispatch(fetchMessages({
          chatId: selectedChat.chatId,
          pageNumber: currentPage + 1,
          pageSize: MESSAGE_FETCH_LIMIT,
        })).unwrap();

        setCurrentPage(currentPage + 1);
        setMessages(prev => [...prev, ...response.messages]);

      } catch (error) {
        console.error('Ошибка при загрузке сообщений:', error);
      }
    }
  };
  
  return (
    <div className={classNames(styles.SelectedChat, [className])}>
      <Header chatInfo={selectedChat} className={styles.Header}/>

      <Messages
        messages={groupedMessages}
        className={styles.Messages}
        chatId={selectedChat.chatId}
        chatType={isPublicChat(selectedChat) ? ChatTypes.PUBLIC : ChatTypes.PRIVATE}
        loadMessages={loadMessages}
        deleteMessage={deleteMessageHandler}
      />

      <MessageInput 
        className={styles.MessageInput}
        changeMessage={changeMessage}
      />
    </div>
  );
};

export default SelectedChat;
