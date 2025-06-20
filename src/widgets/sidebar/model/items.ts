import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { icons } from '@/shared/ui';

export interface SidebarItemType {
  path: string;
  text: string;
  icon: icons;
  applyIconStroke?: boolean;
  applyIconFill?: boolean;
}

export const SidebarItemsList: SidebarItemType[] = [
  {
    path: RoutePath.main,
    icon: icons.MAIN,
    text: 'Главная',
    applyIconFill: true,
  },
  {
    path: RoutePath.chats,
    icon: icons.CHATS,
    text: 'Чаты',
    applyIconFill: true,
  },
  {
    path: RoutePath.organization,
    icon: icons.ORGANIZATION,
    text: 'Организация',
    applyIconFill: true,
  },
  {
    path: RoutePath.tasks,
    icon: icons.TASK_BOARD,
    text: 'Задачи',
    applyIconFill: true
  }
  // {
  //   path: RoutePath.calendar,
  //   icon: icons.CALENDAR,
  //   text: 'Календарь',
  //   applyIconStroke: true
  // },
  // {
  //   path: RoutePath.docs,
  //   icon: icons.DOCS,
  //   text: 'Документы',
  //   applyIconFill: true,
  // },
  // {
  //   path: RoutePath.notifications,
  //   icon: icons.NOTIFICATIONS,
  //   text: 'Уведомления',
  //   applyIconFill: true,
  // },
  // {
  //   path: RoutePath.email,
  //   icon: icons.EMAIL,
  //   text: 'Почта',
  //   applyIconFill: true,
  // },
];
