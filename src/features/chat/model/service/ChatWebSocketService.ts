import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { NewMessage } from '../types/newMessage.ts';
import { Message } from '../types/message.ts';
import { ChatNotification } from '../types/chatNotifications.ts';

class ChatWebSocketService {
  private client: Client | null = null;
  private chatSubscriptionsQueue: string[] = []; // Очередь топиков для подписки
  private isConnected: boolean = false;
  private currentToken: string = '';

  public onMessageCallback: ((message: Message, chatId: string) => void) | null = null;
  public onNotificationsCallback: ((message: ChatNotification) => void) | null = null;

  connect(token: string, userId: string) {
    this.currentToken = token;

    this.client = new Client({
      webSocketFactory: () => new SockJS(
        `${import.meta.env.VITE_API}/ws?token=${this.currentToken}`,
        null,
        {
          transports: ['xhr-polling'],
        }
      ),
      // debug: (str) => console.log('[STOMP]', str),
      reconnectDelay: 10000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      connectHeaders: {
        Authorization: `Bearer ${this.currentToken}`,
      },
    });

    this.client.activate();

    this.client.onConnect = () => {
      this.isConnected = true;
      this.processSubscriptionQueue();
      this.subscribeNotifications(userId);
    };

    this.client.onDisconnect = () => {
      this.isConnected = false;
    };
  }

  disconnect() {
    this.client?.deactivate().then(() => {
      this.client = null;
      this.isConnected = false;
    });
  }

  subscribe(chatId: string) {
    if (this.isConnected && this.client) {
      this.client?.subscribe(`/topic/${chatId}`, (message) => {
        if (this.onMessageCallback) {
          this.onMessageCallback(JSON.parse(message.body), chatId);
        }
      });
    } else {
      this.chatSubscriptionsQueue.push(chatId);
    }
  }

  private processSubscriptionQueue() {
    while (this.chatSubscriptionsQueue.length) {
      const chatId = this.chatSubscriptionsQueue.shift();
      if (chatId) {
        this.subscribe(chatId);
      }
    }
  }

  subscribeNotifications(userId: string) {
    this.client?.subscribe(`/topic/user${userId}`, (message) => {
      if (this.onNotificationsCallback) {
        this.onNotificationsCallback(JSON.parse(message.body));
      }
    });
  }

  sendMessage(newMessage: NewMessage) {
    if (this.client?.connected) {
      this.client.publish({
        destination: '/app/chat',
        body: JSON.stringify(newMessage)
      });
    }
  }

  updateConnectionToken(newToken: string) {
    if (!this.client) return;

    this.currentToken = newToken;

    this.client.configure({
      connectHeaders: {
        Authorization: `Bearer ${newToken}`
      }
    });

    // // 3. Для SockJS может потребоваться переподключение
    // // Но сначала попробуем без него
    // if (this.client.connected) {
    //   // Если сервер принимает обновленные заголовки "на лету"
    //   this.client.deactivate().then(() => {
    //     this.client?.activate();
    //   });
    // }
  }
}

export default new ChatWebSocketService();
