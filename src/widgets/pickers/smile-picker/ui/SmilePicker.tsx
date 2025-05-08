import React, { useState, useCallback } from 'react';
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react';
import emojis from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { icons, SvgIcon } from '@/shared/ui';
import styles from './SmilePicker.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { Theme, useTheme } from '@/app/providers/theme-provider';

export interface SmilePickerProps {
  className?: string;
  onEmojiSelect: (emoji: string) => void;
}

const SmilePicker: React.FC<SmilePickerProps> = ({ className, onEmojiSelect }) => {
  const [open, setOpen] = useState(false);
  const { x, y, strategy, refs } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'top',
    middleware: [
      offset(10),
      flip(),
      shift({ padding: 5 })
    ],
    whileElementsMounted: autoUpdate
  });

  const { theme } = useTheme();

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      refs.floating.current && !refs.floating.current.contains(event.target as Node) &&
      refs.reference.current && !refs.reference.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  }, [refs]);

  return (
    <>
      <button
        ref={refs.setReference}
        className={classNames(styles.SmilePicker, [className])}
        onClick={handleToggle}
      >
        <SvgIcon iconName={icons.SMILE} className={styles.smile} important />
      </button>

      {open && (
        <div
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            zIndex: 1000,
          }}
          className={styles.popover}
        >
          <Picker
            data={emojis}
            onEmojiSelect={(emojiObject) => {
              onEmojiSelect(emojiObject.native);
              setOpen(false);
            }}
            onClickOutside={handleClickOutside}
            locale='ru'
            theme={theme === Theme.MINIMALISTIC_LIGHT ? 'light' : 'dark'}
          />
        </div>
      )}
    </>
  );
};

export default SmilePicker;
