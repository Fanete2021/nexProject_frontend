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
import { EmailConfirmPage } from '@/pages/email-confirm-page';
import { NewPasswordPage } from '@/pages/new-password-page';
import { PasswordChangePage } from '@/pages/password-change-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { AboutDevelopersPage } from '@/pages/about-developers-page';
import { TestApiPage } from '@/pages/test-api-page';

export type AppRoutesProps = PathRouteProps & {
    authOnly?: boolean;
};

export enum AppRoutes {
  AUTH = 'auth',
  REGISTRATION = 'registration',
  EMAIL_CONFIRM = 'emailConfirm',
  MAIN = 'main',
  CHATS = 'chats',
  TEAMS = 'teams',
  CALENDAR = 'calendar',
  DOCS  = 'docs',
  NOTIFICATIONS  = 'notifications',
  EMAIL  = 'email',
  CHANGES  = 'changes',
  NEW_PASSWORD = 'newPassword',
  PASSWORD_CHANGE = 'passwordChange',
  ABOUT_DEVELOPERS = 'aboutDevelopers',
  NOT_FOUND = 'notFound',
  TEST_API = 'testApi'
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.AUTH]: '/auth',
    [AppRoutes.REGISTRATION]: `/${AppRoutes.REGISTRATION}`,
    [AppRoutes.EMAIL_CONFIRM]: `/${AppRoutes.EMAIL_CONFIRM}`,
    [AppRoutes.NEW_PASSWORD]: `/${AppRoutes.NEW_PASSWORD}`,
    [AppRoutes.PASSWORD_CHANGE]: `/${AppRoutes.NEW_PASSWORD}/:token`,
    [AppRoutes.MAIN]: '/',
    [AppRoutes.CHATS]: `/${AppRoutes.CHATS}`,
    [AppRoutes.TEAMS]: `/${AppRoutes.TEAMS}`,
    [AppRoutes.CALENDAR]: `/${AppRoutes.CALENDAR}`,
    [AppRoutes.DOCS]: `/${AppRoutes.DOCS}`,
    [AppRoutes.NOTIFICATIONS]: `/${AppRoutes.NOTIFICATIONS}`,
    [AppRoutes.EMAIL]: `/${AppRoutes.EMAIL}`,
    [AppRoutes.CHANGES]: `/${AppRoutes.CHANGES}`,
    [AppRoutes.ABOUT_DEVELOPERS]: `/${AppRoutes.ABOUT_DEVELOPERS}`,
    [AppRoutes.TEST_API]: `/${AppRoutes.TEST_API}`,
    [AppRoutes.NOT_FOUND]: '*'
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
    [AppRoutes.EMAIL_CONFIRM]: {
        path: `${RoutePath.emailConfirm}`,
        element: <EmailConfirmPage />,
    },
    [AppRoutes.NEW_PASSWORD]: {
        path: `${RoutePath.newPassword}`,
        element: <NewPasswordPage />,
    },
    [AppRoutes.PASSWORD_CHANGE]: {
        path: `${RoutePath.passwordChange}`,
        element: <PasswordChangePage />,
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
    [AppRoutes.ABOUT_DEVELOPERS]: {
        path: `${RoutePath.aboutDevelopers}`,
        element: <AboutDevelopersPage />,
    },
    [AppRoutes.TEST_API]: {
        path: `${RoutePath.testApi}`,
        element: <TestApiPage />,
        authOnly: true
    },
    [AppRoutes.NOT_FOUND]: {
        path: `${RoutePath.notFound}`,
        element: <NotFoundPage />,
    },
};
