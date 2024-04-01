import { Routes } from '@angular/router';
import { AdminLayout } from './layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayout,
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
    ],
  },
  {
    path: '**',
    redirectTo: 'admin/categories',
  },
];
