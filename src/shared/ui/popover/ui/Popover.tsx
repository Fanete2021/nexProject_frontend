import styles from './Popover.module.scss';
import { Popover as MUIPopover, PopoverProps as MUIPopoverProps } from '@mui/material';
import { useAppContainerRef } from '@/shared/lib/hooks/useAppContainerRef.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface PopoverProps extends MUIPopoverProps {
  children?: React.ReactNode;
}

const Popover: React.FC<PopoverProps> = (props) => {
  const { children, classes, ...rest } = props;

  const appContainerRef = useAppContainerRef();

  return (
    <MUIPopover
      container={appContainerRef.current || undefined}
      {...rest}
      classes={{
        paper: classNames(styles.popover, [classes?.paper])
      }}
    >
      {children}
    </MUIPopover>
  );
};

export default Popover;
