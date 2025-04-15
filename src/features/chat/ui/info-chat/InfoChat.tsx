import styles from './InfoChat.module.scss';
import { useSelector } from 'react-redux';
import { getChatSelectedChat } from '../../model/selectors/getChatSelectedChat.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import {icons, SvgIcon} from "@/shared/ui";
import {useTranslation} from "react-i18next";

export interface InfoChatProps {
  className?: string;
}

const InfoChat: React.FC<InfoChatProps> = (props) => {
  const { className } = props;
  const { t } = useTranslation();
  
  const selectedChat = useSelector(getChatSelectedChat);

  return (
    <div className={classNames(styles.InfoChat, [className])}>
      <div className={styles.header}>
        {t('Информация о чате') as string}

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
