import { GuestPageLayout } from '@/widgets/guest-page-layout';

function GuestRoutes({ children }: { children: JSX.Element }) {
  return (
    <GuestPageLayout>
      {children}
    </GuestPageLayout>
  );
}

export default GuestRoutes;
