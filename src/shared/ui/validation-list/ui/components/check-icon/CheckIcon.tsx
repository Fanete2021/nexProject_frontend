import React, { memo } from 'react';
import styles from '../../ValidationList.module.scss';
import { icons, SvgIcon } from '@/shared/ui';

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
export default CheckIcon;
