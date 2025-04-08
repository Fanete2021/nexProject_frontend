import React, { useCallback } from 'react';
import { Chat } from '../../../../model/types/chat.ts';
import styles from './DialogItem.module.scss';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { fetchSelectedChatInfo } from '../../../../model/service/fetchSelectedChatInfo.ts';

export interface DialogItemProps {
  data: Chat,
  className?: string;
}

const DialogItem: React.FC<DialogItemProps> = (props) => {
    const { data } = props;
    const dispatch = useAppDispatch();
    
    const clickHandler = useCallback(async () => {
        try {
            await dispatch(fetchSelectedChatInfo({ chatId: data.chatId })).unwrap();
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <button onClick={clickHandler}>
            {data.chatId}
        </button>
    );
};

export default DialogItem;
