import {
  addMembersToOrganization,
  deleteMemberFromOrganization,
  getMyRoleInOrganization,
  getOrganizationRoleName,
  isAdminInOrganization, OrganizationInfo,
} from '@/entities/organization';
import { useSelector } from 'react-redux';
import styles from './Members.module.scss';
import { ActionMenu, ActionMenuPosition, Avatar, icons, Scrollbar, Search, SvgIcon } from '@/shared/ui';
import { getUserData } from '@/entities/user';
import { OrganizationRoles } from '@/entities/organization/model/types/organizationRoles.ts';
import React, { useState } from 'react';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { Contact } from '@/entities/contact';
import { ContactPickerModal } from '@/widgets/pickers/contact-picker';

const rolePriority = [
  OrganizationRoles.OWNER,
  OrganizationRoles.ADMIN,
  OrganizationRoles.EDITOR,
  OrganizationRoles.VIEWER,
];

export interface MembersProps {
  organization: OrganizationInfo
}

const Members: React.FC<MembersProps> = (props) => {
  const { organization } = props;

  const dispatch = useAppDispatch();

  const user = useSelector(getUserData)!;
  
  const [actionMenuPosition, setActionMenuPosition] = useState<ActionMenuPosition | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [isOpenContactPicker, setIsOpenContactPicker] = useState<boolean>(false);
  
  const myRole = getMyRoleInOrganization(organization, user);
  const sortedMembers = [...organization.members].sort((a, b) => {
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
      organizationId: organization.organizationId,
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
      organizationId: organization.organizationId
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
            {organization.members.length} members
          </span>

          {organization.organizationDescription &&
            <span className={styles.description}>
              {organization.organizationDescription}
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
          {(isAdminInOrganization(myRole)) &&
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
                <span className={styles.role}>{getOrganizationRoleName(member.role)}</span>
              </div>

              {(member.userId !== user.userId && isAdminInOrganization(myRole) && !isAdminInOrganization(member.role)) &&
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
        filterIds={organization.members.map(m => m.userId)}
        footerText='Добавить'
        pickHandler={addMembers}
      />
    </div>
  );
};

export default Members;
