import { Pagination } from '@/api/interfaces/pagination.interface';
import { PaginationComponent } from '@/components/pagination/pagination.component';
import { CategoryStore } from '@/core/store/category.store';
import { Dialog } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBrandComponent } from './components/form-brand/form-brand.component';
import { Brand } from '@/api/interfaces/brand.interface';
import { BrandStore } from '@/core/store/brand.store.';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    PaginationComponent,
    AdminTitleComponent,
  ],
  templateUrl: './brands.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BrandsComponent {
  #brandStore = inject(BrandStore);
  #dialog = inject(Dialog);

  public brandState = this.#brandStore.state;

  pagination = signal<Pagination>({
    page: 1,
    quantityRecordsPerPage: 15,
  });

  changePage() {
    this.#brandStore.getAll(this.pagination());
  }

  openForm(brand?: Brand) {
    this.#dialog
      .open(FormBrandComponent, {
        height: '100%',
        data: brand,
      })
      .closed.subscribe((resp: any) => {
        if (resp === false) {
          return;
        }

        if (resp.id) {
          console.log(resp);
        }

        resp.id ? this.submitUpdate(resp) : this.submitCreate(resp);
      });
  }

  submitCreate(dto: FormData) {
    this.#brandStore.create(dto);
  }

  submitUpdate(dto: { formData: FormData; id: number }) {
    this.#brandStore.update(dto.formData, dto.id);
  }

  remove(brand: Brand) {
    const confirm = window.confirm(`Desea eliminar ${brand.name}`);

    console.log(confirm);
  }
}
