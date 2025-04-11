import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Message } from '../../../../model/types/message.ts';
import { User } from '@/entities/user';
import { ChatWebSocketService } from '@/features/chat';
import styles from './Messages.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface MessagesProps {
  messages: Message[];
  user: User;
  className?: string;
  chatId: string;
}

const groupMessages = (messages: Message[]): Message[][] => {
  const grouped: Message[][] = [];
  messages.forEach((message) => {
    const lastGroup = grouped[grouped.length - 1];
    if (lastGroup && lastGroup[0].senderId === message.senderId) {
      lastGroup.push(message);
    } else {
      grouped.push([message]);
    }
  });
  return grouped;
};

const updateGroupedMessages = (
  newMessage: Message,
  currentGroups: Message[][]
): Message[][] => {
  const updatedGroups = [...currentGroups];

  const lastGroup = updatedGroups[updatedGroups.length - 1];

  if (lastGroup && lastGroup[0].senderId === newMessage.senderId) {
    lastGroup.push(newMessage);
  } else {
    updatedGroups.push([newMessage]);
  }

  return updatedGroups;
};

const Messages: React.FC<MessagesProps> = (props) => {
  const { user, className } = props;

  const [groupedMessages, setGroupedMessages] = useState<Message[][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    const grouped = groupMessages([...props.messages].reverse());
    setGroupedMessages(grouped);
  }, [props.messages]);

  // useEffect(() => {
  //   ChatWebSocketService.addOnMessageCallback(
  //     (message: Message, chatId: string) => {
  //       if (props.chatId === chatId) {
  //         const updatedGroupedMessages = updateGroupedMessages(message, groupedMessages);
  //         setGroupedMessages(updatedGroupedMessages);
  //       }
  //     }
  //   );
  //
  //   return () => {
  //     ChatWebSocketService.removeLastOnMessageCallback();
  //   };
  // }, [groupedMessages]);

  useLayoutEffect(() => {
    if (isAtBottom) {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [groupedMessages]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    const userScrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) <= 5; // погрешность проверки
    setIsAtBottom(userScrolledToBottom);
  };

  return (
    <div
      className={classNames(styles.Messages, [className])}
      onScroll={handleScroll}
      ref={containerRef}
    >
      {groupedMessages.map((group, index) => (
        <div key={index} className={styles.messageGroup}>
          {group.map((message) => (
            <div
              key={message.messageId}
              className={classNames(styles.message, [], {
                [styles.myMessage]: message.senderId === user.userId,
              })}
            >
              <div className={styles.sender}>
                {message.senderId}
              </div>

              <div className={styles.textWrapper}>
                <span className={styles.text}>
                  {message.message}
                </span>
                <span className={styles.time}>
                  {/* TODO перенести в utils */}
                  {new Date(message.sendDate).toLocaleTimeString(
                    [],
                    { hour: '2-digit', minute: '2-digit' }
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}

    </div>
  );
};

export default Messages;
