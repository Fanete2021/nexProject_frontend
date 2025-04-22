import styles from './InfoChat.module.scss';
import { useSelector } from 'react-redux';
import { getChatSelectedChat } from '../../model/selectors/getChatSelectedChat.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { Avatar, Button, icons, Scrollbar, SvgIcon } from '@/shared/ui';
import { useTranslation } from 'react-i18next';
import { isPublicChat } from '@/shared/lib/utils/isPublicChat.ts';
import AddUsersToGroup from '../chat-panel/ui/add-users-to-group/AddUsersToGroup.tsx';
import { useCallback, useState } from 'react';

export interface InfoChatProps {
  className?: string;
}

const InfoChat: React.FC<InfoChatProps> = (props) => {
  const { className } = props;
  const { t } = useTranslation();

  const [isOpenAddToGroup, setIsOpenAddToGroup] = useState<boolean>(false);
  const selectedChat = useSelector(getChatSelectedChat)!;
  const isPublic = isPublicChat(selectedChat);

  const closeAddToGroupHandler = useCallback(() => {
    setIsOpenAddToGroup(false);
  }, []);
  
  const openAddToGroupHandler = useCallback(() => {
    setIsOpenAddToGroup(true);
  }, []);

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

      {isPublic &&
        <div className={styles.membersWrapper}>
          <div className={styles.title}>
            <SvgIcon
              iconName={icons.MEMBERS}
              applyHover={false}
              important
              className={styles.iconMembers}
            />

            {selectedChat.members.length} Members
          </div>

          <Scrollbar autoHide={true}>
            <div className={styles.members}>
              {selectedChat.members.map((member, index) => (
                <div key={selectedChat.chatId + member.memberId + index} className={styles.member}>
                  <Avatar text={member.memberName} width={40} height={40}/>

                  <div className={styles.info}>
                    <div className={styles.name}>{member.memberName}</div>
                    <div className={styles.online}>заходил 1 мин.назад</div>
                  </div>
                </div>
              ))}
            </div>
          </Scrollbar>

          <Button
            className={styles.addMember}
            variant={'secondary'}
            onClick={openAddToGroupHandler}
          >
            <SvgIcon
              iconName={icons.ADD_MEMBER}
              important
              applyHover={false}
              className={styles.iconAddMember}
            />
          </Button>

          <AddUsersToGroup onClose={closeAddToGroupHandler} isOpen={isOpenAddToGroup}/>
        </div>
      }
    </div>
  );
};

export default InfoChat;
