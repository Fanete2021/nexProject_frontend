import styles from './InfoChat.module.scss';
import { useSelector } from 'react-redux';
import { getChatSelectedChat } from '../../../../model/selectors/getChatSelectedChat.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { icons, SvgIcon } from '@/shared/ui';
import { useTranslation } from 'react-i18next';
import { isPublicChat } from '@/shared/lib/utils/isPublicChat.ts';
import GroupMembers from './ui/group-members/GroupMembers.tsx';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { chatActions } from '../../../../model/slice/chatSlice.ts';

export interface InfoChatProps {
  className?: string;
}

const InfoChat: React.FC<InfoChatProps> = (props) => {
  const { className } = props;
  const { t } = useTranslation();

  const selectedChat = useSelector(getChatSelectedChat)!;
  const isPublic = isPublicChat(selectedChat);
  const dispatch = useAppDispatch();
  
  const closeInfoChat = () => {
    dispatch(chatActions.setIsActiveInfoPanel(false));
  };

  return (
    <div className={classNames(styles.InfoChat, [className])}>
      <div className={styles.header}>
        <SvgIcon
          iconName={icons.BACK}
          important
          className={styles.iconBack}
          onClick={closeInfoChat}
        />

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

      {isPublic &&
        <GroupMembers />
      }
    </div>
  );
};

export default InfoChat;
