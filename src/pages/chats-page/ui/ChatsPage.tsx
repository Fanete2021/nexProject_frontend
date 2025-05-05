import { ChatPanel } from '@/features/chat';
import styles from './ChatPage.module.scss';

const ChatsPage = () => {
  return (
    <>
      <ChatPanel className={styles.chat}/>
    </>
  );
};

export default ChatsPage;
