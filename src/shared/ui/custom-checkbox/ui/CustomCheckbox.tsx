import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CustomCheckbox.module.scss';
import { icons, SvgIcon } from '@/shared/ui';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface CustomCheckboxProps extends React.ComponentPropsWithoutRef<'input'> {
  label?: string;
  className?: string;
  setRounded?: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = (props) => {
  const { t } = useTranslation();
  const { label, className, setRounded = false, ...rest } = props;

  return (
    <label className={classNames(styles.CustomCheckbox, [className])}>
      <input
        type="checkbox"
        className={styles.input}
        {...rest}
      />

      <span 
        className={classNames(
          styles.checkmark,
          [],
          {
            [styles.circle]: setRounded
          })
        }
      >
        <SvgIcon
          className={styles.check}
          iconName={icons.CHECK}
          applyFill={false}
          applyHover={false}
          applyStroke
        />
      </span>

      {label && (
        <span className={styles.label}>{t(label) as string}</span>
      )}
    </label>
  );
};

export default CustomCheckbox;
