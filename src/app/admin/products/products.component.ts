import { ProductStore } from '@/core/store/product.store';
import { Dialog } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormProductComponent } from './components/form-product/form-product.component';
import {
  CreateProductDto,
  FilterProduct,
  Product,
  UpdateProductDto,
} from '@/api/interfaces/product.interface';
import { NgClass } from '@angular/common';
import { PaginationComponent } from '@/components/pagination/pagination.component';
import { Pagination } from '@/api/interfaces/pagination.interface';
import { BrandStore } from '@/core/store/brand.store.';
import { CategoryStore } from '@/core/store/category.store';
import { UnitStore } from '@/core/store/unit.store';
import { Router, RouterLink } from '@angular/router';
import { FilterComponent } from './components/filter/filter.component';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';

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
  #productStore = inject(ProductStore);
  #unitStore = inject(UnitStore);
  #categoryStore = inject(CategoryStore);
  #brandStore = inject(BrandStore);
  #router = inject(Router);

  #dialog = inject(Dialog);
  pagination = signal<Pagination>({
    page: 1,
    quantityRecordsPerPage: 15,
  });
  productState = this.#productStore.state;

  changePage() {
    this.#productStore.getAll(this.pagination());
  }

  deleteFilter() {
    this.#productStore.deleteFilter(this.pagination());
  }

  ngOnInit() {}

  handleFilterData(filter: FilterProduct) {
    this.#productStore.filterProduct(filter);
  }

  openForm(product?: Product) {
    this.#dialog
      .open(FormProductComponent, {
        height: '100%',
        data: {
          product,
          units: this.#unitStore.state().units,
          categories: this.#categoryStore.state().categories,
          brands: this.#brandStore.state().brands,
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
    this.#productStore.create(dto);
  }

  submitUpdate(dto: FormData, id: number) {
    this.#productStore.update(dto, id);
  }

  remove(product: Product) {
    const confirm = window.confirm(
      `Desea eliminar ${product.name.toUpperCase()}`,
    );

    console.log(confirm);
  }

  detalle(product: Product) {
    this.#productStore.setCurrectProduct(product);
    this.#router.navigateByUrl(`/admin/products/detail/${product.id}`);
  }
}
