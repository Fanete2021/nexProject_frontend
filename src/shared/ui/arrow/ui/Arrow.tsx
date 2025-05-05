import { icons, SvgIcon } from '@/shared/ui';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import styles from './Arrow.module.scss';
import React from 'react';

export enum ArrowDirections {
  UP = 'up',
  DOWN = 'down',
}

export interface ArrowProps extends React.SVGAttributes<SVGSVGElement> {
  className?: string;
  direction?: ArrowDirections;
}

const Arrow: React.FC<ArrowProps> = (props) => {
  const { className, direction = ArrowDirections.UP } = props;

  return (
    <SvgIcon
      iconName={icons.ARROW}
      important
      className={classNames(
        styles.arrow,
        [className],
        {
          [styles.UP]: direction === ArrowDirections.UP,
          [styles.DOWN]: direction === ArrowDirections.DOWN,
        }
      )}
    />
  );
};

export default Arrow;
