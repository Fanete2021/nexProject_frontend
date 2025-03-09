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

export type AppRoutesProps = PathRouteProps & {
};

export enum AppRoutes {
  AUTH = 'auth',
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
    [AppRoutes.AUTH]: '/',
    [AppRoutes.MAIN]: `/${AppRoutes.MAIN}`,
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
    [AppRoutes.MAIN]: {
        path: `${RoutePath.main}`,
        element: <MainPage />,
    },
    [AppRoutes.CHATS]: {
        path: `${RoutePath.chats}`,
        element: <ChatsPage />,
    },
    [AppRoutes.TEAMS]: {
        path: `${RoutePath.teams}`,
        element: <TeamsPage />,
    },
    [AppRoutes.CALENDAR]: {
        path: `${RoutePath.calendar}`,
        element: <CalendarPage />,
    },
    [AppRoutes.DOCS]: {
        path: `${RoutePath.docs}`,
        element: <DocsPage />,
    },
    [AppRoutes.NOTIFICATIONS]: {
        path: `${RoutePath.notifications}`,
        element: <NotificationsPage />,
    },
    [AppRoutes.EMAIL]: {
        path: `${RoutePath.email}`,
        element: <EmailPage />,
    },
    [AppRoutes.CHANGES]: {
        path: `${RoutePath.changes}`,
        element: <ChangesPage />,
    },
};
