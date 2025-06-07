import { Avatar, SvgIcon, icons, Picker, PickerProps, PickerItem } from '@/shared/ui';
import styles from './OrganizationPicker.module.scss';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import {
  fetchOrganizationInfo,
  Organization, 
} from '@/entities/organization';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CreateOrganizationFormModal } from '@/features/organization/create';
import { OrganizationInfo } from '@/entities/organization/model/types/organizationInfo.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface OrganizationPickerProps {
  hasCreateOrganization?: boolean;
  defaultOrganizationId?: string;
  onSelect?: (selectedOrganization: OrganizationInfo) => void;
  organizations: Organization[];
  classes?: PickerProps['classes'] & {
    image?: string;
  };
}

const OrganizationPicker: React.FC<OrganizationPickerProps> = (props) => {
  const {
    hasCreateOrganization = false,
    classes = {
      container: styles.organization,
      text: styles.title,
      iconArrow: styles.iconArrow,
      image: styles.image
    },
    onSelect,
    organizations,
    defaultOrganizationId = '',
  } = props;

  const dispatch = useAppDispatch();

  const [isOpenCreatorOrganization, setIsOpenCreatorOrganization] = useState<boolean>(false);
  const [pickerItems, setPickerItems] = useState<PickerItem[]>([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>(defaultOrganizationId);

  const onSelectHandler = async (organizationId: string) => {
    try {
      const response = await dispatch(fetchOrganizationInfo({ organizationId })).unwrap();
      setSelectedOrganizationId(organizationId);
      onSelect?.(response);
    } catch (error) {
      console.log(error);
    }
  };

  const closeCreatorOrganizationHandler = useCallback(() => setIsOpenCreatorOrganization(false), []);
  const openCreatorOrganizationHandler = useCallback(() => {
    setIsOpenCreatorOrganization(true);
  }, []);

  const onCreateOrganizationHandler = useCallback(() => {
    closeCreatorOrganizationHandler();
  }, []);

  useEffect(() => {
    const newPickerItems: PickerItem[] = organizations.map((org) => ({
      label: org.organizationName,
      value: org.organizationId,
      image: (
        <Avatar
          text={org.organizationName}
          className={classNames(styles.image, [classes.image])}
        />
      )
    }));

    if (hasCreateOrganization) {
      newPickerItems.push({
        label: 'Создать организацию',
        canChoose: false,
        onClick: openCreatorOrganizationHandler,
        image: (
          <SvgIcon
            iconName={icons.ORGANIZATION}
            important
            applyHover={false}
            className={classNames(styles.image, [classes.image])}
          />
        ),
      });
    }

    setPickerItems(newPickerItems);
  }, [organizations]);

  const defaultItemPicker: PickerItem = useMemo(() => ({
    label: 'Выберите организацию',
    image: (
      <SvgIcon
        iconName={icons.ORGANIZATION}
        important
        applyHover={false}
        className={classNames(styles.image, [classes.image])}
      />
    ),
  }), []);

  return (
    <>
      <Picker
        classes={classes}
        items={pickerItems}
        onSelect={onSelectHandler}
        defaultItem={defaultItemPicker}
        selectedValue={selectedOrganizationId}
      />

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
