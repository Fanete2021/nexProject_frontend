import React, { useEffect, useRef } from 'react';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import styles from './ChatPanel.module.scss';
import Dialogs from './ui/dialogs/Dialogs.tsx';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { fetchChats } from '../../model/service/fetchChats.ts';
import SelectedChat from './ui/selected-chat/SelectedChat.tsx';
import { useSelector } from 'react-redux';
import { getAuthToken } from '@/features/account/auth';
import ChatWebSocketService from '../../model/service/ChatWebSocketService.ts';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import { Message, typesMessage } from '../../model/types/message.ts';
import { chatActions } from '../../model/slice/chatSlice.ts';
import { ChatNotification } from '../../model/types/chatNotifications.ts';
import { fetchChatInfo } from '../../model/service/fetchChatInfo.ts';
import { Chat } from '../../model/types/chat.ts';
import { ChatTypes } from '../../model/types/chatTypes.ts';
import { getChatIsActiveInfoPanel } from '../../model/selectors/getChatIsActiveInfoPanel.ts';
import InfoChat from '@/features/chat/ui/chat-panel/ui/info-chat/InfoChat.tsx';
import { getChatSelectedChat } from '../../model/selectors/getChatSelectedChat.ts';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';
import { isPublicChat } from '@/shared/lib/utils/isPublicChat.ts';
import { MOBILE_MAX_BREAKPOINT } from '@/shared/const/WindowBreakpoints.ts';
import { useResizablePanel } from '@/shared/lib/hooks/useResizablePanel.ts';
import { getChatDialogsFilter } from '../../model/selectors/getChatDialogsFilter.ts';
import { getChatIsLoadingSelectedChat } from '../../model/selectors/getChatIsLoadingSelectedChat.ts';
import SelectedChatSkeleton from './ui/selected-chat/SelectedChatSkeleton.tsx';

export interface ChatProps {
    className?: string;
}

const MIN_PANEL_WIDTH = 200;
const MAX_PANEL_WIDTH = 400;

const ChatPanel: React.FC<ChatProps> = (props) => {
  const { className } = props;
  
  const dispatch = useAppDispatch();
  const windowWidth = useWindowWidth();
  
  const token = useSelector(getAuthToken)!;
  const user = useSelector(getUserData)!;
  const isActiveInfoPanel = useSelector(getChatIsActiveInfoPanel);
  const selectedChat = useSelector(getChatSelectedChat);
  const dialogsFilter = useSelector(getChatDialogsFilter);
  const isLoadingSelectedChat = useSelector(getChatIsLoadingSelectedChat);
  
  const panelRef = useRef<HTMLDivElement>(null);

  const { width: leftPanelWidth, startResize: startResizeLeft } = useResizablePanel({
    minWidth: MIN_PANEL_WIDTH,
    maxWidth: MAX_PANEL_WIDTH,
    initialWidth: MIN_PANEL_WIDTH,
    direction: 'left',
    containerRef: panelRef,
  });

  const { width: rightPanelWidth, startResize: startResizeRight } = useResizablePanel({
    minWidth: MIN_PANEL_WIDTH,
    maxWidth: MAX_PANEL_WIDTH,
    initialWidth: MIN_PANEL_WIDTH,
    direction: 'right',
    containerRef: panelRef,
  });


  useEffect(() => {
    ChatWebSocketService.connect(token, user.userId);

    ChatWebSocketService.onMessageCallback = (message: Message) => {
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

        const isPublic = isPublicChat(response);

        const newChat: Chat = {
          chatId: response.chatId,
          lastMessage: response.lastMessages[0],
          chatName: response.chatName,
          chatType: isPublic ? ChatTypes.PUBLIC : ChatTypes.PRIVATE,
        };

        if (
          dialogsFilter === ChatTypes.ALL ||
          (isPublic && dialogsFilter === ChatTypes.PUBLIC) ||
          (!isPublic && dialogsFilter === ChatTypes.PRIVATE)
        ) {
          dispatch(chatActions.addChat(newChat));
        }

        //При выборе пустого диалога chatId = ''
        if (selectedChat && !selectedChat.chatId) {
          dispatch(chatActions.setSelectedChat(response));
        }
      } catch (error) {
        console.log(error);
      }
    };

    return () => {
      ChatWebSocketService.onNotificationsCallback = () => {};
    };
  }, [dispatch, selectedChat, dialogsFilter]);

  if (windowWidth <= MOBILE_MAX_BREAKPOINT) {
    return (
      <div className={classNames(styles.ChatPanel, [className])}>
        {!selectedChat && <Dialogs className={styles.dialogs} />}

        {selectedChat && !isActiveInfoPanel && (
          isLoadingSelectedChat 
            ? <SelectedChatSkeleton className={styles.selectedChat} />
            : <SelectedChat className={styles.selectedChat} />
        )}

        {isActiveInfoPanel && <InfoChat className={styles.infoChat} /> }
      </div>
    );
  }

  return (
    <div className={classNames(styles.ChatPanel, [className])} ref={panelRef}>
      <Dialogs className={styles.dialogs} style={{ width: `${leftPanelWidth}px` }}/>

      <div
        className={styles.leftResizeHandle}
        onMouseDown={startResizeLeft}
      />

      {isLoadingSelectedChat
        ? <SelectedChatSkeleton className={styles.selectedChat} />
        : <SelectedChat className={styles.selectedChat} />
      }

      {isActiveInfoPanel && selectedChat && (
        <>
          <div
            className={styles.rightResizeHandle}
            onMouseDown={startResizeRight}
          />

          <InfoChat className={styles.infoChat} style={{ width: `${rightPanelWidth}px` }} />
        </>
      )}
    </div>
  );
};

export default ChatPanel;
