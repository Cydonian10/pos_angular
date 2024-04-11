import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/api/interfaces/category.interface';
import { Pagination } from '@/api/interfaces/pagination.interface';
import { CategoriaService } from '@/api/services/categoria.service';
import { AlertService } from '@/core/services/alert.service';
import { effect, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { lastValueFrom } from 'rxjs';

type CategoryState = {
  categories: Category[];
  isLoading: boolean;
  totalRecords: number;
  pagination: Pagination;
  filter: { name: string };
};

const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  totalRecords: 0,
  pagination: { page: 1, quantityRecordsPerPage: 100 },
  filter: { name: '' },
};

export const CategoriesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      cateogrySrv = inject(CategoriaService),
      alertSrv = inject(AlertService),
    ) => ({
      //
      async getAll(): Promise<void> {
        try {
          patchState(store, { isLoading: true });
          const response = await lastValueFrom(
            cateogrySrv.getAll(store.pagination()),
          );
          const categories = response.body!;
          const totalRecords = parseInt(
            response.headers.get('totalregistros')!,
            10,
          );
          patchState(store, { categories, totalRecords, isLoading: false });
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      //
      async create(dto: CreateCategoryDto): Promise<void> {
        try {
          patchState(store, { isLoading: true });

          const category = await lastValueFrom(cateogrySrv.create(dto));
          patchState(store, (state) => ({
            categories: [category, ...state.categories],
            totalRecords: state.totalRecords + 1,
            isLoading: false,
          }));
          alertSrv.showAlertSuccess('Elemento Creado');
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      //
      async update(dto: UpdateCategoryDto, id: number): Promise<void> {
        try {
          patchState(store, { isLoading: true });
          const categoryUpdate = await lastValueFrom(
            cateogrySrv.update(dto, id),
          );
          patchState(store, {
            isLoading: false,
            categories: store.categories().map((category) => {
              if (category.id === id) {
                category = categoryUpdate;
              }
              return category;
            }),
          });
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      //
      async delete(dto: Category): Promise<void> {
        try {
          patchState(store, { isLoading: true });

          const idDelete = await lastValueFrom(cateogrySrv.delete(dto.id));
          patchState(store, (state) => ({
            categories: store
              .categories()
              .filter((cat) => cat.id !== idDelete.id),
            totalRecords: state.totalRecords - 1,
            isLoading: false,
          }));
          alertSrv.showAlertSuccess(
            `Categoria ${dto.name.toUpperCase()} eliminado`,
          );
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      //
      async filterName(filterDto: { name: string }) {
        try {
          this.updateFilter(filterDto);
          patchState(store, { isLoading: true });

          const categories = await lastValueFrom(
            cateogrySrv.filterName(filterDto.name),
          );
          patchState(store, { categories, isLoading: false });
          alertSrv.showAlertSuccess('Filtro puesto');
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      updatePagination(pagination: Pagination) {
        patchState(store, { pagination });
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
