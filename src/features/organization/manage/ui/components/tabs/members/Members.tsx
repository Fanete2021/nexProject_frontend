import {
  addMembersToOrganization,
  deleteMemberFromOrganization, editRoleInOrganization,
  getMyRoleInOrganization,
  isAdminInOrganization, isOwnerInOrganization, OrganizationInfo,
} from '@/entities/organization';
import { useSelector } from 'react-redux';
import styles from './Members.module.scss';
import { ActionMenu, ActionMenuPosition, icons } from '@/shared/ui';
import { getUserData } from '@/entities/user';
import { OrganizationRoles } from '@/entities/organization/model/types/organizationRoles.ts';
import React, { useState } from 'react';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { Contact } from '@/entities/contact';
import { ContactPickerModal } from '@/widgets/pickers/contact-picker';
import { OrganizationMember } from '@/entities/organization/model/types/organizationMember.ts';
import MemberList from '../../member-list/MemberList';
import { Roles } from '@/shared/ui/action-menu';
import useWindowWidth from "@/shared/lib/hooks/useWindowWidth.ts";
import {MOBILE_MAX_BREAKPOINT, TABLET_MAX_BREAKPOINT} from "@/shared/const/WindowBreakpoints.ts";

const rolePriority = [
  OrganizationRoles.OWNER,
  OrganizationRoles.ADMIN,
  OrganizationRoles.EDITOR,
  OrganizationRoles.VIEWER,
];

export interface MembersProps {
  organization: OrganizationInfo;
  changeOrganization: (organization: OrganizationInfo) => void;
}

const Members: React.FC<MembersProps> = (props) => {
  const { organization, changeOrganization } = props;

  const dispatch = useAppDispatch();
  const windowWidth = useWindowWidth();

  const user = useSelector(getUserData)!;
  
  const [actionMenuPosition, setActionMenuPosition] = useState<ActionMenuPosition | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [isOpenContactPicker, setIsOpenContactPicker] = useState<boolean>(false);
  
  const myRole = getMyRoleInOrganization(organization, user);
  const sortedMembers = [...organization.members].sort((a, b) => {
    if (a.userId === user.userId) return -1;
    if (b.userId === user.userId) return 1;

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

  const deleteMember = async () => {
    closeActionMenuHandler();

    try {
      await dispatch(deleteMemberFromOrganization({
        userId: selectedMemberId!,
        organizationId: organization.organizationId,
      }));

      const modifiedOrganization: OrganizationInfo = {
        ...organization,
        members: organization.members.filter(m => m.userId !== selectedMemberId)
      };

      changeOrganization(modifiedOrganization);
    } catch (e) {
      console.error(e);
    }
  };

  const onCloseContactPickerHandler = () => {
    setIsOpenContactPicker(false);
  };

  const addMembers = async (contacts: Contact[]) => {
    try {
      const response = await dispatch(addMembersToOrganization({
        members: contacts.map(c => ({
          userId: c.userId,
          role: OrganizationRoles.VIEWER
        })),
        organizationId: organization.organizationId
      })).unwrap();

      changeOrganization(response);
    } catch (e) {
      console.error(e);
    } finally {
      onCloseContactPickerHandler();
      setSelectedContacts([]);
    }
  };

  const canEditMember = (member: OrganizationMember): boolean => {
    const myRolePriority = rolePriority.findIndex(r => r === myRole)!;
    const memberRolePriority = rolePriority.findIndex(r => r === member.role)!;

    return myRolePriority < memberRolePriority;
  };

  const changeRole = async (role: string) => {
    closeActionMenuHandler();

    try {
      const response = await dispatch(editRoleInOrganization({
        members: [{
          userId: selectedMemberId!,
          role: role as OrganizationRoles,
        }],
        organizationId: organization.organizationId
      })).unwrap();

      changeOrganization(response);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.Members}>
      <MemberList
        members={sortedMembers}
        canAddMember={isAdminInOrganization(myRole)}
        addMember={() => setIsOpenContactPicker(true)}
        canEditMember={canEditMember}
        editMember={openActionMenuHandler}
        membersType={'organizationMember'}
      >
        {(memberLength: number, filter: Element) =>
          <div className={styles.infoWrapper}>
            <span className={styles.countMembers}>
              {memberLength} участников

              {windowWidth <= TABLET_MAX_BREAKPOINT &&
                filter
              }
            </span>
          </div>
        }
      </MemberList>

      <ActionMenu
        onClose={closeActionMenuHandler}
        position={actionMenuPosition}
        deleteHandler={deleteMember}
        deleteText={'Исключить'}
        deleteIcon={icons.EXCLUDE}
        changeRoleHandler={changeRole}
        roles={isOwnerInOrganization(myRole) ? Roles : Roles.filter(r => r.name !== OrganizationRoles.ADMIN)}
      />

      {isAdminInOrganization(myRole) &&
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
      }
    </div>
  );
};

export default Members;
