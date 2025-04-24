import { useSelector } from 'react-redux';
import { getChatSelectedChat } from '../../../../model/selectors/getChatSelectedChat.ts';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import styles from './SelectedChat.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { isPublicChat } from '@/shared/lib/utils/isPublicChat.ts';
import { ChatTypes } from '../../../../model/types/chatTypes.ts';
import Messages from './ui/messages/Messages.tsx';
import Header from './ui/header/Header.tsx';
import MessageInput from './ui/message-input/MessageInput.tsx';

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
        messageCount={selectedChat.messageCount}
        chatType={isPublicChat(selectedChat) ? ChatTypes.PUBLIC : ChatTypes.PRIVATE}
      />

      <MessageInput className={styles.MessageInput} />
    </div>
  );
};

export default SelectedChat;
