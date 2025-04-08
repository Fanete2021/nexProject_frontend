import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { NewMessage } from '../types/newMessage.ts';
import { Message } from '../types/message.ts';

class ChatWebSocketService {
    private client: Client | null = null;
    private onMessageCallback: ((message: Message) => void) | null = null;

    connect(token: string) {
        this.client = new Client({
            webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API}/ws?token=${token}`),
            debug: (str) => console.log('[STOMP]', str),
            reconnectDelay: 10000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });

        this.client.activate();
    }

    disconnect() {
        this.client?.deactivate().then(() => {
            this.client = null;
        });
    }

    subscribe(chatId: string) {
        this.client?.subscribe(`/topic/${chatId}`, (message) => {
            if (this.onMessageCallback) {
                this.onMessageCallback(JSON.parse(message.body));
            }
        });
    }

    setOnMessageCallback(callback: (message: Message) => void) {
        this.onMessageCallback = callback;
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
