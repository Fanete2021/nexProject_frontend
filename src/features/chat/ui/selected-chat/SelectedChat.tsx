import Header from './ui/header/Header.tsx';
import { useSelector } from 'react-redux';
import { getChatSelectedChat } from '../../model/selectors/getChatSelectedChat.ts';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import Messages from './ui/messages/Messages.tsx';
import styles from './SelectedChat.module.scss';
import MessageInput from './ui/message-input/MessageInput.tsx';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface SelectedChatProps {
  className?: string;
}

const SelectedChat: React.FC<SelectedChatProps> = (props) => {
  const { className } = props;
  const selectedChat = useSelector(getChatSelectedChat);
  const user = useSelector(getUserData)!;

  if (!selectedChat) {
    return (
      <div className={styles.empty}>
        Select a chat to start messaging
      </div>
    );
  }
  
  return (
    <div className={classNames(styles.SelectedChat, [className])}>
      <Header chatInfo={selectedChat} className={styles.Header}/>

      <Messages
        messages={selectedChat.lastMessages}
        user={user}
        className={styles.Messages}
        chatId={selectedChat.chatId}
      />

      <MessageInput className={styles.MessageInput}/>
    </div>
  );
};

export default SelectedChat;
