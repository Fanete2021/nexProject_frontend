import { icons } from '@/shared/ui';
import { OrganizationRoles } from '@/entities/organization/model/types/organizationRoles.ts';

export type TabProps = {
  title: string;
  icon: icons;
  access?: OrganizationRoles[];
}

export enum Tabs {
  PANEL_KANBAN = 'PANEL_KANBAN',
  TASKS = 'TASKS'
}

export const tabs: Record<Tabs, TabProps> = {
  [Tabs.PANEL_KANBAN]: {
    icon: icons.KANBAN_BOARD,
    title: 'Панель Kanban',
  },
  [Tabs.TASKS]: {
    title: 'Задачи',
    icon: icons.TASKS,
  }
};
