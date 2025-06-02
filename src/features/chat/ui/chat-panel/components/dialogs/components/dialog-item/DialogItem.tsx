import React from 'react';
import { Chat } from '../../../../../../model/types/chat.ts';
import styles from './DialogItem.module.scss';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { fetchChatInfo } from '../../../../../../model/service/fetchChatInfo.ts';
import { Avatar, icons, SvgIcon } from '@/shared/ui';
import { ChatInfo } from '../../../../../../model/types/chatInfo.ts';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import { chatActions } from '../../../../../../model/slice/chatSlice.ts';
import { getChatSelectedChat } from '../../../../../../model/selectors/getChatSelectedChat.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { formatLastMessageDateTime } from '@/shared/lib/utils/formatLastMessageDateTime.ts';
import { ChatTypes } from '../../../../../../model/types/chatTypes.ts';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';
import { MOBILE_MAX_BREAKPOINT } from '@/shared/const/WindowBreakpoints.ts';
import { Contact } from '@/entities/contact';

export interface DialogItemProps {
  chatData?: Chat;
  contactData?: Contact;
  className?: string;
  openContextMenu?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, chat: Chat) => void;
}

const DialogItem: React.FC<DialogItemProps> = (props) => {
  const { chatData, contactData, className, openContextMenu } = props;
  const dispatch = useAppDispatch();
  const user = useSelector(getUserData)!;
  const selectedChat = useSelector(getChatSelectedChat);
  const windowWidth = useWindowWidth();

  const setupSelectedChat = async (chatId: string) => {
    try {
      dispatch(chatActions.setIsLoadingSelectedChat(true));
      const response = await dispatch(fetchChatInfo({ chatId: chatId })).unwrap();
      dispatch(chatActions.setSelectedChat(response));
      dispatch(chatActions.setIsLoadingSelectedChat(false));
    } catch (error) {
      console.log(error);
    }
  };

  const clickHandler = async () => {
    if (chatData && selectedChat?.chatId !== chatData.chatId) {
      setupSelectedChat(chatData.chatId);
    }

    if (contactData) {
      if (contactData.chatId) {
        setupSelectedChat(contactData.chatId);
      } else {
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
          ],
          messageCount: 0,
          topics: []
        };

        dispatch(chatActions.setSelectedChat(chatInfo));
      }
    }
  };

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
      onContextMenu={openContextMenu && chatData && chatData.chatType === ChatTypes.PRIVATE
        ? (event) => openContextMenu(event, chatData)
        : undefined
      }
    >
      <Avatar
        text={chatData?.chatName || contactData?.name || contactData?.username}
        height={windowWidth > MOBILE_MAX_BREAKPOINT ? 40 : 50}
        width={windowWidth > MOBILE_MAX_BREAKPOINT ? 40 : 50}
        className={styles.avatar}
      />

      <div className={styles.info}>
        <div className={styles.topSide}>
          <div className={styles.name}>
            {chatData?.chatType === ChatTypes.PUBLIC &&
              <SvgIcon
                iconName={icons.GROUP}
                className={styles.iconPublic}
                applyHover={false}
                important
              />
            }

            <span>
              {chatData?.chatName || contactData?.name || contactData?.username}
            </span>
          </div>

          {chatData?.lastMessage && (
            <div className={styles.date}>
              {formatLastMessageDateTime(chatData.lastMessage.sendDate)}
            </div>
          )}
        </div>

        {chatData?.lastMessage &&
          <div className={styles.message}>
            {chatData?.chatType === ChatTypes.PUBLIC && (
              user.userId === chatData.lastMessage.senderId
                ? 'Вы: '
                : `${chatData.lastMessage.senderName}: `
            )}
            {chatData.lastMessage.message}
          </div>
        }
      </div>
    </button>
  );
};

export default DialogItem;
