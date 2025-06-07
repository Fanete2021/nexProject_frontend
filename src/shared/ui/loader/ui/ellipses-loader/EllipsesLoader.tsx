import { FC, memo } from 'react';
import './EllipsesLoader.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface EllipsesLoaderProps {
  className?: string;
}

const EllipsesLoader: FC<EllipsesLoaderProps> = memo((props) => {
  const { className } = props;
  
  return (
    <div className={classNames('loader-container', [className])}>
      <div className="bouncing-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
});

EllipsesLoader.displayName = 'EllipsesLoader';
export default EllipsesLoader;
