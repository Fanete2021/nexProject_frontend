import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { NewMessage } from '../types/newMessage.ts';
import { Message } from '../types/message.ts';
import { ChatNotification } from '../types/chatNotifications.ts';

class ChatWebSocketService {
  private client: Client | null = null;
  private chatSubscriptionsQueue: string[] = []; // Очередь топиков для подписки
  private isConnected: boolean = false;

  public onMessageCallback: ((message: Message, chatId: string) => void) | null = null;
  public onNotificationsCallback: ((message: ChatNotification) => void) | null = null;

  connect(token: string, userId: string) {
    this.client = new Client({
      webSocketFactory: () => new SockJS(
        `${import.meta.env.VITE_API}/ws?token=${token}`,
        null,
        {
          transports: ['xhr-polling'],
        }
      ),
      // debug: (str) => console.log('[STOMP]', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 20000,
      heartbeatOutgoing: 20000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
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
      this.isConnected = false;
    });
  }

  public subscribe(chatId: string) {
    if (!this.chatSubscriptionsQueue.includes(chatId)) {
      this.chatSubscriptionsQueue.push(chatId);
    }

    if (this.isConnected) {
      this.client?.subscribe(`/topic/${chatId}`, (message) => {
        if (this.onMessageCallback) {
          this.onMessageCallback(JSON.parse(message.body), chatId);
        }
      });
    }
  }

  private processSubscriptionQueue() {
    for (const chatId of this.chatSubscriptionsQueue) {
      this.subscribe(chatId);
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
}

export default new ChatWebSocketService();
