import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Dashboard'
    },
    loadComponent: () => import('./dashboard.component').then((m) => m.DashboardComponent)
  }
];

