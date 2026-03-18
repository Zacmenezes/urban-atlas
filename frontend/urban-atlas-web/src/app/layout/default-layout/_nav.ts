import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'MENU.DASHBOARD',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' }
  },
  {
    name: 'MENU.MAP',
    url: '/map',
    iconComponent: { name: 'cil-map' }
  },
  {
    name: 'MENU.LICENSES',
    url: '/licenses',
    iconComponent: { name: 'cil-description' }
  }
];
