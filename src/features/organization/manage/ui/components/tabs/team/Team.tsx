import styles from './Team.module.scss';
import { ActionMenu, ActionMenuPosition, Avatar, icons, SvgIcon } from '@/shared/ui';
import { useSelector } from 'react-redux';
import {
  addMembersToTeam,
  deleteMemberFromTeam,
  getMyRoleInTeam,
  isAdminInTeam,
  TeamRoles,
  TeamInfo, TeamMember
} from '@/entities/team';
import { Contact } from '@/entities/contact';
import { getUserData } from '@/entities/user';
import React, { useState } from 'react';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { OrganizationInfo } from '@/entities/organization';
import { ContactPickerModal } from '@/widgets/pickers/contact-picker';
import MemberList from '../../member-list/MemberList.tsx';
import { AppRoutes } from '@/shared/config/routeConfig/routeConfig.tsx';

const rolePriority = [
  TeamRoles.OWNER,
  TeamRoles.ADMIN,
  TeamRoles.EDITOR,
  TeamRoles.VIEWER,
];

export interface TeamsProps {
  organization: OrganizationInfo;
  team: TeamInfo;
  changeTeam: (team: TeamInfo) => void;
}

const Team: React.FC<TeamsProps> = (props) => {
  const { team, organization, changeTeam } = props;

  const dispatch = useAppDispatch();

  const user = useSelector(getUserData)!;

  const [actionMenuPosition, setActionMenuPosition] = useState<ActionMenuPosition | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [isOpenContactPicker, setIsOpenContactPicker] = useState<boolean>(false);

  const myRole = getMyRoleInTeam(team, user);

  const contactsInOrganization: Contact[] = organization.members.map((member) => ({
    name: member.name,
    userId: member.userId,
    username: member.username
  }));

  const sortedMembers = [...team.teamMembers].sort((a, b) => {
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
      await dispatch(deleteMemberFromTeam({
        userId: selectedMemberId!,
        teamId: team.teamId,
      }));

      const modifiedTeam: TeamInfo = {
        ...team,
        teamMembers: team.teamMembers.filter(m => m.userId !== selectedMemberId)
      };

      changeTeam(modifiedTeam);
    } catch (error) {
      console.error(error);
    }
  };

  const onCloseContactPickerHandler = () => {
    setIsOpenContactPicker(false);
  };

  const addMembers = async (contacts: Contact[]) => {
    try {
      const response = await dispatch(addMembersToTeam({
        members: contacts.map(c => ({
          userId: c.userId,
          role: TeamRoles.VIEWER
        })),
        teamId: team.teamId
      }));

      changeTeam(response.payload);
    } catch (error) {
      console.error(error);
    } finally {
      onCloseContactPickerHandler();
      setSelectedContacts([]);
    }
  };

  const canEditMember = (member: TeamMember) => {
    return member.userId !== user.userId && isAdminInTeam(myRole) && !isAdminInTeam(member.role);
  };

  const generateLinkForMember = (memberId: string) => {
    return `/${AppRoutes.TEAM_MEMBER_STATS}/${team.teamId}/${memberId}`;
  };
  
  return (
    <div className={styles.Teams}>
      <MemberList 
        canEditMember={canEditMember}
        editMember={openActionMenuHandler}
        canAddMember={isAdminInTeam(myRole)}
        members={sortedMembers}
        addMember={() => setIsOpenContactPicker(true)}
        getLink={generateLinkForMember}
        membersType={'teamMember'}
      >
        {(memberLength: number) =>
          <>
            <div className={styles.header}>
              <Avatar
                width={40}
                height={40}
                text={team.teamName}
              />

              {team.teamName}
            </div>

            <div className={styles.infoWrapper}>
              <SvgIcon
                iconName={icons.INFO}
                applyHover={false}
                important
                className={styles.iconInfo}
              />

              <div className={styles.info}>
                <div className={styles.infoHeader}>
                  <span className={styles.countMembers}>
                    {memberLength} участника
                  </span>

                  <span className={styles.tags}>
                    {team.teamTags.map((tag) => (
                      <span key={tag.tagName}>#{tag.tagName}</span>
                    ))}
                  </span>
                </div>

                {team.teamDescription &&
                  <span className={styles.description}>
                    {team.teamDescription}
                  </span>
                }
              </div>
            </div>
          </>
        }
      </MemberList>

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
        filterIds={team.teamMembers.map(m => m.userId)}
        footerText='Добавить'
        pickHandler={addMembers}
        data={contactsInOrganization}
      />
    </div>
  );
};

export default Team;
