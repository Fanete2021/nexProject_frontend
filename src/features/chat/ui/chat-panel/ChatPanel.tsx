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

export interface ChatProps {
    className?: string;
}

const ChatPanel: React.FC<ChatProps> = (props) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const token = useSelector(getAuthToken)!;

    useEffect(() => {
        const loadChats = async () => {
            try {
                await dispatch(fetchChats()).unwrap();
            } catch (error) {
                console.log(error);
            }
        };

        loadChats();
    }, []);

    useEffect(() => {
        ChatWebSocketService.connect(token);

        return () => {
            ChatWebSocketService.disconnect();
        };
    }, []);

    return (
        <div className={classNames(styles.ChatPanel, [className])}>
            <Dialogs className={styles.dialogs} />
            <SelectedChat />
        </div>
    );
};

export default ChatPanel;
