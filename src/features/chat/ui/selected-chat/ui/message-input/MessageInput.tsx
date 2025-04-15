import React, { useEffect, useRef, useState } from 'react';
import ChatWebSocketService from '../../../../model/service/ChatWebSocketService.ts';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import { NewMessage } from '../../../../model/types/newMessage.ts';
import { getChatSelectedChat } from '../../../../model/selectors/getChatSelectedChat.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import styles from './MessageInput.module.scss';
import { icons, SvgIcon } from '@/shared/ui';
import { isPublicChat } from '@/shared/lib/utils/isPublicChat.ts';

export interface MessageInputProps {
    className?: string;
}

const minHeight = '50px';

const MessageInput: React.FC<MessageInputProps> = (props) => {
  const { className } = props;

  const [messageText, setMessageText] = useState<string>('');
  const user = useSelector(getUserData)!;
  const selectedChat = useSelector(getChatSelectedChat)!;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const sendHandler = () => {
    if (!messageText.trim()) return;

    const newMessage: NewMessage = {
      message: messageText,
      senderId: user.userId,
      recipientId: isPublicChat(selectedChat)
        ? ''
        : selectedChat.members.find(member => member.memberId !== user.userId)!.memberId,
      chatId: selectedChat.chatId,
      topicId: isPublicChat(selectedChat) ? selectedChat.topics[0].topicId : '',
    };
    ChatWebSocketService.sendMessage(newMessage);
    setMessageText('');

    if (textareaRef.current && containerRef.current) {
      textareaRef.current.style.height = minHeight;
      containerRef.current.style.height = minHeight;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendHandler();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, 255);
    setMessageText(value);

    if (textareaRef.current && containerRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;

      containerRef.current.style.height = textareaRef.current.style.height;
    }
  };

  useEffect(() => {
    setMessageText('');

    if (textareaRef.current && containerRef.current) {
      textareaRef.current.style.height = minHeight;
      containerRef.current.style.height = minHeight;
    }
  }, [selectedChat]);

  return (
    <div ref={containerRef} className={classNames(styles.MessageInput, [className])}>
      <SvgIcon
        iconName={icons.PAPER_CLIP}
        className={styles.files}
        important
      />

      <textarea
        ref={textareaRef}
        className={styles.input}
        value={messageText}
        onChange={handleInputChange}
        placeholder={'Write a message...'}
        onKeyDown={handleKeyDown}
        rows={1}
        maxLength={255}
      />

      <div className={styles.rightSide}>
        <SvgIcon
          iconName={icons.SMILE}
          className={styles.smile}
          important
        />

        <SvgIcon
          iconName={icons.SEND}
          applyFill={false}
          applyStroke
          applyHover={Boolean(messageText)}
          important={Boolean(messageText)}
          style={{
            cursor: messageText ? 'pointer' : 'default',
          }}
          onClick={sendHandler}
        />
      </div>
    </div>
  );
};

export default MessageInput;
