import HeaderSkeleton from './components/header/HeaderSkeleton';
import MessageInput from './components/message-input/MessageInput';
import MessagesSkeleton from './components/messages/MessagesSkeleton';
import styles from './SelectedChat.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface SelectedChatSkeletonProps {
  className?: string;
}

const SelectedChatSkeleton: React.FC<SelectedChatSkeletonProps> = (props) => {
  const { className } = props;

  return (
    <div className={classNames(styles.SelectedChat, [className])}>
      <HeaderSkeleton className={styles.Header} />

      <MessagesSkeleton className={styles.Messages} />

      <MessageInput className={styles.MessageInput} />
    </div>
  );
};

export default SelectedChatSkeleton;
