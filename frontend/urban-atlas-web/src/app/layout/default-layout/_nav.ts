import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' }
  },
  {
    name: 'Map',
    url: '/map',
    iconComponent: { name: 'cil-map' }
  },
  {
    name: 'Licenses',
    url: '/licenses',
    iconComponent: { name: 'cil-description' }
  }
];
