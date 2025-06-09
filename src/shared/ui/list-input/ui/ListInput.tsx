import {CustomInput, CustomInputProps, icons, SvgIcon, ValidationList, ValidationListDirections} from '@/shared/ui';
import {ReactNode, useState} from 'react';
import styles from './ListInput.module.scss';
import { InputAdornment } from '@mui/material';
import { Validation } from '@/shared/types/validation.ts';
import {isFormikErrorVisible} from "@/shared/lib/utils/isFormikErrorVisible.ts";

export interface ListInputProps {
  inputProps?: CustomInputProps;
  items: string[];
  maxItems: number;
  onChange: (updatedItems: string[]) => void;
  isValueValid?: (value: string) => Validation[];
  validationListDirection?: ValidationListDirections;
}

const ListInput: React.FC<ListInputProps> = (props) => {
  const { inputProps, items, maxItems, onChange, isValueValid, validationListDirection = ValidationListDirections.VERTICAL } = props;

  const [inputValue, setInputValue] = useState('');

  const valueValid = isValueValid && isValueValid(inputValue);
  const hasError = valueValid && valueValid.filter(validation => validation.isError).length > 0;

  const handleAddItem = () => {
    if (hasError) {
      return;
    }

    if (inputValue.trim() && items.length < maxItems) {
      const updatedItems = [...items, inputValue.trim()];
      onChange(updatedItems);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onChange(updatedItems);
  };

  const validationWrapper = (children: ReactNode) => {
    if (!valueValid) {
      return children;
    }

    return (
      <ValidationList
        items={valueValid}
        direction={validationListDirection}
        hasError={hasError}
      >
        { children }
      </ValidationList>
    );
  };

  return (
    <div className={styles.ListInput}>
      {validationWrapper(
        <CustomInput
          {...inputProps}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          isError={hasError}
          endAdornment={
            <InputAdornment position="end">
              <button type="button" onClick={handleAddItem} className={styles.addTag}>
                <SvgIcon
                  iconName={icons.ADD}
                  applyHover={items.length < maxItems}
                  important={items.length < maxItems}
                  className={styles.addIcon}
                />
              </button>
            </InputAdornment>
          }
        />
      )}

      {items.length > 0 && (
        <ul className={styles.list}>
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className={styles.item}
            >
              {item}

              <SvgIcon
                iconName={icons.CROSS}
                applyStroke={true}
                applyFill={false}
                applyHover={false}
                className={styles.deleteIcon}
                onClick={() => handleDeleteItem(index)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListInput;
