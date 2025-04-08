import Header from './ui/header/Header.tsx';
import { useSelector } from 'react-redux';
import { getChatSelectedChat } from '../../model/selectors/getChatSelectedChat.ts';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import Messages from './ui/messages/Messages.tsx';
import styles from './SelectedChat.module.scss';
import MessageInput from './ui/message-input/MessageInput.tsx';

const SelectedChat = () => {
    const selectedChat = useSelector(getChatSelectedChat);
    const user = useSelector(getUserData)!;

    if (!selectedChat) {
        return (
            <div>
          Выберите чат
            </div>
        );
    }
  
    return (
        <div className={styles.SelectedChat}>
            <Header chatInfo={selectedChat}/>
            <Messages messages={selectedChat.lastMessages} user={user}/>
            <MessageInput />
        </div>
    );
};

export default SelectedChat;
