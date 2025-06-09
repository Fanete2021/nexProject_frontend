import React, { FC, useCallback, useEffect } from 'react';
import styles from './Modal.module.scss';
import { classNames, Mods } from '@/shared/lib/utils/classNames.ts';
import {icons, Portal, SvgIcon} from '@/shared/ui';
import {MOBILE_MAX_BREAKPOINT} from "@/shared/const/WindowBreakpoints.ts";

export interface ModalProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  hasOverlayBlackout?: boolean;
  hasCross?: boolean;
}

export const Modal: FC<ModalProps> = (props) => {
  const {
    className,
    isOpen = false,
    onClose,
    children,
    hasOverlayBlackout = true,
    hasCross = true
  } = props;

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
  }, [ onClose ]);

  const onContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [ isOpen, onKeyDown ]);

  const mods: Mods = {
    [styles.opened]: isOpen,
  };

  return (
    <Portal>
      <div className={classNames(styles.Modal, [ className ], mods)}>
        <div
          className={classNames(styles.overlay, [], {
            [styles.blackout]: hasOverlayBlackout
          })}
          onClick={onClose}
        >
          <div
            className={styles.content}
            onClick={onContentClick}
          >
            {hasCross &&
              <SvgIcon
                iconName={icons.CROSS}
                important
                applyStroke
                applyFill={false}
                className={styles.iconClose}
                onClick={onClose}
              />
            }

            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
