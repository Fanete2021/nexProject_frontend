import { Suspense } from 'react';
import './styles/index.scss';
import { EllipsesLoader } from '@/shared/ui';
import AppRouter from './providers/router/AppRouter.tsx';
import { useTheme } from '@/app/providers/theme-provider';
import { classNames } from '@/shared/lib/utils/classNames.ts';

const App = () => {
  const { theme } = useTheme();

  return (
    <div className={classNames('app', [ theme ])}>
      <Suspense fallback={<EllipsesLoader />}>
        <AppRouter />
      </Suspense>
    </div>
  );
};

export default App;
