import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/pages/login-page/login-page').then((route) => route.LoginPage),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/pages/dashboard-page').then((route) => route.DashboardPage),
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
