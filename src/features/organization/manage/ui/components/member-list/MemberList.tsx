import React, { ReactNode } from 'react';
import { Avatar, icons, Scrollbar, Search, SvgIcon } from '@/shared/ui';
import { OrganizationMember } from '@/entities/organization';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import styles from './MemberList.module.scss';
import { TeamMember } from '@/entities/team';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/user';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export interface MemberListProps {
  members: OrganizationMember[] | TeamMember[];
  canAddMember?: boolean;
  addMember?: () => void;
  canEditMember?: ((member: OrganizationMember) => boolean) | ((member: TeamMember) => boolean);
  editMember?: (event: React.MouseEvent<HTMLElement, MouseEvent>, memberId: string) => void;
  children: ReactNode;
  getLink?: (memberId: string) => string;
}

const MemberList: React.FC<MemberListProps> = (props) => {
  const { members, canAddMember = false, addMember, canEditMember, editMember, children, getLink } = props;

  const { t } = useTranslation();
  
  const user = useSelector(getUserData)!;

  return (
    <div className={styles.MemberList}>
      <div className={styles.list}>
        {children}

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
                  className={styles.member}
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

              {members.map(member => {
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
                  >
                    <Avatar
                      width={50}
                      height={50}
                      text={member.name}
                    />

                    <div className={styles.info}>
                      <span className={styles.name}>{member.name}</span>
                      <span className={styles.role}>{t(member.role) as string}</span>
                    </div>

                    {canEditMember && canEditMember(member) &&
                      <SvgIcon
                        iconName={icons.ACTION_MENU}
                        applyStroke
                        applyFill={false}
                        className={styles.iconActionMenu}
                        onClick={(e) => editMember?.(e, member.userId)}
                      />
                    }
                  </MemberWrapper>
                );
              })}
            </div>
          </Scrollbar>
        </div>
      </div>

      <div className={styles.filter}>
        <div className={styles.header}>
          Фильтры

          <SvgIcon
            iconName={icons.FILTER}
            applyFill={false}
            applyHover={false}
            applyStroke
            className={styles.iconFilter}
          />
        </div>

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
    </div>
  );
};

export default MemberList;
