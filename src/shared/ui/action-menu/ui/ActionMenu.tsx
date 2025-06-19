import { Menu, MenuItem } from '@mui/material';
import styles from './ActionMenu.module.scss';
import { icons, SvgIcon } from '@/shared/ui';
import React, { useState } from 'react';
import { useAppContainerRef } from '@/shared/lib/hooks/useAppContainerRef.ts';
import { ActionMenuPosition } from '../model/types/actionMenuPosition.ts';
import { Role } from '../model/types/role.ts';
import { Roles } from '../model/data/roles.ts';
import { useTranslation } from 'react-i18next';

export interface ActionMenuProps {
  onClose: () => void,
  position: ActionMenuPosition | null,
  editHandler?: () => void,
  deleteHandler?: () => void,
  deleteText?: string;
  deleteIcon?: icons.DELETE | icons.EXCLUDE;
  roles?: Role[];
  changeRoleHandler?: (role: string) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = (props) => {
  const {
    position,
    onClose,
    editHandler,
    deleteHandler,
    deleteText = 'Удалить',
    deleteIcon = icons.DELETE,
    roles = Roles,
    changeRoleHandler
  } = props;

  const { t } = useTranslation();

  const [roleMenuAnchorEl, setRoleMenuAnchorEl] = useState<null | HTMLElement>(null);
  const appContainerRef = useAppContainerRef();

  const handleRoleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setRoleMenuAnchorEl(event.currentTarget);
  };

  const handleRoleMenuClose = () => {
    setRoleMenuAnchorEl(null);
  };

  const handleRoleSelect = (role: string) => {
    changeRoleHandler?.(role);
    handleRoleMenuClose();
  };

  return (
    <Menu
      open={Boolean(position)}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={
        position !== null
          ? { top: position.y, left: position.x }
          : undefined
      }
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
      classes={{ paper: styles.ActionMenu }}
      container={appContainerRef.current || undefined}
    >
      {editHandler && (
        <MenuItem onClick={editHandler}>
          <SvgIcon
            iconName={icons.EDIT}
            applyStroke
            applyFill={false}
            applyHover={false}
            className={styles.icon}
          />
          Редактировать
        </MenuItem>
      )}

      {changeRoleHandler &&
        <>
          <MenuItem onClick={handleRoleMenuOpen}>
            <SvgIcon
              iconName={icons.ROLE}
              applyStroke
              applyFill={false}
              applyHover={false}
              className={styles.icon}
            />
            Сменить роль
          </MenuItem>

          <Menu
            anchorEl={roleMenuAnchorEl}
            open={Boolean(roleMenuAnchorEl)}
            onClose={handleRoleMenuClose}
            container={appContainerRef.current || undefined}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            classes={{ paper: styles.rolesMenu }}
          >
            {roles.map((role) => (
              <MenuItem
                key={role.name}
                onClick={() => handleRoleSelect(role.name)}
              >
                <SvgIcon
                  iconName={role.icon}
                  applyStroke
                  applyFill={false}
                  applyHover={false}
                  className={styles.roleIcon}
                />

                {t(role.name) as string}
              </MenuItem>
            ))}
          </Menu>
        </>
      }

      {deleteHandler && (
        <MenuItem onClick={deleteHandler}>
          <SvgIcon
            iconName={deleteIcon}
            applyStroke
            applyFill={false}
            applyHover={false}
            className={styles.icon}
          />

          {deleteText}
        </MenuItem>
      )}
    </Menu>
  );
};

export default ActionMenu;
