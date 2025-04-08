import React from 'react';
import styles from './Dialogs.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { useSelector } from 'react-redux';
import { getChatData } from '../../model/selectors/getChatData.ts';
import DialogItem from './ui/dialog-item/DialogItem.tsx';

export interface ChatListProps {
  className?: string;
}

const Dialogs: React.FC<ChatListProps> = (props) => {
    const { className } = props;
    const chats = useSelector(getChatData);
  
    return (
        <div className={classNames(styles.ChatList, [className])}>
            <div className={styles.header}>
                <div className={styles.title}>Chats</div>
              
                <div className={styles.search}>Search</div>
            </div>

            <div className={styles.content}>
                <div className={styles.filter}>
                    <div className={classNames(styles.item, [styles.active])}>All</div>
                    <div className={styles.item}>Contacts</div>
                    <div className={styles.item}>Group chats</div>
                </div>

                <div className={styles.dialogs}>
                    {chats.map(chat => (
                        <DialogItem key={chat.chatId} data={chat}/>
                    ))}
                </div>
            </div>

            <div className={styles.footer}>
                <button>New chat</button>
            </div>
        </div>
    );
};

export default Dialogs;
