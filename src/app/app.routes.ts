import { Routes } from '@angular/router';
import { AdminLayout } from './layouts/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { redirectGuard } from './core/guards/redirect.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('@/admin/dashboard/dashboard.component'),
      },
      {
        path: 'profile',
        loadComponent: () => import('@/admin/profile/profile.component'),
      },
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

      // ventas
      {
        path: 'cajas',
        loadComponent: () =>
          import('@/admin/cash-register/cash-register.component'),
      },
      {
        path: 'cajas/:id',
        loadComponent: () =>
          import(
            '@/admin/cash-register/detail-cash-register/detail-cash-register.component'
          ),
      },
      {
        path: 'sales',
        children: [
          {
            path: '',
            loadComponent: () => import('@/admin/sales/sales.component'),
          },
          {
            path: 'report',
            loadComponent: () =>
              import('@/admin/sales-report/sales-report.component'),
          },
        ],
      },
      {
        path: 'suppliers',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('@/admin/suppliers/suppliers.component'),
          },
          {
            path: 'purchases',
            loadComponent: () =>
              import('@/admin/purchases/purchases.component'),
          },
          {
            path: 'report',
            loadComponent: () =>
              import('@/admin/purchases-report/purchases-report.component'),
          },
        ],
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
