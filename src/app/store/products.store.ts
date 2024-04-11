import { Discount } from '@/api/interfaces/discount.interface';
import { Pagination } from '@/api/interfaces/pagination.interface';
import { FilterProduct, Product } from '@/api/interfaces/product.interface';
import { ProductService } from '@/api/services/product.service';
import { AlertService } from '@/core/services/alert.service';
import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { filter, lastValueFrom } from 'rxjs';

type ProductState = {
  products: Product[];
  isLoading: boolean;
  totalRecords: number;
  pagination: Pagination;
  filter: FilterProduct;
  currentProduct: Product | null;
};

const initialState: ProductState = {
  products: [],
  isLoading: false,
  totalRecords: 0,
  pagination: { page: 1, quantityRecordsPerPage: 50 },
  filter: {
    name: null,
    price: null,
    stock: null,
    barCode: null,
  },
  currentProduct: null,
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      productSrv = inject(ProductService),
      alertSrv = inject(AlertService),
    ) => ({
      //
      async getAll(pagination: Pagination): Promise<void> {
        this.updatePagination(pagination);
        try {
          patchState(store, { isLoading: true });
          const response = await lastValueFrom(
            productSrv.getAll(store.pagination()),
          );
          const products = response.body!;
          const totalRecords = parseInt(
            response.headers.get('totalregistros')!,
            10,
          );
          patchState(store, { products, totalRecords, isLoading: false });
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      //
      async create(dto: FormData): Promise<void> {
        try {
          patchState(store, { isLoading: true });

          const product = await lastValueFrom(productSrv.create(dto));
          patchState(store, (state) => ({
            products: [product, ...state.products],
            totalRecords: state.totalRecords + 1,
            isLoading: false,
          }));
          alertSrv.showAlertSuccess('Elemento Creado');
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      //
      async update(dto: FormData, id: number): Promise<void> {
        try {
          patchState(store, { isLoading: true });
          const productUpdate = await lastValueFrom(productSrv.update(dto, id));
          patchState(store, {
            isLoading: false,
            products: store.products().map((product) => {
              if (product.id === id) {
                product = { ...productUpdate };
              }
              return product;
            }),
          });
          alertSrv.showAlertSuccess('Elemento actualizado');
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      //
      async filterProduct(filterDto: FilterProduct): Promise<void> {
        this.updatedFilter(filterDto);
        try {
          patchState(store, { isLoading: true });
          const productsFilter = await lastValueFrom(
            productSrv.filterData(store.filter()),
          );
          patchState(store, {
            isLoading: false,
            products: productsFilter,
            totalRecords: productsFilter.length,
          });
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      //
      updatedFilter(filterDto: FilterProduct) {
        patchState(store, { filter: filterDto });
      },

      updatePagination(pagination: Pagination) {
        patchState(store, { pagination: pagination });
      },
    }),
  ),

  withHooks({
    async onInit(store) {
      await store.getAll(store.pagination());
    },
  }),
);
