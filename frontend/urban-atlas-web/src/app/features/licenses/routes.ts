import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Licenses'
    },
    loadComponent: () => import('./licenses.component').then((m) => m.LicensesComponent)
  }
];

