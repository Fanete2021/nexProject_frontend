import { FC, memo } from 'react';
import './Loader.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface LoaderProps {
  className?: string;
}

const Loader: FC<LoaderProps> = memo(({ className }) => {
    return (
        <span
            className={classNames('loader',[ className ])}
        />
    );
});

Loader.displayName = 'Loader';
export default Loader;
