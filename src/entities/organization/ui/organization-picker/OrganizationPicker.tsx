import { useSelector } from 'react-redux';
import { getOrganizationData } from '../../model/selectors/getOrganizationData.ts';
import { getOrganizationSelectedOrganization } from '../../model/selectors/getOrganizationSelectedOrganization.ts';
import { Arrow, ArrowDirections, Avatar, Popover, SvgIcon, icons } from '@/shared/ui';
import styles from './OrganizationPicker.module.scss';
import { usePopover } from '@/shared/lib/hooks/usePopover.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { fetchOrganizationInfo } from '@/entities/organization';

const OrganizationPicker = () => {
  const organizations = useSelector(getOrganizationData)!;
  const selectedOrganization = useSelector(getOrganizationSelectedOrganization);
  
  const dispatch = useAppDispatch();

  const { anchorEl, openPopover, isOpenPopover, closePopover } = usePopover();
  
  const onClickHandler = (organizationId: string) => {
    closePopover();

    dispatch(fetchOrganizationInfo({
      organizationId
    }));
  };
  
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
      </Popover>
    </>
  );
};

export default OrganizationPicker;
