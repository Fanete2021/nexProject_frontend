import React, { useEffect, useState } from 'react';
import { Message } from '../../../../model/types/message.ts';
import { User } from '@/entities/user';
import { ChatWebSocketService } from '@/features/chat';

export interface MessagesProps {
  messages: Message[];
  user: User;
}

const Messages: React.FC<MessagesProps> = (props) => {
    const [messages, setMessages] = useState<Message[]>(props.messages);

    useEffect(() => {
        ChatWebSocketService.setOnMessageCallback(
            (message: Message) => {
                setMessages(messages => [message, ...messages]);
            });
    }, []);
    
  
    return (
        <div>
            {[...messages].reverse().map(message => (
                <div key={message.chatId + message.messageId}>
                    {message.message}
                </div>
            ))}
        </div>
    );
};

export default Messages;
