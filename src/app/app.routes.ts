import { Routes } from '@angular/router';
import { AdminLayout } from './layouts/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { redirectGuard } from './core/guards/redirect.guard';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'units',
        loadComponent: () => import('@/admin/units/units.component'),
      },
      {
        path: 'categories',
        loadComponent: () => import('@/admin/categories/categories.component'),
      },
      {
        path: 'brands',
        loadComponent: () => import('@/admin/brands/brands.component'),
      },
      {
        path: 'products',
        loadComponent: () => import('@/admin/products/products.component'),
      },
      {
        path: 'products/detail/:id',
        loadComponent: () =>
          import('@/admin/products/product-detail/product-detail.component'),
      },

      // Users
      {
        path: 'customers',
        loadComponent: () => import('@/admin/customers/customers.component'),
      },
      {
        path: 'users',
        loadComponent: () => import('@/admin/users/users.component'),
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import('@/admin/users/detail-user/detail-user.component'),
      },
    ],
  },

  {
    path: 'auth',
    canActivate: [redirectGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('@/auth/login/login.component'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'admin/categories',
  },
];
