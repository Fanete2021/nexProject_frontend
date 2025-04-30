import { Menu, MenuItem } from '@mui/material';
import styles from './ActionMenu.module.scss';
import { icons, SvgIcon } from '@/shared/ui';
import React, { useEffect, useRef } from 'react';

export interface ContextMenuProps {
  onClose: () => void,
  position: { x: number; y: number } | null,
  editHandler?: () => void,
  deleteHandler?: () => void,
}

const ActionMenu: React.FC<ContextMenuProps> = (props) => {
  const { position, onClose, editHandler, deleteHandler } = props;

  const appContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    appContainerRef.current = document.querySelector('.app');
  }, []);

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
      classes={{ paper: styles.ContextMenu }}
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
            iconName={icons.DELETE}
            applyStroke
            applyFill={false}
            applyHover={false}
          />

          Удалить
        </MenuItem>
      )}
    </Menu>
  );
};

export default ActionMenu;
