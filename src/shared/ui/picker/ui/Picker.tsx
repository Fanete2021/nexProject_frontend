import React from 'react';
import { usePopover } from '@/shared/lib/hooks/usePopover.ts';
import { Arrow, ArrowDirections, Popover } from '@/shared/ui';
import { PickerItem } from '../model/types/pickerItem.ts';
import styles from './Picker.module.scss';
import Item from './components/Item.tsx';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface PickerProps {
  selectedValue?: string;
  items: PickerItem[];
  onSelect?: (item: string) => void;
  classes?: {
    container?: string;
    text?: string;
    iconArrow?: string;
  };
  defaultItem: PickerItem;
}

const Picker: React.FC<PickerProps> = (props) => {
  const { selectedValue, items, onSelect, classes, defaultItem } = props;

  const selectedItem = items.find(item => selectedValue && item.value === selectedValue);

  const { anchorEl, openPopover, isOpenPopover, closePopover } = usePopover();

  const onSelectHandler = (item: PickerItem) => {
    closePopover();

    if (item.onClick) {
      item.onClick();
    }

    if ((item.canChoose === undefined || item.canChoose) && item.value) {
      onSelect?.(item.value);
    }
  };

  return (
    <>
      <Item
        item={selectedItem ? selectedItem : defaultItem}
        classes={classes}
        onClick={openPopover}
      >
        <Arrow
          className={classNames(styles.iconArrow, [classes?.iconArrow])}
          direction={isOpenPopover ? ArrowDirections.UP : ArrowDirections.DOWN}
        />
      </Item>

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
        {items
          .filter(item => !selectedValue || (selectedValue && item.value !== selectedValue))
          .map((item) => (
            <Item
              key={item.value + item.label}
              item={item}
              classes={classes}
              onClick={() => onSelectHandler(item)}
            />
          ))
        }
      </Popover>
    </>
  );
};

export default Picker;
