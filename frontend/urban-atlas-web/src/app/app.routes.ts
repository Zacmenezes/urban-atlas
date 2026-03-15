import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./core/layout').then(m => m.DefaultLayoutComponent),
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'map',
        loadChildren: () => import('./features/map/routes').then((m) => m.routes)
      },
      {
        path: 'licenses',
        loadChildren: () => import('./features/licenses/routes').then((m) => m.routes)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
