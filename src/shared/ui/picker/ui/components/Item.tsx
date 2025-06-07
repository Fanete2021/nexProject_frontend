import { PickerItem } from '../../model/types/pickerItem.ts';
import { PickerProps } from '../Picker.tsx';
import styles from './Item.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import React, { CSSProperties, forwardRef } from 'react';

export interface ItemProps extends Pick<PickerProps, 'classes' > {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  item: PickerItem;
  isMain?: boolean;
  style?: CSSProperties;
}

const Item = forwardRef<HTMLDivElement, ItemProps>((props, ref) => {
  const { children, classes, onClick, item, isMain = false, style } = props;

  return (
    <div
      className={
        classNames(
          styles.Item,
          [classes?.container],
          {
            [styles.main]: isMain,
          }
        )
      }
      onClick={onClick}
      ref={ref}
      style={style}
    >
      <span className={styles.image}>
        {item.image}
      </span>

      <span className={classNames(styles.text, [classes?.text])}>
        {item.label}
      </span>

      {children}
    </div>
  );
});

Item.displayName = 'PickerItem';
export default Item;
