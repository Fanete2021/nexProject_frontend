import { Button, CustomInput, Scrollbar } from '@/shared/ui';
import styles from './Chat.module.scss';
import { useEffect, useState } from 'react';
import { FormControl } from '@mui/material';
import ChatWebSocketService from '../../model/service/ChatWebSockerService.ts';
import { useSelector } from 'react-redux';
import { getAuthToken } from '@/features/account/auth';
import { getUserData } from '@/entities/user';
import { NewMessage } from '@/features/chat';

type Config = {
  token?: string;
  userId?: string;
  connectionURL: string;
  topics?: string[];
}

const Chat = () => {
  const [token, setToken] = useState(useSelector(getAuthToken));
  const [userId, setUserId] = useState(useSelector(getUserData)?.userId);
  const [connectionURL, setConnectionURL] = useState(`${import.meta.env.VITE_API}/ws`);
  const [topics, setTopics] = useState<string[]>([
    '/exchange/amq.direct/reply',
    '/topic/chat.group.messages',
    ''
  ]);
  const [messages, setMessages] = useState<[][]>([[], [], []]);
  const [config, setConfig] = useState<Config>({
    connectionURL: connectionURL
  });
  const [isConnected, setIsConnectedToChat] = useState<boolean>(false);
  const [isFirstSubscribe, setIsFirstSubscribe] = useState<boolean>(true);
  const [recipientId, setRecipientId] = useState<string>('');
  const [chatId, setChatId] = useState<string>('');
  const [topicId, setTopicId] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const changeTopic = (value, index) => {
    const changedTopics = topics.map((topic, i) => i === index ? value : topic);
    setTopics(changedTopics);
  };

  const saveData = () => {
    ChatWebSocketService.connect(connectionURL, token);

    setConfig({
      ...config,
      connectionURL: connectionURL,
      token: token,
      userId: userId,
    });
  };

  const saveTopics = () => {
    if (isFirstSubscribe) {
      topics.forEach(topic => {
        if (topic) {
          ChatWebSocketService.subscribeTopic(topic);
        }
      });

      setIsFirstSubscribe(false);
    } else {
      config.topics?.forEach((topic, index) => {
        if (topic && !topics.includes(topic)) {
          ChatWebSocketService.unsubscribeTopic(topic);
          setMessages(prev => prev.map((ar, i) => i === index ? [] : ar));
        }
      });

      topics.forEach(topic => {
        if (topic && !config.topics?.includes(topic)) {
          ChatWebSocketService.subscribeTopic(topic);
        }
      });
    }

    setConfig({
      ...config,
      topics: topics.filter(topic => topic !== '')
    });
  };

  useEffect(() => {
    ChatWebSocketService.onChangeStatus = (isConnected) => {
      if (!isConnected) setIsFirstSubscribe(true);

      setIsConnectedToChat(isConnected);
    };
    ChatWebSocketService.onMessageCallback = (message, topic: string) => {
      const index = config.topics?.indexOf(topic);

      if (index !== undefined) {
        setMessages(prev =>
          prev.map((ar, i) =>
            i === index
              ? [...ar, message]
              : ar
          )
        );
      }
    };
  }, [config]);

  const sendMessage = () => {
    if (!config.userId) return;

    const newMessage: NewMessage = {
      message: message,
      senderId: config.userId,
      recipientId: recipientId,
      chatId: chatId,
      topicId: topicId,
    };
    ChatWebSocketService.sendMessage(newMessage);
    setMessage('');
  };

  return (
    <div className={styles.Chat}>
      <div className={styles.launchData}>
        <div className={styles.panel}>
          <div className={styles.header}>
            <span className={styles.title}>
              Общие данные
            </span>
            <span
              className={styles.status}
              style={{
                color: isConnected ? 'green' : 'red',
              }}
            >
              ({isConnected ? 'connected' : 'disconnected'})
            </span>
          </div>

          <FormControl className="FieldWrapper">
            <div className="label">
              URL для подключения
            </div>

            <CustomInput
              classes={{root: styles.input}}
              placeholder="Url для подключения"
              value={connectionURL}
              onChange={(e) => setConnectionURL(e.target.value)}
            />
          </FormControl>

          <FormControl className="FieldWrapper">
            <div className="label">
              Токен
            </div>

            <CustomInput
              classes={{root: styles.input}}
              placeholder="Токен"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </FormControl>

          <FormControl className="FieldWrapper">
            <div className="label">
              Идентификатор
            </div>

            <CustomInput
              classes={{root: styles.input}}
              placeholder="Идентификатор"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </FormControl>

          <Button
            className={styles.button}
            onClick={saveData}
          >
            Сохранить и подключиться
          </Button>
          <Button
            className={styles.button}
            onClick={ChatWebSocketService.disconnect}
            disabled={!isConnected}
          >
            Отключиться
          </Button>

          <div className={styles.header}>
            <span className={styles.title}>
              Новое сообщение
            </span>
          </div>

          <FormControl className="FieldWrapper">
            <div className="label">
              recipientId
            </div>

            <CustomInput
              classes={{root: styles.input}}
              placeholder="recipientId"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
            />
          </FormControl>

          <FormControl className="FieldWrapper">
            <div className="label">
              chatId
            </div>

            <CustomInput
              classes={{root: styles.input}}
              placeholder="chatId"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
            />
          </FormControl>

          <FormControl className="FieldWrapper">
            <div className="label">
              topicId
            </div>

            <CustomInput
              classes={{root: styles.input}}
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
              classes={{root: styles.input}}
              placeholder="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </FormControl>

          <Button
            className={styles.button}
            onClick={sendMessage}
            disabled={(!recipientId && !chatId) || !message || !config.userId}
          >
            Отправить
          </Button>
        </div>

        <div className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.title}>
              Топики
            </div>

            <Button
              className={styles.button}
              onClick={saveTopics}
              disabled={!isConnected}
            >
              Пуск
            </Button>
          </div>

          <div className={styles.topics}>
            {Array.from({length: 3}, (_, i) => i).map((num) => (
              <div className={styles.topic} key={num}>
                <FormControl className="FieldWrapper">
                  <CustomInput
                    classes={{root: styles.input}}
                    placeholder={`${num + 1} топик`}
                    value={topics[num]}
                    onChange={(e) => changeTopic(e.target.value, num)}
                  />
                </FormControl>

                <div className={styles.scrollbarWrapper}>
                  <Scrollbar>
                    <div className={styles.messages}>
                      {messages[num].map((item, index) => (
                        <div key={'message:' + num + ':' + index} className={styles.message}>
                          {JSON.stringify(item, null, 2)}
                        </div>
                      ))}
                    </div>
                  </Scrollbar>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
