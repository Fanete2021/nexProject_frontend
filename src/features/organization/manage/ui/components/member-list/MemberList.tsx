import React, { ReactNode, useEffect, useState } from 'react';
import { Avatar, icons, Popover, Scrollbar, SvgIcon } from '@/shared/ui';
import { OrganizationMember, OrganizationRoles } from '@/entities/organization';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import styles from './MemberList.module.scss';
import { TeamMember, TeamRoles } from '@/entities/team';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/user';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';
import Filter from './components/filter/Filter.tsx';
import { usePopover } from '@/shared/lib/hooks/usePopover.ts';
import {DESKTOP_MIN_BREAKPOINT, TABLET_MAX_BREAKPOINT} from "@/shared/const/WindowBreakpoints.ts";

export interface MemberListProps {
  members: (OrganizationMember | TeamMember)[];
  membersType: 'organizationMember' | 'teamMember';
  canAddMember?: boolean;
  addMember?: () => void;
  canEditMember?: ((member: OrganizationMember) => boolean) | ((member: TeamMember) => boolean);
  editMember?: (event: React.MouseEvent<HTMLElement, MouseEvent>, memberId: string) => void;
  children: (memberLength: number, iconFilter: Element) => ReactNode;
  getLink?: (memberId: string) => string;
}

const MemberList: React.FC<MemberListProps> = (props) => {
  const { members, canAddMember = false, addMember, canEditMember, editMember, children, getLink, membersType } = props;

  const { t } = useTranslation();
  const windowWidth = useWindowWidth();
  
  const user = useSelector(getUserData)!;
  
  const [searchedMember, setSearcherMember] = useState<string>('');
  const [filteredMembers, setFilteredMembers] = useState<typeof members>([]);
  const [selectedRoles, setSelectedRoles] = useState<{ label: string, value: boolean }[]>([]);

  const { anchorEl, openPopover, isOpenPopover, closePopover } = usePopover();

  useEffect(() => {
    const roles = membersType === 'organizationMember' ? OrganizationRoles : TeamRoles;
    const modifiedRoles = Object.values(roles).map((item) => ({
      label: item, value: true
    }));

    setSelectedRoles(modifiedRoles);
  }, [membersType, members]);

  useEffect(() => {
    const activeRoles = selectedRoles
      .filter((role) => role.value)
      .map((role) => role.label);

    setFilteredMembers(members.filter(
      (member) => member.name.includes(searchedMember) && activeRoles.includes(member.role)
    ));
  }, [searchedMember, members, selectedRoles]);

  const iconFilter = () => {
    return (
      <SvgIcon
        iconName={icons.FILTER}
        applyFill={false}
        applyHover={false}
        applyStroke
        className={styles.iconFilter}
        onClick={openPopover}
        important={Boolean(searchedMember) || selectedRoles.filter(role => !role.value).length > 0}
      />
    );
  };

  return (
    <div className={styles.MemberList}>
      <div className={styles.list}>
        {children(filteredMembers.length, iconFilter())}

        <div className={styles.MemberList}>
          <SvgIcon
            iconName={icons.PEOPLE}
            className={styles.iconPeople}
            applyHover={false}
            applyStroke
            applyFill={false}
          />

          <Scrollbar>
            <div className={styles.members}>
              {canAddMember &&
                <button
                  className={classNames(styles.member, [styles.addMember])}
                  onClick={addMember}
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

              {filteredMembers.map(member => {
                const isLink = Boolean(getLink);

                const MemberWrapper = isLink ? Link : 'div';

                const wrapperProps = isLink
                  ? { to: getLink!(member.userId) }
                  : undefined;

                return (
                  <MemberWrapper
                    {...wrapperProps}
                    key={member.userId}
                    className={classNames(styles.member, [], {
                      [styles.myCard]: member.userId === user.userId,
                      [styles.link]: isLink
                    })}
                    onContextMenu={canEditMember && canEditMember(member) &&
                      ((e) => editMember?.(e, member.userId))
                    }
                  >
                    <Avatar
                      text={member.name}
                      className={styles.avatar}
                    />

                    <div className={styles.info}>
                      <span className={styles.name}>{member.name}</span>
                      <span className={styles.role}>{t(member.role) as string}</span>
                    </div>

                    {canEditMember && canEditMember(member) &&
                      <div
                        className={styles.wrapperIconActionMenu}
                        onClick={(e) => editMember?.(e, member.userId)}
                      >
                        <SvgIcon
                          iconName={icons.ACTION_MENU}
                          applyStroke
                          applyFill={false}
                          className={styles.iconActionMenu}
                        />
                      </div>
                    }
                  </MemberWrapper>
                );
              })}
            </div>
          </Scrollbar>
        </div>
      </div>

      {windowWidth >= DESKTOP_MIN_BREAKPOINT &&
        <Filter
          setSearcherMember={setSearcherMember}
          searchedMember={searchedMember}
          selectedRoles={selectedRoles}
          setSelectedRoles={setSelectedRoles}
        />
      }

      {windowWidth <= TABLET_MAX_BREAKPOINT &&
        <Popover
          open={isOpenPopover}
          anchorEl={anchorEl}
          onClose={closePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          classes={{
            paper: styles.paper,
            root: styles.root
          }}
        >
          <Filter
            setSearcherMember={setSearcherMember}
            searchedMember={searchedMember}
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
          />
        </Popover>
      }
    </div>
  );
};

export default MemberList;
