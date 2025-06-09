import { Role } from '../types/role.ts';
import { icons } from '@/shared/ui';

export const Roles: Role[] = [
  {
    name: 'ROLE_ADMIN',
    icon: icons.ADMIN
  },
  {
    name: 'ROLE_EDITOR',
    icon: icons.EDITOR
  },
  {
    name: 'ROLE_VIEWER',
    icon: icons.VIEWER
  },
];
