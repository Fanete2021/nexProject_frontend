import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Message } from '../../../../model/types/message.ts';
import { User } from '@/entities/user';
import styles from './Messages.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { Avatar } from '@/shared/ui';
import { formatDateLocalized } from '@/shared/lib/utils/formatDatreLocalized.ts';
import { formatTimeLocalized } from '@/shared/lib/utils/formatTimeLocalized.ts';

export interface MessagesProps {
  messages: Message[];
  user: User;
  className?: string;
  chatId: string;
}

enum GroupType {
  DATE = 'date',
  MESSAGE = 'message'
}

type GroupedMessage = {
  type: GroupType;
  date?: string;
  messages?: Message[];
};

const groupMessages = (messages: Message[], timeGap = 10 * 60 * 1000): GroupedMessage[] => {
  const grouped: GroupedMessage[] = [];
  let lastDate = '';
  let lastTimestamp = 0;
  let lastSenderId = '';

  const isNewGroup = (message: Message, timestamp: number): boolean => {
    return (
      timestamp - lastTimestamp > timeGap ||
      message.senderId !== lastSenderId
    );
  };

  messages.forEach((message) => {
    const messageDate = formatDateLocalized(message.sendDate);
    const messageTimestamp = new Date(message.sendDate).getTime();

    if (messageDate !== lastDate) {
      grouped.push({ type: GroupType.DATE, date: messageDate });
      lastDate = messageDate;
      lastTimestamp = 0;
      lastSenderId = '';
    }

    if (isNewGroup(message, messageTimestamp)) {
      grouped.push({ type: GroupType.MESSAGE, messages: [message] });
    } else {
      grouped[grouped.length - 1].messages!.push(message);
    }

    lastTimestamp = messageTimestamp;
    lastSenderId = message.senderId;
  });

  return grouped;
};

const Messages: React.FC<MessagesProps> = (props) => {
  const { user, className } = props;

  const [groupedMessages, setGroupedMessages] = useState<GroupedMessage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    const grouped = groupMessages([...props.messages].reverse());
    setGroupedMessages(grouped);
  }, [props.messages]);

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
          {group.type === GroupType.DATE &&
            <div className={styles.dateSeparator}>
              {group.date}
            </div>
          }

          {group.type === GroupType.MESSAGE &&
            <>
              <Avatar
                text={group.messages![0].senderName}
                className={styles.avatar}
                width={40}
                height={40}
              />

              <div className={styles.messages}>
                {group.messages!.map((message, index) => (
                  <div
                    key={message.messageId}
                    className={classNames(styles.message, [], {
                      [styles.myMessage]: message.senderId === user.userId,
                      [styles.topMessage]: index === 0,
                      [styles.middleMessage]: index > 0 && index < group.messages!.length - 1,
                      [styles.lastMessage]: index === group.messages!.length - 1
                    })}
                  >
                    {/*//TODO сделать для бесед*/}
                    {/*<div className={styles.sender}>*/}
                    {/*  {message.senderId}*/}
                    {/*</div>*/}

                    <div className={styles.textWrapper}>
                      <span className={styles.text}>
                        {message.message}
                      </span>

                      <span className={styles.time}>
                        {formatTimeLocalized(new Date(message.sendDate))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          }
        </div>
      ))}
    </div>
  );
};

export default Messages;
