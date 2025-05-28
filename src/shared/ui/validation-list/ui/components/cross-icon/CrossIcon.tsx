import { memo } from 'react';
import styles from '../../ValidationList.module.scss';
import { icons, SvgIcon } from '@/shared/ui';

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
export default CrossIcon;
