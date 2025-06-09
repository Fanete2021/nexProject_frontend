import { PathRouteProps } from 'react-router-dom';
import { MainPage } from '@/pages/main-page';
import { AuthPage } from '@/pages/auth-page';
import { ChatsPage } from '@/pages/chats-page';
import { OrganizationPage } from '@/pages/organization-page';
import { CalendarPage } from '@/pages/calendar-page';
import { NotificationsPage } from '@/pages/notifications-page';
import { EmailPage } from '@/pages/email-page';
import { ChangesPage } from '@/pages/changes-page';
import { DocsPage } from '@/pages/docs-page';
import { RegistrationPage } from '@/pages/registration-page';
import { EmailConfirmPage } from '@/pages/email-confirm-page';
import { NewPasswordPage } from '@/pages/new-password-page';
import { NewPasswordRequestPage } from '@/pages/new-password-request-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { AboutDevelopersPage } from '@/pages/about-developers-page';
import { TestApiPage } from '@/pages/test-api-page';
import { TasksPage } from '@/pages/tasks-page';
import { TeamMemberStatsPage } from '@/pages/team-member-stats-page';

export type AppRoutesProps = PathRouteProps & {
    authOnly?: boolean;
};

export enum AppRoutes {
  AUTH = 'auth',
  REGISTRATION = 'registration',
  EMAIL_CONFIRM = 'emailConfirm',
  MAIN = 'main',
  CHATS = 'chats',
  ORGANIZATION = 'organization',
  ORGANIZATION_DETAILS = 'organizationDetails',
  ORGANIZATION_TAB = 'organizationSettings',
  CALENDAR = 'calendar',
  DOCS  = 'docs',
  NOTIFICATIONS  = 'notifications',
  EMAIL  = 'email',
  CHANGES  = 'changes',
  NEW_PASSWORD_REQUEST = 'newPasswordRequest',
  NEW_PASSWORD = 'newPassword',
  ABOUT_DEVELOPERS = 'aboutDevelopers',
  TASKS = 'tasks',
  TEAM_MEMBER_STATS = 'teamMemberStats',

  NOT_FOUND = 'notFound',
  TEST_API = 'testApi',
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.AUTH]: '/auth',
  [AppRoutes.REGISTRATION]: `/${AppRoutes.REGISTRATION}`,
  [AppRoutes.EMAIL_CONFIRM]: `/${AppRoutes.EMAIL_CONFIRM}`,
  [AppRoutes.NEW_PASSWORD_REQUEST]: '/newPassword',
  [AppRoutes.NEW_PASSWORD]: `/${AppRoutes.NEW_PASSWORD}/:token`,
  [AppRoutes.MAIN]: '/',
  [AppRoutes.CHATS]: `/${AppRoutes.CHATS}`,
  [AppRoutes.ORGANIZATION]: `/${AppRoutes.ORGANIZATION}`,
  [AppRoutes.ORGANIZATION_TAB]: `/${AppRoutes.ORGANIZATION}/:orgId/:tab`,
  [AppRoutes.ORGANIZATION_DETAILS]: `/${AppRoutes.ORGANIZATION}/:orgId`,
  [AppRoutes.CALENDAR]: `/${AppRoutes.CALENDAR}`,
  [AppRoutes.DOCS]: `/${AppRoutes.DOCS}`,
  [AppRoutes.NOTIFICATIONS]: `/${AppRoutes.NOTIFICATIONS}`,
  [AppRoutes.EMAIL]: `/${AppRoutes.EMAIL}`,
  [AppRoutes.CHANGES]: `/${AppRoutes.CHANGES}`,
  [AppRoutes.ABOUT_DEVELOPERS]: `/${AppRoutes.ABOUT_DEVELOPERS}`,
  [AppRoutes.TASKS]: `/${AppRoutes.TASKS}`,
  [AppRoutes.TEAM_MEMBER_STATS]: `/${AppRoutes.TEAM_MEMBER_STATS}/:teamId/:userId`,


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
  [AppRoutes.NEW_PASSWORD_REQUEST]: {
    path: `${RoutePath.newPasswordRequest}`,
    element: <NewPasswordRequestPage />,
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
  [AppRoutes.ORGANIZATION]: {
    path: `${RoutePath.organization}`,
    element: <OrganizationPage />,
    authOnly: true,
  },
  [AppRoutes.ORGANIZATION_DETAILS]: {
    path: `${RoutePath.organizationDetails}`,
    element: <OrganizationPage />,
    authOnly: true,
  },
  [AppRoutes.ORGANIZATION_TAB]: {
    path: `${RoutePath.organizationSettings}`,
    element: <OrganizationPage />,
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
  [AppRoutes.TASKS]: {
    path: `${RoutePath.tasks}`,
    element: <TasksPage />,
    authOnly: true,
  },
  [AppRoutes.ABOUT_DEVELOPERS]: {
    path: `${RoutePath.aboutDevelopers}`,
    element: <AboutDevelopersPage />,
  },
  [AppRoutes.TEAM_MEMBER_STATS]: {
    path: `${RoutePath.teamMemberStats}`,
    element: <TeamMemberStatsPage />,
    authOnly: true
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
