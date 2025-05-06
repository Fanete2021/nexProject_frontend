import { useSelector } from 'react-redux';
import { Arrow, ArrowDirections, Avatar, Popover, SvgIcon, icons } from '@/shared/ui';
import styles from './OrganizationPicker.module.scss';
import { usePopover } from '@/shared/lib/hooks/usePopover.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import {
  fetchOrganizationInfo,
  getOrganizationData,
  getOrganizationSelectedOrganization
} from '@/entities/organization';
import { teamActions } from '@/entities/team';
import { useCallback, useState } from 'react';
import { CreateOrganizationFormModal } from '@/features/organization/create';

export interface OrganizationPickerProps {
  hasCreateOrganization?: boolean;
}

const OrganizationPicker: React.FC<OrganizationPickerProps> = (props) => {
  const { hasCreateOrganization = false } = props;

  const dispatch = useAppDispatch();

  const organizations = useSelector(getOrganizationData)!;
  const selectedOrganization = useSelector(getOrganizationSelectedOrganization);

  const [isOpenCreatorOrganization, setIsOpenCreatorOrganization] = useState<boolean>(false);

  const { anchorEl, openPopover, isOpenPopover, closePopover } = usePopover();
  
  const onClickHandler = (organizationId: string) => {
    closePopover();

    dispatch(fetchOrganizationInfo({
      organizationId
    }));
    dispatch(teamActions.resetSelectedTeam());
  };

  const closeCreatorOrganizationHandler = useCallback(() => setIsOpenCreatorOrganization(false), []);
  const openCreatorOrganizationHandler = useCallback(() => {
    closePopover();
    setIsOpenCreatorOrganization(true);
  }, []);

  const onCreateOrganizationHandler = useCallback(() => {
    closeCreatorOrganizationHandler();
  }, []);
  
  return (
    <>
      <div className={styles.organization} onClick={openPopover}>
        {selectedOrganization
          ?
          <>
            <Avatar
              text={selectedOrganization?.organizationName}
              height={50}
              width={50}
              className={styles.avatar}
            />

            <span className={styles.title}>
              {selectedOrganization?.organizationName}
            </span>
          </>
          :
          <>
            <SvgIcon
              iconName={icons.ORGANIZATION}
              important
              applyHover={false}
              className={styles.iconOrganization}
            />

            <span className={styles.title}>
              Выберите организацию
            </span>
          </>
        }

        <Arrow
          className={styles.iconArrow}
          direction={isOpenPopover ? ArrowDirections.UP : ArrowDirections.DOWN}
        />
      </div>

      <Popover
        open={isOpenPopover}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        classes={{
          paper: styles.popover
        }}
      >
        {organizations
          .filter(o => o.organizationId !== selectedOrganization?.organizationId)
          .map((organization) => (
            <div 
              key={organization.organizationId}
              className={styles.organization}
              onClick={() => onClickHandler(organization.organizationId)}
            >
              <Avatar
                text={organization.organizationName}
                height={50}
                width={50}
                className={styles.avatar}
              />

              <span className={styles.title}>
                {organization.organizationName}
              </span>
            </div>
          ))}

        {hasCreateOrganization &&
          <div className={styles.organization} onClick={openCreatorOrganizationHandler}>
            <SvgIcon
              iconName={icons.ORGANIZATION}
              important
              applyHover={false}
              className={styles.iconOrganizationAdd}
            />

            <span className={styles.title}>
              Создать организацию
            </span>
          </div>
        }
      </Popover>

      {hasCreateOrganization &&
        <CreateOrganizationFormModal
          onClose={closeCreatorOrganizationHandler}
          isOpen={isOpenCreatorOrganization}
          onCreateHandler={onCreateOrganizationHandler}
        />
      }
    </>
  );
};

export default OrganizationPicker;
