import React, { useCallback } from 'react';
import { Chat } from '../../../../model/types/chat.ts';
import styles from './DialogItem.module.scss';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { fetchChatInfo } from '../../../../model/service/fetchChatInfo.ts';
import { Avatar } from '@/shared/ui';
import { Contact } from '../../../../model/types/contact.ts';
import { ChatInfo } from '../../../../model/types/chatInfo.ts';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import { chatActions } from '../../../../model/slice/chatSlice.ts';
import { getChatSelectedChat } from '../../../../model/selectors/getChatSelectedChat.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { formatLastMessageDateTime } from '@/shared/lib/utils/formatLastMessageDateTime.ts';

export interface DialogItemProps {
  chatData?: Chat;
  contactData?: Contact;
  className?: string;
}

const DialogItem: React.FC<DialogItemProps> = (props) => {
  const { chatData, contactData, className } = props;
  const dispatch = useAppDispatch();
  const user = useSelector(getUserData)!;
  const selectedChat = useSelector(getChatSelectedChat);
    
  const clickHandler = useCallback(async () => {
    if (chatData && selectedChat?.chatId !== chatData.chatId) {
      try {
        const response = await dispatch(fetchChatInfo({ chatId: chatData.chatId })).unwrap();
        dispatch(chatActions.setSelectedChat(response));
      } catch (error) {
        console.log(error);
      }
    }

    if (contactData) {
      const chatInfo: ChatInfo = {
        chatId: '',
        lastMessages: [],
        chatName: contactData.name || contactData?.username,
        members: [
          {
            memberId: user.userId,
            admin: false,
            memberName: user.name
          },
          {
            memberId: contactData.userId,
            admin: false,
            memberName: contactData.name
          }
        ]
      };

      dispatch(chatActions.setSelectedChat(chatInfo));
    }
  }, []);

  return (
    <button
      onClick={clickHandler}
      className={classNames(
        styles.DialogItem,
        [className],
        {
          [styles.selectedDialog]: selectedChat?.chatId && chatData?.chatId === selectedChat.chatId,
        }
      )}
    >
      <Avatar
        text={chatData?.chatName || contactData?.name || contactData?.username}
        height={40}
        width={40}
        className={styles.avatar}
      />

      <div className={styles.info}>
        <div className={styles.topSide}>
          <div className={styles.name}>
            {chatData?.chatName || contactData?.name || contactData?.username}
          </div>

          {chatData?.lastMessage && (
            <div className={styles.date}>
              {formatLastMessageDateTime(chatData.lastMessage.sendDate)}
            </div>
          )}
        </div>

        {chatData?.lastMessage &&
          <div className={styles.message}>
            {chatData.lastMessage.message}
          </div>
        }
      </div>
    </button>
  );
};

export default DialogItem;
