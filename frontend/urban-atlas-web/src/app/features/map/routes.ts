import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Map'
    },
    loadComponent: () => import('./map.component').then((m) => m.MapComponent)
  }
];

