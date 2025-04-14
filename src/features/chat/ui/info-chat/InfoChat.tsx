import styles from './InfoChat.module.scss';
import { useSelector } from 'react-redux';
import { getChatSelectedChat } from '../../model/selectors/getChatSelectedChat.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import {icons, SvgIcon} from "@/shared/ui";

export interface InfoChatProps {
  className?: string;
}

const InfoChat: React.FC<InfoChatProps> = (props) => {
  const { className } = props;
  
  const selectedChat = useSelector(getChatSelectedChat);

  return (
    <div className={classNames(styles.InfoChat, [className])}>
      <div className={styles.header}>
        Chat Info

        <SvgIcon
          iconName={icons.INFO}
          applyStroke
          applyFill={false}
          important
          applyHover={false}
          className={styles.iconInfo}
        />
      </div>
    </div>
  );
};

export default InfoChat;
