import { Menu, MenuItem } from '@mui/material';
import styles from './ActionMenu.module.scss';
import { icons, SvgIcon } from '@/shared/ui';
import React from 'react';
import { useAppContainerRef } from '@/shared/lib/hooks/useAppContainerRef.ts';
import { ActionMenuPosition } from '../model/types/actionMenuPosition.ts';

export interface ActionMenuProps {
  onClose: () => void,
  position: ActionMenuPosition | null,
  editHandler?: () => void,
  deleteHandler?: () => void,
  deleteText?: string;
  deleteIcon?: icons.DELETE | icons.CROSS;
}

const ActionMenu: React.FC<ActionMenuProps> = (props) => {
  const { position, onClose, editHandler, deleteHandler, deleteText = 'Удалить', deleteIcon = icons.DELETE } = props;
  const appContainerRef = useAppContainerRef();

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
          />

          Редактировать
        </MenuItem>
      )}

      {deleteHandler && (
        <MenuItem onClick={deleteHandler}>
          <SvgIcon
            iconName={deleteIcon}
            applyStroke
            applyFill={false}
            applyHover={false}
          />

          {deleteText}
        </MenuItem>
      )}
    </Menu>
  );
};

export default ActionMenu;
