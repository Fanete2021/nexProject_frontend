import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getUserData } from '@/entities/user';
import styles from './Messages.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { ActionMenu, ActionMenuPosition, Avatar, Loader, Scrollbar } from '@/shared/ui';
import { formatTimeLocalized } from '@/shared/lib/utils/formatTimeLocalized.ts';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { ChatTypes } from '../../../../../../model/types/chatTypes.ts';
import { DeleteMessageProps } from '../../../../../../model/service/deleteMessage.ts';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';
import { MOBILE_MAX_BREAKPOINT } from '@/shared/const/WindowBreakpoints.ts';
import { chatActions } from '../../../../../../model/slice/chatSlice.ts';
import { GroupedMessage } from './model/types/groupedMessage.ts';
import { GroupTypes } from './model/types/groupTypes.ts';
import { useSelector } from 'react-redux';
import { getChatIsLoadingMessages } from '../../../../../../model/selectors/getChatIsLoadingMessages.ts';
import { findMessageById } from './libs/utils/findMessageById.ts';
import { useDebounce } from '@/shared/lib/hooks/useDebounce.ts';

export interface MessagesProps {
  messages: GroupedMessage[];
  className?: string;
  chatId: string;
  chatType: ChatTypes;
  loadMessages: () => void;
  deleteMessage: (props: DeleteMessageProps) => void;
}

const Messages: React.FC<MessagesProps> = (props) => {
  const { className, chatId, chatType, loadMessages, deleteMessage } = props;

  const dispatch = useAppDispatch();
  const windowWidth = useWindowWidth();

  const [messages, setMessages] = useState<GroupedMessage[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const [actionMenuPosition, setActionMenuPosition] = useState<ActionMenuPosition | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [currentScrollTop, setCurrentScrollTop] = useState<number | null>(null);
  const [lastAddedPosition, setLastAddedPosition] = useState<'top' | 'bottom'>('bottom');
  const [lastFirstMessageId, setLastFirstMessageId] = useState<string | null>(null);

  const scrollbarRef = useRef<Scrollbars>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number | null>(null);
  const prevScrollTopRef = useRef<number | null>(null);

  const user = useSelector(getUserData)!;
  const isLoadingMessages = useSelector(getChatIsLoadingMessages);

  useEffect(() => {
    const findFirstMessage = () => {
      for (const group of props.messages) {
        if (group.type === GroupTypes.MESSAGE && group.messages?.[0]) {
          return group.messages[group.messages.length - 1].messageId;
        }
      }
      return null;
    };

    const currentFirstId = findFirstMessage();

    if (currentFirstId && lastFirstMessageId && currentFirstId === lastFirstMessageId) {
      setLastAddedPosition('top');
    } else {
      setLastAddedPosition('bottom');
    }

    setLastFirstMessageId(currentFirstId);

    if (scrollbarRef.current && !isAtBottom) {
      prevScrollHeightRef.current = scrollbarRef.current.getScrollHeight();
      prevScrollTopRef.current = scrollbarRef.current.getScrollTop();
    }

    setMessages([...props.messages].reverse());
  }, [props.messages]);

  useLayoutEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    } else {
      if (
        scrollbarRef.current &&
        prevScrollHeightRef.current !== null &&
        prevScrollTopRef.current !== null
      ) {
        const newScrollHeight = scrollbarRef.current.getScrollHeight();
        const heightDiff = newScrollHeight - prevScrollHeightRef.current;

        const newScrollTop = lastAddedPosition === 'top'
          ? prevScrollTopRef.current + heightDiff
          : prevScrollTopRef.current;

        scrollbarRef.current.scrollTop(newScrollTop);

        prevScrollHeightRef.current = null;
        prevScrollTopRef.current = null;
      }
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();

    dispatch(chatActions.setEditableMessage(undefined));
  }, [chatId]);

  const scrollToBottom = () => {
    if (scrollbarRef.current) {
      scrollbarRef.current.scrollToBottom();
    }
  };

  const scrollHandler = async () => {
    if (!scrollbarRef.current) return;

    const scrollTop = scrollbarRef.current.getScrollTop();
    const scrollHeight = scrollbarRef.current.getScrollHeight();
    const clientHeight = scrollbarRef.current.getClientHeight();

    const userScrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 100;
    setIsAtBottom(userScrolledToBottom);

    setCurrentScrollTop(scrollTop);
  };

  useDebounce(() => {
    if (currentScrollTop !== null && currentScrollTop < 350) {
      loadMessages();
    }
  }, 100);

  const openActionMenuHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, messageId: string) => {
    event.preventDefault();
    setActionMenuPosition({ x: event.clientX, y: event.clientY });
    setSelectedMessageId(messageId);
  };

  const closeActionMenuHandler = () => {
    setActionMenuPosition(null);
    setSelectedMessageId(null);
  };

  const editMessageHandler = () => {
    const editableMessage = findMessageById(messages, selectedMessageId!)!;
    dispatch(chatActions.setEditableMessage(editableMessage));
    closeActionMenuHandler();
  };

  const deleteMessageHandler = () => {
    deleteMessage({ messageId: selectedMessageId!, chatId: chatId });
    closeActionMenuHandler();
  };

  return (
    <div className={className}>
      <Scrollbar
        onScroll={scrollHandler}
        ref={scrollbarRef}
      >
        <div
          className={styles.Messages}
          ref={messagesRef}
        >
          {isLoadingMessages && <Loader className={styles.loader} />}

          {messages.map((group, index) => (
            <div
              key={index}
              className={classNames(
                styles.messageGroup,
                [],
                {
                  [styles.myMessageGroup]: group.messages && group.messages[0].senderId === user.userId
                }
              )}
            >
              {group.type === GroupTypes.DATE &&
                <div className={styles.dateSeparator}>
                  {group.date}
                </div>
              }

              {group.type === GroupTypes.MESSAGE &&
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
                        onContextMenu={message.senderId === user.userId
                          ? (event) => openActionMenuHandler(event, message.messageId)
                          : undefined
                        }
                        onClick={windowWidth <= MOBILE_MAX_BREAKPOINT && message.senderId === user.userId
                          ? (event) => openActionMenuHandler(event, message.messageId)
                          : undefined
                        }
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
                            {message.edited && 'ред. '}
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

      <ActionMenu
        deleteHandler={deleteMessageHandler}
        editHandler={editMessageHandler}
        onClose={closeActionMenuHandler}
        position={actionMenuPosition}
      />
    </div>
  );
};

export default Messages;
