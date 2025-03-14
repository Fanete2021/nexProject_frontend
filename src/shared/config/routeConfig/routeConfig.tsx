import { PathRouteProps } from 'react-router-dom';
import { MainPage } from '@/pages/main-page';
import { AuthPage } from '@/pages/auth-page';
import { ChatsPage } from '@/pages/chats-page';
import { TeamsPage } from '@/pages/teams-page';
import { CalendarPage } from '@/pages/calendar-page';
import { NotificationsPage } from '@/pages/notifications-page';
import { EmailPage } from '@/pages/email-page';
import { ChangesPage } from '@/pages/changes-page';
import { DocsPage } from '@/pages/docs-page';
import { RegistrationPage } from '@/pages/registration-page';

export type AppRoutesProps = PathRouteProps & {
    authOnly?: boolean;
};

export enum AppRoutes {
  AUTH = 'auth',
  REGISTRATION = 'registration',
  MAIN = 'main',
  CHATS = 'chats',
  TEAMS = 'teams',
  CALENDAR = 'calendar',
  DOCS  = 'docs',
  NOTIFICATIONS  = 'notifications',
  EMAIL  = 'email',
  CHANGES  = 'changes',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.AUTH]: '/auth',
    [AppRoutes.REGISTRATION]: `/${AppRoutes.REGISTRATION}`,
    [AppRoutes.MAIN]: '/',
    [AppRoutes.CHATS]: `/${AppRoutes.CHATS}`,
    [AppRoutes.TEAMS]: `/${AppRoutes.TEAMS}`,
    [AppRoutes.CALENDAR]: `/${AppRoutes.CALENDAR}`,
    [AppRoutes.DOCS]: `/${AppRoutes.DOCS}`,
    [AppRoutes.NOTIFICATIONS]: `/${AppRoutes.NOTIFICATIONS}`,
    [AppRoutes.EMAIL]: `/${AppRoutes.EMAIL}`,
    [AppRoutes.CHANGES]: `/${AppRoutes.CHANGES}`,
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.AUTH]: {
        path: `${RoutePath.auth}`,
        element: <AuthPage />,
    },
    [AppRoutes.REGISTRATION]: {
        path: `${RoutePath.registration}`,
        element: <RegistrationPage />,
    },
    [AppRoutes.MAIN]: {
        path: `${RoutePath.main}`,
        element: <MainPage />,
        authOnly: true,
    },
    [AppRoutes.CHATS]: {
        path: `${RoutePath.chats}`,
        element: <ChatsPage />,
        authOnly: true,
    },
    [AppRoutes.TEAMS]: {
        path: `${RoutePath.teams}`,
        element: <TeamsPage />,
        authOnly: true,
    },
    [AppRoutes.CALENDAR]: {
        path: `${RoutePath.calendar}`,
        element: <CalendarPage />,
        authOnly: true,
    },
    [AppRoutes.DOCS]: {
        path: `${RoutePath.docs}`,
        element: <DocsPage />,
        authOnly: true,
    },
    [AppRoutes.NOTIFICATIONS]: {
        path: `${RoutePath.notifications}`,
        element: <NotificationsPage />,
        authOnly: true,
    },
    [AppRoutes.EMAIL]: {
        path: `${RoutePath.email}`,
        element: <EmailPage />,
        authOnly: true,
    },
    [AppRoutes.CHANGES]: {
        path: `${RoutePath.changes}`,
        element: <ChangesPage />,
        authOnly: true,
    },
};
