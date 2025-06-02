import React, { useCallback, useState, useEffect, useRef } from 'react';
import ChatWebSocketService from '../../../../../../model/service/ChatWebSocketService.ts';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import { NewMessage } from '../../../../../../model/types/newMessage.ts';
import { getChatSelectedChat } from '../../../../../../model/selectors/getChatSelectedChat.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import styles from './MessageInput.module.scss';
import { CustomTextarea, icons, SvgIcon } from '@/shared/ui';
import { useTranslation } from 'react-i18next';
import { useDebouncedMessageDraft } from '../../../../../../model/hooks/useDebouncedMessageDraft.ts';
import { getChatEditableMessage } from '../../../../../../model/selectors/getChatEditableMessage.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { chatActions } from '../../../../../../model/slice/chatSlice.ts';
import { EditMessageProps } from '../../../../../../model/service/editMessage.ts';
import { getChatIsLoadingSelectedChat } from '../../../../../../model/selectors/getChatIsLoadingSelectedChat.ts';
import { SmilePicker } from '@/widgets/pickers/smile-picker';
import { isPublicChat } from '../../../../../../utils/libs/isPublicChat.ts';

export interface MessageInputProps {
  className?: string;
  changeMessage: (props: EditMessageProps) => void;
}

const MAX_LENGTH = 255;

const MessageInput: React.FC<MessageInputProps> = (props) => {
  const { className, changeMessage } = props;

  const user = useSelector(getUserData)!;
  const selectedChat = useSelector(getChatSelectedChat)!;
  const editableMessage = useSelector(getChatEditableMessage);
  const isLoadingSelectedChat = useSelector(getChatIsLoadingSelectedChat);
  
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [messageText, setMessageText] = useDebouncedMessageDraft(selectedChat?.chatId);
  
  const [localMessageText, setLocalMessageText] = useState<string>(editableMessage?.message || '');
  
  const currentMessageText = editableMessage ? localMessageText : messageText;
  const isMessageValid = Boolean(currentMessageText.trim());
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editableMessage) {
      setLocalMessageText(editableMessage.message);
      textareaRef.current?.focus();
    }
  }, [editableMessage]);

  const sendHandler = () => {
    if (!isMessageValid || isLoadingSelectedChat) return;

    if (editableMessage) {
      changeMessage({
        chatId: editableMessage.chatId,
        messageId: editableMessage.messageId,
        newMessage: currentMessageText
      });
      clearEditableMessage();
    } else {
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
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        sendHandler();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, MAX_LENGTH);
    if (editableMessage) {
      setLocalMessageText(value);
    } else {
      setMessageText(value);
    }
  };

  const onEmojiSelectHandler = (emoji: string) => {
    if (editableMessage && localMessageText.length < MAX_LENGTH) {
      setLocalMessageText(prev => prev + emoji);
    } else if (messageText.length < MAX_LENGTH) {
      setMessageText(messageText + emoji);
    }
  };
  
  const clearEditableMessage = useCallback(() => {
    dispatch(chatActions.setEditableMessage(undefined));
    setLocalMessageText('');
  }, [dispatch]);

  return (
    <div className={classNames(styles.MessageInput, [className])}>
      {editableMessage &&
        <div className={styles.infoPanel}>
          <SvgIcon
            iconName={icons.EDIT}
            applyHover={false}
            applyStroke
            applyFill={false}
            className={styles.iconEdit}
          />

          <div className={styles.editableMessageWrapper}>
            <div className={styles.title}>Режим редактирования</div>
            <div className={styles.editableMessage}>{editableMessage.message}</div>
          </div>

          <SvgIcon
            iconName={icons.CROSS}
            applyHover={false}
            applyStroke
            applyFill={false}
            className={styles.iconCross}
            onClick={clearEditableMessage}
          />
        </div>
      }

      <div className={styles.fieldWrapper}>
        <SvgIcon
          iconName={icons.PAPER_CLIP}
          className={styles.files}
          important
        />

        <CustomTextarea
          maxHeight={100}
          value={currentMessageText}
          onChange={handleInputChange}
          classes={{
            wrapper: styles.inputWrapper,
            textarea: styles.input,
          }}
          maxLength={255}
          onKeyDown={handleKeyDown}
          placeholder={t('Напишите сообщение...')}
          ref={textareaRef}
        />

        <div className={styles.rightSide}>
          <SmilePicker onEmojiSelect={onEmojiSelectHandler} />

          <SvgIcon
            iconName={icons.SEND}
            applyFill={false}
            applyStroke
            applyHover={isMessageValid}
            important={isMessageValid}
            style={{
              cursor: isMessageValid ? 'pointer' : 'default',
            }}
            onClick={sendHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
