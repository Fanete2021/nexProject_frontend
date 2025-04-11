import React, { useCallback } from 'react';
import { Chat } from '../../../../model/types/chat.ts';
import styles from './DialogItem.module.scss';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { fetchSelectedChatInfo } from '../../../../model/service/fetchSelectedChatInfo.ts';
import { Avatar } from '@/shared/ui';
import { Contact } from '../../../../model/types/contact.ts';
import { ChatInfo } from '../../../../model/types/chatInfo.ts';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import { chatActions } from '@/features/chat';

export interface DialogItemProps {
  chatData?: Chat;
  contactData?: Contact;
  className?: string;
}

const DialogItem: React.FC<DialogItemProps> = (props) => {
  const { chatData, contactData } = props;
  const dispatch = useAppDispatch();
  const user = useSelector(getUserData)!;
    
  const clickHandler = useCallback(async () => {
    if (chatData) {
      try {
        await dispatch(fetchSelectedChatInfo({ chatId: chatData.chatId })).unwrap();
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
      className={styles.DialogItem}
    >
      <Avatar
        text={chatData?.chatName || contactData?.name || contactData?.username}
        height={40}
        width={40}
      />

      <div className={styles.info}>
        <div className={styles.name}>
          {chatData?.chatName || contactData?.name || contactData?.username}
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
