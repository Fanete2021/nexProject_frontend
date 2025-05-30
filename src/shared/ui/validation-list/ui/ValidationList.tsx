import React, { ReactNode } from 'react';
import styles from './ValidationList.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { useTranslation } from 'react-i18next';
import { Validation } from '@/shared/types/validation.ts';
import CheckIcon from './components/check-icon/CheckIcon';
import CrossIcon from './components/cross-icon/CrossIcon.tsx';

export enum ValidationListDirections {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL',
  ALL = 'ALL',
}

export interface ValidationListProps {
  children?: ReactNode;
  hasError?: boolean;
  items: Validation[];
  direction?: ValidationListDirections;
}

const ValidationList: React.FC<ValidationListProps> = (props) => {
  const {
    children,
    hasError = false,
    items,
    direction = ValidationListDirections.ALL
  } = props;
    
  const { t } = useTranslation();

  const mods: Record<string, boolean> = {
    [styles.errorValidationList]: hasError
  };

  return (
    <div className={styles.wrapper}>
      {children}

      <ul className={classNames(
        styles.validationList,
        [styles[direction]],
        mods
      )}>
        {items.map(item => (
          <li 
            className={item.isError ? '' : styles.valid}
            key={item.text}
          >
            {(item.isError && hasError)
              ? <CrossIcon />
              : <CheckIcon />
            }

            {t(item.text) as string}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ValidationList;
