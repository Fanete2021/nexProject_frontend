import React, { memo, ReactNode } from 'react';
import styles from './ValidationList.module.scss';
import { icons, SvgIcon } from '@/shared/ui';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { useTranslation } from 'react-i18next';
import { Validation } from '@/shared/types/validation.ts';

const CheckIcon = memo(() => (
  <div className={styles.iconWrapper}>
    <SvgIcon
      iconName={icons.CHECK}
      important
      applyFill={false}
      applyStroke
      applyHover={false}
      className={styles.icon}
    />
  </div>
));
CheckIcon.displayName = 'CheckIcon';

const CrossIcon = memo(() => (
  <div className={styles.iconWrapper}>
    <SvgIcon
      iconName={icons.CROSS}
      important
      applyFill={false}
      applyStroke
      applyHover={false}
      className={styles.icon}
    />
  </div>
));
CrossIcon.displayName = 'CrossIcon';

export interface ValidationListProps {
    children?: ReactNode;
    hasError?: boolean;
    items: Validation[];
}

const ValidationList: React.FC<ValidationListProps> = (props) => {
  const {
    children,
    hasError = false,
    items
  } = props;
    
  const { t } = useTranslation();

  const mods: Record<string, boolean> = {
    [styles.errorValidationList]: hasError
  };

  return (
    <div className={styles.wrapper}>
      {children}

      <ul className={classNames(styles.validationList,[], mods)}>
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
