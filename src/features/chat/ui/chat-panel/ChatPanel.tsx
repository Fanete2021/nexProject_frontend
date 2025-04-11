import React, { useEffect } from 'react';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import styles from './ChatPanel.module.scss';
import Dialogs from '../dialogs/Dialogs.tsx';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { fetchChats } from '../../model/service/fetchChats.ts';
import SelectedChat from '../selected-chat/SelectedChat.tsx';
import { useSelector } from 'react-redux';
import { getAuthToken } from '@/features/auth';
import ChatWebSocketService from '../../model/service/ChatWebSocketService.ts';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';

export interface ChatProps {
    className?: string;
}

const ChatPanel: React.FC<ChatProps> = (props) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const token = useSelector(getAuthToken)!;
    const user = useSelector(getUserData)!;

    useEffect(() => {
        const loadChats = async () => {
            try {
                const response = await dispatch(fetchChats({ filterMode: 'all' })).unwrap();
                const { chats } = response;

                for (const chat of chats) {
                    ChatWebSocketService.subscribe(chat.chatId);
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadChats();
    }, []);

    useEffect(() => {
        ChatWebSocketService.connect(token, user.userId);

        return () => {
            ChatWebSocketService.disconnect();
        };
    }, []);

    return (
        <div className={classNames(styles.ChatPanel, [className])}>
            <Dialogs className={styles.dialogs} />
            <SelectedChat className={styles.selectedChat}/>
        </div>
    );
};

export default ChatPanel;
