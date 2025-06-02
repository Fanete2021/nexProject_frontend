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

  const scrollbarRef = useRef<Scrollbars>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const user = useSelector(getUserData)!;
  const isLoadingMessages = useSelector(getChatIsLoadingMessages);

  useEffect(() => {
    if (!scrollbarRef.current) return;

    const scrollTop = scrollbarRef.current.getScrollTop();

    setCurrentScrollTop(scrollTop);
  }, [scrollbarRef]);

  useEffect(() => {
    setMessages(props.messages);
  }, [props.messages]);

  useLayoutEffect(() => {
    if (isAtBottom) {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    } else {
      if (!isUserScrolling.current && scrollbarRef.current) {
        const scrollTop = scrollbarRef.current.getScrollTop();
        const scrollHeight = scrollbarRef.current.getScrollHeight();
        const clientHeight = scrollbarRef.current.getClientHeight();
        const shouldScrollToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;

        if (shouldScrollToBottom) {
          scrollToBottom();
        }
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

    clearTimeout(scrollTimeout.current);
    isUserScrolling.current = true;

    const scrollTop = scrollbarRef.current.getScrollTop();
    const scrollHeight = scrollbarRef.current.getScrollHeight();
    const clientHeight = scrollbarRef.current.getClientHeight();

    const userScrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 100;
    setIsAtBottom(userScrolledToBottom);

    setCurrentScrollTop(scrollTop);

    scrollTimeout.current = setTimeout(() => {
      isUserScrolling.current = false;
    }, 200);
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
          {isLoadingMessages && <Loader className={styles.loader} />}
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
