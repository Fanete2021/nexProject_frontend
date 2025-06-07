import React, { useEffect, useRef, useState } from 'react';
import { Arrow, ArrowDirections, Scrollbar } from '@/shared/ui';
import { PickerItem } from '../model/types/pickerItem.ts';
import styles from './Picker.module.scss';
import Item from './components/Item.tsx';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';

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

  const [isVisibleItems, setIsVisibleItems] = useState(false);
  const [parentHeight, setParentHeight] = useState<number>(0);
  const [maxWidth, setMaxWidth] = useState<number>(10);

  const pickerRef = useRef<HTMLDivElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const mainItemRef = useRef<HTMLDivElement>(null);

  const windowWidth = useWindowWidth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        isVisibleItems
      ) {
        setIsVisibleItems(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    if (isVisibleItems) {
      document.body.style.pointerEvents = 'none';
      if (pickerRef.current) {
        pickerRef.current.style.pointerEvents = 'auto';
      }
    } else {
      document.body.style.pointerEvents = 'auto';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.pointerEvents = 'auto';
    };
  }, [isVisibleItems]);

  const resizePicker = () => {
    if (!pickerRef.current || !itemsContainerRef.current || !mainItemRef.current) return;

    if (!isVisibleItems) {
      pickerRef.current.style.width = itemsContainerRef.current.clientWidth + 'px';
      pickerRef.current.style.height = mainItemRef.current.clientHeight + 'px';
    }
  };

  useEffect(() => {
    if (!itemsContainerRef.current || !mainItemRef.current) return;

    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        resizePicker();
        
        if (!pickerRef.current || !mainItemRef.current) return;

        const pickerParent = pickerRef.current.parentElement!;
        const positionY = pickerRef.current.getBoundingClientRect().top - pickerParent.getBoundingClientRect().top;

        const calculatingHeight = pickerParent.parentElement!.getBoundingClientRect().height -
          mainItemRef.current.getBoundingClientRect().height - positionY;
        setParentHeight(calculatingHeight);
      });
    });

    observer.observe(itemsContainerRef.current);
    observer.observe(mainItemRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isVisibleItems]);

  const onSelectHandler = (item: PickerItem) => {
    setIsVisibleItems(false);
    item.onClick?.();
    if (item.canChoose !== false) onSelect?.(item.value);
  };

  useEffect(() => {
    if (!pickerRef.current || !itemsContainerRef.current || !mainItemRef.current) return;

    const pickerParent = pickerRef.current.parentElement!;
    const positionX = pickerRef.current.getBoundingClientRect().left - pickerParent.getBoundingClientRect().left;

    setMaxWidth(pickerParent.getBoundingClientRect().width - positionX);
    console.log(pickerParent.getBoundingClientRect().width - positionX)
  }, [windowWidth]);

  return (
    <div ref={pickerRef} className={styles.Picker}>
      <div
        className={classNames(
          styles.itemsContainer,
          [],
          {
            [styles.activeItemsContainer]: isVisibleItems
          }
        )}
        ref={itemsContainerRef}
        style={{
          maxWidth: isVisibleItems ? maxWidth + 10 : maxWidth, // +10, т.к left-5px и padding5px
        }}
      >
        <Item
          item={selectedItem || defaultItem}
          classes={classes}
          isMain
          onClick={() => setIsVisibleItems(!isVisibleItems)}
          ref={mainItemRef}
        >
          <Arrow
            className={classNames(styles.iconArrow, [classes?.iconArrow])}
            direction={isVisibleItems ? ArrowDirections.UP : ArrowDirections.DOWN}
          />
        </Item>

        <Scrollbar
          autoHeight
          autoHeightMax={parentHeight}
        >
          <div
            className={styles.items}
            style={{ display: isVisibleItems ? 'flex' : 'none' }}
          >
            {items
              .filter(item => !selectedValue || item.value !== selectedValue)
              .map((item) => (
                <Item
                  key={item.value + item.label}
                  item={item}
                  classes={classes}
                  onClick={() => onSelectHandler(item)}
                />
              ))}
          </div>
        </Scrollbar>

      </div>
    </div>
  );
};

export default Picker;
