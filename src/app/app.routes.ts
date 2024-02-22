import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'facts',
    loadComponent: () =>
      import('./facts/facts.component').then((m) => m.FactsComponent),
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
