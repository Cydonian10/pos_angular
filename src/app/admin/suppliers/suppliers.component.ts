import { Supplier } from '@/api/interfaces/supplier.interface';
import { PageAdmin } from '@/core/interfaces/page.interface';
import { Dialog } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormSupplierComponent } from './components/form-supplier/form-supplier.component';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';
import { NgClass } from '@angular/common';
import { SupplierService } from '@/api/services/suppliers.service';
import { AlertService } from '@/core/services/alert.service';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [AdminTitleComponent, NgClass],
  templateUrl: './suppliers.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SuppliersComponent implements PageAdmin<Supplier> {
  #supplierSrv = inject(SupplierService);
  #alertSrv = inject(AlertService);
  dialog: Dialog = inject(Dialog);

  suppliers = signal<Supplier[]>([]);
  loading = signal<boolean>(false);

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.loading.set(true);
    this.#supplierSrv.getAll().subscribe({
      next: (suppliers: Supplier[]) => this.suppliers.set(suppliers),
      error: (err) => {
        console.log('[Error component] 😡 error 💥💥', err);
        this.#alertSrv.showAlertError('error');
      },
      complete: () => this.loading.set(false),
    });
  }

  openForm(value?: Supplier): void {
    this.dialog
      .open(FormSupplierComponent, {
        height: '100%',
        data: value,
      })
      .closed.subscribe((resp: any) => {
        if (!resp) return;
        if (resp.id) {
          this.submitUpdateForm(resp);
        } else {
          this.submitForm(resp);
        }
      });
  }
  submitForm(value: any): void {
    this.#supplierSrv.create(value).subscribe({
      next: (supplier: Supplier) => {
        this.suppliers.update((v) => [supplier, ...v]);
        this.#alertSrv.showAlertSuccess(`EL proveedor ${supplier.name} creado`);
      },
      error: (err) => {
        console.log('[Error supplier] 😡 error 💥💥', err);
        this.#alertSrv.showAlertError('error');
      },
    });
  }
  submitUpdateForm(value: any): void {
    const { id, ...rest } = value;
    this.#supplierSrv.update(rest, id).subscribe({
      next: (supplier: Supplier) => {
        this.suppliers.update((v) =>
          v.map((su: Supplier) => {
            if (su.id === supplier.id) {
              su = supplier;
            }
            return su;
          }),
        );
        this.#alertSrv.showAlertSuccess(
          `EL proveedor ${supplier.name} actualizado`,
        );
      },
      error: (err) => {
        console.log('[Error supplier] 😡 error 💥💥', err);
        this.#alertSrv.showAlertError('error');
      },
    });
  }
  remove(value: Supplier): void {
    throw new Error('Method not implemented.');
  }
}
