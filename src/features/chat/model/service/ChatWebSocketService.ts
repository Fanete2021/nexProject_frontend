import {Client, IFrame} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { NewMessage } from '../types/newMessage.ts';
import { Message } from '../types/message.ts';

class ChatWebSocketService {
    private client: Client | null = null;
    private onMessageCallback: ((message: Message, chatId: string) => void) | null = null;
    private chatSubscriptionsQueue: string[] = []; // Очередь топиков для подписки
    private isConnected: boolean = false;

    connect(token: string, userId: string) {
        this.client = new Client({
            webSocketFactory: () => new SockJS(
                `${import.meta.env.VITE_API}/ws?token=${token}`,
                null,
                {
                    transports: ['xhr-polling'],
                }
            ),
            debug: (str) => console.log('[STOMP]', str),
            reconnectDelay: 10000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
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
        this.client?.subscribe(`/queue/user${userId}`, (message) => {
            console.log(JSON.parse(message.body));
        });
    }

    setOnMessageCallback(callback: (message: Message, chatId: string) => void) {
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
