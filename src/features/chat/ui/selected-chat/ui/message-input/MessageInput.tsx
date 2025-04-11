import React, { useState } from 'react';
import ChatWebSocketService from '../../../../model/service/ChatWebSocketService.ts';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import { NewMessage } from '../../../../model/types/newMessage.ts';
import { getChatSelectedChat } from '../../../../model/selectors/getChatSelectedChat.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import styles from './MessageInput.module.scss';

export interface MessageInputProps {
    className?: string;
}

const MessageInput: React.FC<MessageInputProps> = (props) => {
  const { className } = props;
    
  const [messageText, setMessageText] = useState<string>('');
  const user = useSelector(getUserData)!;
  const selectedChat = useSelector(getChatSelectedChat)!;
    
  const sendHandler = () => {
    const newMessage: NewMessage = {
      message: messageText,
      senderId: user.userId,
      recipientId: selectedChat.members.find(member => member.memberId !== user.userId)!.memberId,
      chatId: selectedChat.chatId
    };
    ChatWebSocketService.sendMessage(newMessage);
    setMessageText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendHandler();
    }
  };

  return (
    <div className={classNames(styles.MessageInput, [className])}>
      <input
        className={styles.input}
        value={messageText} 
        onChange={e => setMessageText(e.target.value)}
        placeholder={'Write a message...'}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default MessageInput;
