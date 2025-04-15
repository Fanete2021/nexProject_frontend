import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Message } from '../../../../model/types/message.ts';
import { User } from '@/entities/user';
import styles from './Messages.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { Avatar, Scrollbar } from '@/shared/ui';
import { formatDateLocalized } from '@/shared/lib/utils/formatDateLocalized.ts';
import { formatTimeLocalized } from '@/shared/lib/utils/formatTimeLocalized.ts';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useSelector } from 'react-redux';
import { getChatIsLoadingMessages } from '../../../../model/selectors/getChatIsLoadingMessages.ts';
import { fetchMessages } from '../../../../model/service/fetchMessages.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { ChatTypes } from '../../../../model/types/chatTypes.ts';

export interface MessagesProps {
  messages: Message[];
  user: User;
  className?: string;
  chatId: string;
  messageCount: number;
  chatType: ChatTypes;
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
    const messageDate = formatDateLocalized(message.sendDate.toLocaleString());
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

const COUNT_MESSAGE = 50;

const Messages: React.FC<MessagesProps> = (props) => {
  const { user, className, messageCount, chatId, chatType } = props;

  const [groupedMessages, setGroupedMessages] = useState<GroupedMessage[]>([]);
  const scrollbarRef = useRef<Scrollbars>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const isLoadingMessages = useSelector(getChatIsLoadingMessages);
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState<number>(1); //TODO поменять на 2, сейчас у бэка с 0 пагинация

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
    if (scrollbarRef.current) {
      scrollbarRef.current.scrollToBottom(); // Используем метод scrollToBottom
    }
  };

  const scrollHandler = async () => {
    if (!scrollbarRef.current) return;

    const scrollTop = scrollbarRef.current.getScrollTop();
    const scrollHeight = scrollbarRef.current.getScrollHeight();
    const clientHeight = scrollbarRef.current.getClientHeight();

    const userScrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) <= 5; // Погрешность проверки
    setIsAtBottom(userScrolledToBottom);

    if (scrollTop <= 0 && !isLoadingMessages && messageCount > props.messages.length) {
      try {
        dispatch(fetchMessages({
          chatId: chatId,
          pageNumber: currentPage,
          pageSize: COUNT_MESSAGE,
        }));

        setCurrentPage(currentPage + 1);
      } catch (error) {
        console.error('Ошибка при загрузке сообщений:', error);
      } 
    }
  };

  return (
    <div className={className}>
      <Scrollbar
        onScroll={scrollHandler}
        ref={scrollbarRef}
      >
        <div className={styles.Messages}>
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
                        {index === 0 && chatType === ChatTypes.PUBLIC &&
                          <div className={styles.sender}>
                            {message.senderName}
                          </div>
                        }

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
      </Scrollbar>
    </div>
  );
};

export default Messages;
