import { Brand, CreateBrandDto } from '@/api/interfaces/brand.interface';
import { BrandService } from '@/api/services/brand.service';
import { AlertService } from '@/core/services/alert.service';
import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { lastValueFrom } from 'rxjs';

type BrandState = {
  brands: Brand[];
  isLoading: boolean;
  filter: { name: string };
};

const initialState: BrandState = {
  brands: [],
  isLoading: false,
  filter: { name: '' },
};

export const BrandsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ brands, filter }) => ({
    totalRecords: computed(() => brands().length),
    filterBrands: computed(() => {
      if (filter().name === '') return brands();
      return brands().filter((brand) =>
        brand.name.toLowerCase().includes(filter().name.toLowerCase()),
      );
    }),
  })),
  withMethods(
    (
      store,
      brandSrv = inject(BrandService),
      alertSrv = inject(AlertService),
    ) => ({
      async getAll(): Promise<void> {
        try {
          patchState(store, { isLoading: true });
          const brands = await lastValueFrom(brandSrv.getAll());
          patchState(store, { brands, isLoading: false });
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      async create(dtoCreate: FormData): Promise<void> {
        try {
          patchState(store, { isLoading: true });
          const brand = await lastValueFrom(brandSrv.create(dtoCreate));
          patchState(store, {
            isLoading: false,
            brands: [brand, ...store.brands()],
          });
          alertSrv.showAlertSuccess('Elemento Creado');
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      async update(dto: FormData, id: number) {
        try {
          patchState(store, { isLoading: true });
          const brandDB = await lastValueFrom(brandSrv.update(dto, id));
          patchState(store, {
            isLoading: false,
            brands: store.brands().map((brand) => {
              if (brand.id === id) {
                brand = brandDB;
              }
              return brand;
            }),
          });
          alertSrv.showAlertSuccess('Elemento Actualizado');
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      updateFilter(filter: { name: string }) {
        patchState(store, { filter });
      },
    }),
  ),
  withHooks({
    async onInit(store) {
      await store.getAll();
    },
  }),
);
