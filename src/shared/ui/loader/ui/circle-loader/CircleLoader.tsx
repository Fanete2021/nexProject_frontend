import { FC, memo } from 'react';
import './CircleLoader.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface CircleLoaderProps {
  className?: string;
}

const CircleLoader: FC<CircleLoaderProps> = memo(({ className }) => {
  return (
    <span
      className={classNames('loader',[ className ])}
    />
  );
});

CircleLoader.displayName = 'CircleLoader';
export default CircleLoader;
