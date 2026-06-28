import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { LayoutComponent } from './shared/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) },
      { path: 'sessions',  loadComponent: () => import('./pages/sessions/sessions.component').then(m => m.SessionsComponent) },
      { path: 'reports',   loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent) },
      { path: 'settings',  loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) },
      {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview',  loadComponent: () => import('./pages/admin/overview/overview').then(m => m.AdminOverviewComponent) },
          { path: 'users',     loadComponent: () => import('./pages/admin/users/users').then(m => m.AdminUsersComponent) },
          { path: 'reports',   loadComponent: () => import('./pages/admin/reports/admin-reports').then(m => m.AdminReportsComponent) },
          { path: 'activity',  loadComponent: () => import('./pages/admin/activity/activity').then(m => m.AdminActivityComponent) },
          { path: 'analytics', loadComponent: () => import('./pages/admin/analytics/analytics').then(m => m.AdminAnalyticsComponent) },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];
