import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { NewMessage } from '@/features/chat';

class ChatWebSocketService {
  private client: Client | null = null;
  private isConnected: boolean = false;

  public onMessageCallback: ((message: any, topic: string) => void) | null = null;
  public onChangeStatus: ((isConnected: boolean) => void) | null = null;

  connect = async (url: string, token: string) => {
    if (this.isConnected) {
      await this.disconnect();
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(
        `${url}?token=${token}`,
        null,
        {
          transports: ['xhr-polling'],
        }
      ),
      debug: (str) => console.log('[STOMP]', str),
      reconnectDelay: 0,
      heartbeatIncoming: 20000,
      heartbeatOutgoing: 20000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onStompError: () => {
        this.isConnected = false;
        this.onChangeStatus?.(false);
      }
    });

    this.client.activate();

    this.client.onConnect = () => {
      this.isConnected = true;
      this.onChangeStatus?.(true);
    };

    this.client.onDisconnect = () => {
      this.isConnected = false;
      this.onChangeStatus?.(false);
    };
  };

  public disconnect = () => {
    this.client?.deactivate()
      .then(() => {
        this.isConnected = false;
        this.onChangeStatus?.(false);
      })
      .catch((error) => {
        console.error('Disconnect failed:', error);
      });
  };

  public subscribeTopic = (topic: string) => {
    if (this.isConnected) {
      this.client?.subscribe(topic, (message) => {
        if (this.onMessageCallback) {
          this.onMessageCallback(JSON.parse(message.body), topic);
        }
      });
    }
  };

  public unsubscribeTopic(topic) {
    if (this.isConnected) {
      this.client?.unsubscribe(topic);
    }
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
