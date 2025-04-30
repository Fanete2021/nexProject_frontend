import styles from './SelectedChat.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import HeaderSkeleton from './ui/header/HeaderSkeleton.tsx';
import MessageInput from './ui/message-input/MessageInput.tsx';
import MessagesSkeleton from './ui/messages/MessagesSkeleton.tsx';

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
