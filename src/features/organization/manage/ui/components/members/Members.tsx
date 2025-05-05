import {
  addMembersToOrganization,
  deleteMemberFromOrganization,
  getMyRole,
  getOrganizationSelectedOrganization,
  getRoleName,
  isAdmin
} from '@/entities/organization';
import { useSelector } from 'react-redux';
import styles from './Members.module.scss';
import { ActionMenu, ActionMenuPosition, Avatar, icons, Scrollbar, Search, SvgIcon } from '@/shared/ui';
import { getUserData } from '@/entities/user';
import { OrganizationRoles } from '@/entities/organization/model/types/organizationRoles.ts';
import React, { useState } from 'react';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { Contact, ContactPickerModal } from '@/entities/contact';

const rolePriority = [
  OrganizationRoles.OWNER,
  OrganizationRoles.ADMIN,
  OrganizationRoles.EDITOR,
  OrganizationRoles.VIEWER,
];

const Members = () => {
  const dispatch = useAppDispatch();
  
  const selectedOrganization = useSelector(getOrganizationSelectedOrganization)!;
  const user = useSelector(getUserData)!;
  
  const [actionMenuPosition, setActionMenuPosition] = useState<ActionMenuPosition | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [isOpenContactPicker, setIsOpenContactPicker] = useState<boolean>(false);
  
  const myRole = getMyRole(selectedOrganization, user);
  const sortedMembers = [...selectedOrganization.members].sort((a, b) => {
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
    dispatch(deleteMemberFromOrganization({
      userId: selectedMemberId!,
      organizationId: selectedOrganization.organizationId,
    }));
  };

  const onCloseContactPickerHandler = () => {
    setIsOpenContactPicker(false);
  };

  const addMembers = (contacts: Contact[]) => {
    dispatch(addMembersToOrganization({
      members: contacts.map(c => ({
        userId: c.userId,
        role: OrganizationRoles.VIEWER
      })),
      organizationId: selectedOrganization.organizationId
    }));

    onCloseContactPickerHandler();
    setSelectedContacts([]);
  };

  return (
    <div className={styles.Members}>
      <div className={styles.infoWrapper}>
        <SvgIcon
          iconName={icons.INFO}
          applyHover={false}
          important
          className={styles.iconInfo}
        />

        <div className={styles.info}>
          <span className={styles.countMembers}>
            {selectedOrganization.members.length} members
          </span>

          {selectedOrganization.organizationDescription &&
            <span className={styles.description}>
              {selectedOrganization.organizationDescription}
            </span>
          }
        </div>
      </div>

      <div className={styles.filter}>
        <SvgIcon
          iconName={icons.FILTER}
          applyFill={false}
          applyHover={false}
          applyStroke
          className={styles.iconFilter}
        />

        <div className={styles.searchWrapper}>
          <Search />
        </div>

        <div className={styles.roles}>
          <span>
            Отображаемые роли:
          </span>

          <span className={styles.selectedRoles}>
            Все
          </span>
        </div>
      </div>

      <Scrollbar autoHide>
        <div className={styles.members}>
          {(isAdmin(myRole)) &&
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
                <span className={styles.role}>{getRoleName(member.role)}</span>
              </div>

              {(member.userId !== user.userId && isAdmin(myRole) && !isAdmin(member.role)) &&
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
        filterIds={selectedOrganization.members.map(m => m.userId)}
        footerText='Добавить'
        pickHandler={addMembers}
      />
    </div>
  );
};

export default Members;
