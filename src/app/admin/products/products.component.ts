import { Dialog } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormProductComponent } from './components/form-product/form-product.component';
import { FilterProduct, Product } from '@/api/interfaces/product.interface';
import { NgClass } from '@angular/common';
import { PaginationComponent } from '@/components/pagination/pagination.component';
import { Pagination } from '@/api/interfaces/pagination.interface';
import { Router, RouterLink } from '@angular/router';
import { FilterComponent } from './components/filter/filter.component';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';
import { UnitsStore } from '@/store/units.store';
import { CategoriesStore } from '@/store/categories.store';
import { BrandsStore } from '@/store/brands.store';
import { ProductsStore } from '@/store/products.store';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    NgClass,
    PaginationComponent,
    RouterLink,
    FilterComponent,
    AdminTitleComponent,
  ],
  templateUrl: './products.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductsComponent {
  readonly productStore = inject(ProductsStore);
  readonly unitStore = inject(UnitsStore);
  readonly categoryStore = inject(CategoriesStore);
  readonly brandStore = inject(BrandsStore);

  #dialog = inject(Dialog);
  pagination = signal<Pagination>({
    page: 1,
    quantityRecordsPerPage: 100,
  });

  changePage() {
    this.productStore.getAll(this.pagination());
  }

  deleteFilter() {
    this.productStore.updatedFilter({
      barCode: null,
      name: null,
      price: null,
      stock: null,
    });
    this.productStore.getAll(this.pagination());
  }

  handleFilterData(filter: FilterProduct) {
    this.productStore.filterProduct(filter);
  }

  openForm(product?: Product) {
    this.#dialog
      .open(FormProductComponent, {
        height: '100%',
        data: {
          product,
          units: this.unitStore.units(),
          categories: this.categoryStore.categories(),
          brands: this.brandStore.brands(),
        },
      })
      .closed.subscribe((resp: any) => {
        if (resp === false) return;
        if (resp.id) {
          this.submitUpdate(resp.form, resp.id);
        } else {
          this.submitCreate(resp);
        }
      });
  }

  submitCreate(dto: FormData) {
    this.productStore.create(dto);
  }

  submitUpdate(dto: FormData, id: number) {
    this.productStore.update(dto, id);
  }

  remove(product: Product) {
    const confirm = window.confirm(
      `Desea eliminar ${product.name.toUpperCase()}`,
    );

    console.log(confirm);
  }
}
