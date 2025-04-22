import { Avatar, Button, icons, Scrollbar, SvgIcon } from '@/shared/ui';
import AddUsersToGroup from '../../../chat-panel/ui/add-users-to-group/AddUsersToGroup.tsx';
import styles from './GroupMembers.module.scss';
import { classNames } from '@/shared/lib/utils/classNames';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { getChatSelectedChat } from '../../../../model/selectors/getChatSelectedChat.ts';

export interface GroupMembersProps {
  className?: string;
}

const GroupMembers: React.FC<GroupMembersProps> = (props) => {
  const { className } = props;
  const selectedChat = useSelector(getChatSelectedChat)!;
  const [isOpenAddToGroup, setIsOpenAddToGroup] = useState<boolean>(false);

  const closeAddToGroupHandler = useCallback(() => {
    setIsOpenAddToGroup(false);
  }, []);

  const openAddToGroupHandler = useCallback(() => {
    setIsOpenAddToGroup(true);
  }, []);

  return (
    <div className={classNames(styles.GroupMembers, [className])}>
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
  );
};

export default GroupMembers;
