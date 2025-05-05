import { icons } from '@/shared/ui';
import { OrganizationRoles } from '@/entities/organization/model/types/organizationRoles.ts';

export type TabProps = {
  title: string;
  icon: icons;
  access?: OrganizationRoles[];
}

export enum Tabs {
  MEMBERS = 'MEMBERS',
  TEAMS = 'TEAMS',
  SETTINGS = 'SETTINGS',
}

export const tabs: Record<Tabs, TabProps> = {
  [Tabs.MEMBERS]: {
    icon: icons.MEMBER,
    title: 'Участники',
  },
  [Tabs.TEAMS]: {
    title: 'Команды',
    icon: icons.TEAM,
  },
  [Tabs.SETTINGS]: {
    title: 'Настройки',
    icon: icons.SETTINGS,
    access: [OrganizationRoles.ADMIN, OrganizationRoles.OWNER]
  }
};
