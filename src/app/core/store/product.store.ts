import { FilterProduct, Product } from '@/api/interfaces/product.interface';
import { ProductService } from '@/api/services/product.service';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { Pagination } from '@/api/interfaces/pagination.interface';
import {
  CreateDiscountDto,
  Discount,
} from '@/api/interfaces/discount.interface';

type ProductState = {
  products: Product[];
  isLoading: boolean;
  totalRegistros: number;
  currentProduct: Product | null;
  discounts: Discount[];
};

@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  #productSrv = inject(ProductService);
  #alertSrv = inject(AlertService);

  #state = signal<ProductState>({
    products: [],
    isLoading: false,
    totalRegistros: 0,
    currentProduct: null,
    discounts: [],
  });

  public state = computed(() => this.#state());

  constructor() {
    // effect(() => {
    //   console.log('**** State Products *****');
    //   console.log(this.#state());
    // });
    this.getAll({ page: 1, quantityRecordsPerPage: 15 });
  }

  setCurrectProduct(product: Product) {
    this.#state.update((s) => ({ ...s, currentProduct: product }));
  }

  getAll(pagination: Pagination) {
    this.#state.update((s) => ({ ...s, isLoading: true }));
    this.#productSrv.getAll(pagination).subscribe({
      next: (resp) => {
        const products: Product[] = resp.body!;
        const totalRegistros = parseInt(
          resp.headers.get('totalregistros')!,
          10,
        );
        this.#state.update((s) => ({ ...s, products, totalRegistros }));
      },
      error: () => {},
      complete: () => this.#state.update((s) => ({ ...s, isLoading: true })),
    });
  }

  create(dto: FormData) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#productSrv.create(dto).subscribe({
      next: (product: Product) => {
        this.#state.update((s) => ({
          ...s,
          products: [product, ...s.products],
        }));
        this.#alertSrv.showAlertSuccess(`El elmento ${product.name} creado`);
      },
      error: (error) => {
        if (error.error.errors) {
          this.#alertSrv.showAlertError('Error de validacioines 💥');
        }
        this.#alertSrv.showAlertError('Error 💥');
      },
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  update(dto: FormData, id: number) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#productSrv.update(dto, id).subscribe({
      next: (product: Product) => {
        this.#state.update((s) => ({
          ...s,
          products: s.products.map((pro) => {
            if (pro.id === product.id) {
              pro = product;
            }
            return pro;
          }),
        }));
        this.#alertSrv.showAlertSuccess(
          `El elmento ${product.name} actulizado`,
        );
      },
      error: () => {},
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  addDiscount(discount: CreateDiscountDto, id: number) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#productSrv.addDiscount([discount], id).subscribe({
      next: () => {
        this.#state.update((s) => ({
          ...s,
          discounts: [{ id: 0, ...discount }, ...s.discounts],
        }));
      },
      error: () => {
        this.#alertSrv.showAlertError('Error 💥');
      },
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  removeDiscount(discount: Discount) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#productSrv.removeDiscount(discount.id).subscribe({
      next: () => {
        this.#state.update((s) => ({
          ...s,
          discounts: s.discounts.filter((di) => di.id !== discount.id),
        }));
      },
      error: () => {
        this.#alertSrv.showAlertError('Error 💥');
      },
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  getDiscounts(productId: number) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#productSrv.getDiscounts(productId).subscribe({
      next: (discounts: Discount[]) => {
        console.log(discounts);
        this.#state.update((s) => ({ ...s, discounts }));
      },
      error: () => {},
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  filterProduct(filter: FilterProduct) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#productSrv.filterData(filter).subscribe({
      next: (products: Product[]) => {
        this.#state.update((s) => ({
          ...s,
          products,
          totalRegistros: products.length,
        }));
        this.#alertSrv.showAlertSuccess(`Se aplico el filtro`);
      },
      error: () => this.#alertSrv.showAlertError('Error 💥'),
      complete: () => this.#state.update((s) => ({ ...s, isLoading: false })),
    });
  }

  deleteFilter(pagination: Pagination) {
    this.#state.update((s) => ({ ...s, isLoading: true }));
    this.#productSrv.getAll(pagination).subscribe({
      next: (resp) => {
        const products: Product[] = resp.body!;
        const totalRegistros = parseInt(
          resp.headers.get('totalregistros')!,
          10,
        );
        this.#state.update((s) => ({ ...s, products, totalRegistros }));
        this.#alertSrv.showAlertSuccess('Se quitaron los filtros');
      },
      error: () => {},
      complete: () => this.#state.update((s) => ({ ...s, isLoading: true })),
    });
  }
}
