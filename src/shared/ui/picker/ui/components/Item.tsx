import { PickerItem } from '../../model/types/pickerItem.ts';
import { PickerProps } from '../Picker.tsx';
import styles from './Item.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import React from 'react';

export interface ItemProps extends Pick<PickerProps, 'classes' > {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  item: PickerItem;
}

const Item: React.FC<ItemProps> = (props) => {
  const { children, classes, onClick, item } = props;

  return (
    <div
      className={classNames(styles.PickerItem, [classes?.container])}
      onClick={onClick}
    >
      {item.image}

      <span className={classes?.text}>
        {item.label}
      </span>

      {children}
    </div>
  );
};

export default Item;
