import styles from './Teams.module.scss';
import { ActionMenu, ActionMenuPosition, Avatar, icons, Scrollbar, SvgIcon } from '@/shared/ui';
import { useSelector } from 'react-redux';
import {
  addMembersToTeam,
  deleteMemberFromTeam,
  getMyRoleInTeam, getTeamRoleName,
  getTeamSelectedTeam,
  isAdminInTeam,
  TeamRoles
} from '@/entities/team';
import { Contact, ContactPickerModal } from '@/entities/contact';
import { getUserData } from '@/entities/user';
import React, { useState } from 'react';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { getOrganizationSelectedOrganization } from '@/entities/organization';

const rolePriority = [
  TeamRoles.OWNER,
  TeamRoles.ADMIN,
  TeamRoles.EDITOR,
  TeamRoles.VIEWER,
];

const Teams = () => {
  const dispatch = useAppDispatch();
  
  const selectedTeam = useSelector(getTeamSelectedTeam)!;
  const selectedOrganization = useSelector(getOrganizationSelectedOrganization)!;
  const user = useSelector(getUserData)!;

  const [actionMenuPosition, setActionMenuPosition] = useState<ActionMenuPosition | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [isOpenContactPicker, setIsOpenContactPicker] = useState<boolean>(false);

  const myRole = getMyRoleInTeam(selectedTeam, user);

  const contactsInOrganization: Contact[] = selectedOrganization.members.map((member) => ({
    name: member.name,
    userId: member.userId,
    username: member.username
  }));

  const sortedMembers = [...selectedTeam.teamMembers].sort((a, b) => {
    return rolePriority.indexOf(a.role) - rolePriority.indexOf(b.role);
  });

  const openActionMenuHandler = (event: React.MouseEvent<HTMLElement, MouseEvent>, memberId: string) => {
    event.preventDefault();
    setActionMenuPosition({ x: event.clientX, y: event.clientY });
    setSelectedMemberId(memberId);
  };

  const closeActionMenuHandler = () => {
    setActionMenuPosition(null);
    setSelectedMemberId(null);
  };

  const deleteMember = () => {
    closeActionMenuHandler();
    dispatch(deleteMemberFromTeam({
      userId: selectedMemberId!,
      teamId: selectedTeam.teamId,
    }));
  };

  const onCloseContactPickerHandler = () => {
    setIsOpenContactPicker(false);
  };

  const addMembers = (contacts: Contact[]) => {
    dispatch(addMembersToTeam({
      members: contacts.map(c => ({
        userId: c.userId,
        role: TeamRoles.VIEWER
      })),
      teamId: selectedTeam.teamId
    }));

    onCloseContactPickerHandler();
    setSelectedContacts([]);
  };
  
  return (
    <div className={styles.Teams}>
      <div className={styles.infoWrapper}>
        <SvgIcon
          iconName={icons.INFO}
          applyHover={false}
          important
          className={styles.iconInfo}
        />

        <div className={styles.info}>
          <span className={styles.tags}>
            {selectedTeam.teamTags.map((tag) => (
              <span key={tag.tagName} style={{ color: tag.tagColor }}>{tag.tagName}</span>
            ))}
          </span>

          <span className={styles.countMembers}>
            {selectedTeam.teamMembers.length} members
          </span>

          {selectedTeam.teamDescription &&
            <span className={styles.description}>
              {selectedTeam.teamDescription}
            </span>
          }
        </div>
      </div>

      <Scrollbar autoHide>
        <div className={styles.members}>
          {(isAdminInTeam(myRole)) &&
            <button
              className={styles.member}
              onClick={() => setIsOpenContactPicker(true)}
            >
              <SvgIcon
                iconName={icons.MEMBER_ADD}
                important
                className={styles.iconMemberAdd}
                applyHover={false}
              />

              <div className={styles.info}>
                Добавить участника
              </div>
            </button>
          }

          {sortedMembers.map(member => (
            <div key={member.userId} className={styles.member}>
              <Avatar
                width={50}
                height={50}
                text={member.name}
              />

              <div className={styles.info}>
                <span className={styles.name}>{member.name}</span>
                <span className={styles.role}>{getTeamRoleName(member.role)}</span>
              </div>

              {(member.userId !== user.userId && isAdminInTeam(myRole) && !isAdminInTeam(member.role)) &&
                <SvgIcon
                  iconName={icons.ACTION_MENU}
                  applyStroke
                  applyFill={false}
                  className={styles.iconActionMenu}
                  onClick={(e) => openActionMenuHandler(e, member.userId)}
                />
              }
            </div>
          ))}
        </div>
      </Scrollbar>

      <ActionMenu
        onClose={closeActionMenuHandler}
        position={actionMenuPosition}
        deleteHandler={deleteMember}
        deleteText={'Исключить'}
        deleteIcon={icons.CROSS}
      />

      <ContactPickerModal
        onClose={onCloseContactPickerHandler}
        isOpen={isOpenContactPicker}
        setSelectedContacts={setSelectedContacts}
        selectedContacts={selectedContacts}
        headerText={
          `Добавить участников ${selectedContacts.length ? `(+${selectedContacts.length})` : ''}`
        }
        filterIds={selectedTeam.teamMembers.map(m => m.userId)}
        footerText='Добавить'
        pickHandler={addMembers}
        data={contactsInOrganization}
      />
    </div>
  );
};

export default Teams;
