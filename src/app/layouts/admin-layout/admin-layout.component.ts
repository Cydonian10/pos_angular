import { AlertComponent } from '@/components/alert/alert.component';
import { AlertService } from '@/core/services/alert.service';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, RouterModule, AlertComponent],
  templateUrl: './admin-layout.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayout {
  public config = inject(AlertService).config;

  isDark = new FormControl(false, {
    nonNullable: true,
  });

  theme = signal('mydark');
  image =
    'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/3/3b/Spider-Man_No_Way_Home_-_Hombre_Ara%C3%B1a_Nuevo_Traje.png/revision/latest?cb=20220727163617&path-prefix=es';

  links = [
    { path: '/admin/units', name: 'Unidades' },
    { path: '/admin/categories', name: 'Categories' },
    { path: '/admin/brands', name: 'Marcas' },
    { path: '/admin/products', name: 'Products' },
  ];

  linkUsers = [
    { path: '/admin/customers', name: 'Clientes' },
    { path: '/admin/users', name: 'Empleados' },
  ];

  linkVentas = [
    { path: '/admin/cajas', name: 'Cajas Registradoras' },
    { path: '/admin/sales', name: 'Punto de venta' },
    { path: '/admin/sales/report', name: 'Reportes' },
  ];

  proveedors = [
    { path: '/admin/suppliers', name: 'Proveedores' },
    { path: '/admin/suppliers/purchases', name: 'Compras' },
    { path: '/admin/suppliers/report', name: 'Reporte' },
  ];

  constructor() {
    const theme = localStorage.getItem('theme');

    if (theme == 'mydark') {
      this.isDark.setValue(true);
      this.theme.set('mydark');
    } else {
      this.theme.set('cupcake');
    }

    effect(() => {
      localStorage.setItem('theme', this.theme());
    });

    this.isDark.valueChanges.subscribe((value) => {
      if (value) {
        this.theme.set('mydark');
        document.documentElement.setAttribute('data-theme', this.theme());
      } else {
        this.theme.set('cupcake');
        document.documentElement.setAttribute('data-theme', this.theme());
      }
    });
  }
}
