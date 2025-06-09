import React, { useState, useEffect } from 'react';
import styles from './CheckList.module.scss';
import CustomCheckbox from '@/shared/ui/custom-checkbox/ui/CustomCheckbox.tsx';

export interface CheckListProps {
  items: {
    label: string;
    value: boolean;
  }[];
  onChange?: (items: { label: string; value: boolean }[]) => void;
}

const CheckList: React.FC<CheckListProps> = (props) => {
  const { items: initialItems, onChange } = props;
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleCheckboxChange = (label: string) => {
    const updatedItems = items.map((item) =>
      item.label === label ? { ...item, value: !item.value } : item
    );
    setItems(updatedItems);
    if (onChange) {
      onChange(updatedItems);
    }
  };

  const handleSelectAll = () => {
    const allSelected = items.every((item) => item.value);
    const updatedItems = items.map((item) => ({ ...item, value: !allSelected }));
    setItems(updatedItems);
    if (onChange) {
      onChange(updatedItems);
    }
  };

  return (
    <div className={styles.CheckList}>
      {items.map((item) => (
        <CustomCheckbox
          key={item.label}
          label={item.label}
          checked={item.value}
          onChange={() => handleCheckboxChange(item.label)}
        />
      ))}

      <CustomCheckbox
        label={'Все'}
        checked={items.every((item) => item.value)}
        onChange={handleSelectAll}
      />
    </div>
  );
};

export default CheckList;
