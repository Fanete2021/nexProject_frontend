import { FormControl } from '@mui/material';
import { Button, CustomInput, Tabs } from '@/shared/ui';
import styles from './NewMessageForm.module.scss';
import { NewMessage } from '../../../../model/types/NewMessage.ts';
import ChatWebSocketService from '../../../../model/service/ChatWebSockerService';
import { useState } from 'react';

export interface NewMessageFormProps {
  userId?: string;
  isConnected: boolean;
}

enum FormTypes {
  APP_CHAT = '/app/chat',
  APP_READ_MESSAGE = '/app/readMessage',
}

const forms = [
  {
    name: 'Вариант 1',
    value: FormTypes.APP_CHAT,
  },
  {
    name: 'Вариант 2',
    value: FormTypes.APP_READ_MESSAGE,
  }
];

const NewMessageForm: React.FC<NewMessageFormProps> = (props) => {
  const { userId, isConnected } = props;

  const [recipientId, setRecipientId] = useState<string>('');
  const [chatId, setChatId] = useState<string>('');
  const [topicId, setTopicId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messageId, setMessageId] = useState<string>('');
  const [currentForm, setCurrentForm] = useState<FormTypes>(FormTypes.APP_CHAT);

  const sendMessage = () => {
    if (!userId) return;
    
    let newMessage: NewMessage;

    if (currentForm === FormTypes.APP_CHAT) {
      newMessage = {
        message: message,
        senderId: userId!,
        recipientId: recipientId,
        chatId: chatId,
        topicId: topicId,
      };

      setMessage('');
    } else {
      newMessage = {
        chatId: chatId,
        messageId: messageId,
      };
      
      setMessageId('');
    }

    ChatWebSocketService.sendMessage(newMessage, currentForm);
  };

  const isButtonDisabled = () => {
    if (!isConnected) {
      return true;
    }

    if (currentForm === FormTypes.APP_READ_MESSAGE) {
      return !chatId || !messageId;
    } else if (currentForm === FormTypes.APP_CHAT) {
      return (!recipientId && !chatId) || !message || !userId;
    }

    return true;
  };
  
  return (
    <div className={styles.NewMessageForm}>
      <Tabs
        value={currentForm}
        onChange={(value) => setCurrentForm(value as FormTypes)}
        items={forms}
        className={styles.tabs}
      />

      <FormControl className="FieldWrapper">
        <div className="label">
          chatId
        </div>

        <CustomInput
          classes={{ root: styles.input }}
          placeholder="chatId"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
        />
      </FormControl>

      {currentForm === FormTypes.APP_READ_MESSAGE &&
        <FormControl className="FieldWrapper">
          <div className="label">
            messageId
          </div>

          <CustomInput
            classes={{ root: styles.input }}
            placeholder="messageId"
            value={messageId}
            onChange={(e) => setMessageId(e.target.value)}
          />
        </FormControl>
      }

      {currentForm === FormTypes.APP_CHAT &&
        <>
          <FormControl className="FieldWrapper">
            <div className="label">
              recipientId
            </div>

            <CustomInput
              classes={{ root: styles.input }}
              placeholder="recipientId"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
            />
          </FormControl>

          <FormControl className="FieldWrapper">
            <div className="label">
              topicId
            </div>

            <CustomInput
              classes={{ root: styles.input }}
              placeholder="topicId"
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
            />
          </FormControl>

          <FormControl className="FieldWrapper">
            <div className="label">
              message
            </div>

            <CustomInput
              classes={{ root: styles.input }}
              placeholder="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </FormControl>
        </>
      }

      <Button
        className={styles.button}
        onClick={sendMessage}
        disabled={isButtonDisabled()}
      >
        Отправить
      </Button>
    </div>
  );
};

export default NewMessageForm;
