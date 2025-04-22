import { memo } from 'react';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import styles from './Button.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  variant?: 'primary' | 'secondary'
}

const Button: React.FC<ButtonProps> = memo((props) => {
  const { variant = 'primary', className, children, ...rest } = props;

  return (
    <button
      className={classNames(styles.button, [styles[variant], className])}
      {...rest}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
