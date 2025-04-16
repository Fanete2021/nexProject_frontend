import React, { forwardRef } from 'react';
import { Scrollbars, ScrollbarProps as ScrollbarsProps } from 'react-custom-scrollbars-2';
import styles from './Scrollbar.module.scss';
import './Scrollbar.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface ScrollbarProps extends ScrollbarsProps {
  children: React.ReactNode;
}

const Scrollbar = forwardRef<Scrollbars, ScrollbarProps>((props, ref) => {
  const { children, className, ...rest } = props;

  const renderThumbVertical = ({ style, ...props }: any) => {
    return <div {...props} style={{ ...style }} className={styles.renderThumbVertical} />;
  };

  return (
    <Scrollbars
      renderThumbVertical={renderThumbVertical}
      {...rest}
      ref={ref}
      className={classNames(styles.scrollbar, ['scrollbar', className])}
    >
      {children}
    </Scrollbars>
  );
});

Scrollbar.displayName = 'Scrollbar';
export default Scrollbar;
