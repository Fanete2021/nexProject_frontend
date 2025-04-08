import React, { useState } from 'react';
import ChatWebSocketService from '../../../../model/service/ChatWebSocketService.ts';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import { NewMessage } from '../../../../model/types/newMessage.ts';
import { getChatSelectedChat } from '../../../../model/selectors/getChatSelectedChat.ts';

const MessageInput = () => {
    const [messageText, setMessageText] = useState<string>('');
    const user = useSelector(getUserData)!;
    const selectedChat = useSelector(getChatSelectedChat)!;
    
    const sendHandler = () => {
        const newMessage: NewMessage = {
            message: messageText,
            senderId: user.userId,
            recipientId: selectedChat.members.find(member => member.memberId !== user.userId)!.memberId,
            chatId: '1'
        };
        ChatWebSocketService.sendMessage(newMessage);
        setMessageText('');
    };


    return (
        <div>
            <input value={messageText} onChange={e => setMessageText(e.target.value)}/>
            <button onClick={sendHandler}>Отправить </button>
        </div>
    );
};

export default MessageInput;
