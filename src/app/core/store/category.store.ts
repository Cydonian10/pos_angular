import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/api/interfaces/category.interface';
import { Pagination } from '@/api/interfaces/pagination.interface';
import { CategoriaService } from '@/api/services/categoria.service';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AlertService } from '../services/alert.service';

type CategoryState = {
  categories: Category[];
  isLoading: boolean;
  totalRegistros: number;
};

@Injectable({
  providedIn: 'root',
})
export class CategoryStore {
  #categorySrv = inject(CategoriaService);
  #alertSrv = inject(AlertService);

  #state = signal<CategoryState>({
    categories: [],
    isLoading: false,
    totalRegistros: 0,
  });

  public state = computed(() => this.#state());

  constructor() {
    // effect(() => {
    //   console.log('**** State Categorias *****');
    //   console.log(this.#state());
    // });
    this.getAll({ page: 1, quantityRecordsPerPage: 15 });
  }

  getAll(pagination: Pagination) {
    this.#categorySrv.getAll(pagination).subscribe({
      next: (resp) => {
        const categories: Category[] = resp.body!;
        const totalRegistros = parseInt(
          resp.headers.get('totalregistros')!,
          10,
        );
        this.#state.update((s) => ({ ...s, categories, totalRegistros }));
      },
      error: () => {},
      complete: () => {},
    });
  }

  create(dto: CreateCategoryDto) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#categorySrv.create(dto).subscribe({
      next: (categories: Category) => {
        this.#state.update((s) => ({
          ...s,
          categories: [categories, ...s.categories],
        }));
        this.#alertSrv.showAlertSuccess(
          `El elmento ${categories.name} fue creado`,
        );
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

  update(dto: UpdateCategoryDto, id: number) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#categorySrv.update(dto, id).subscribe({
      next: (category: Category) => {
        this.#state.update((s) => ({
          ...s,
          categories: s.categories.map((c) => {
            if (c.id === category.id) {
              c = category;
            }
            return c;
          }),
        }));
        this.#alertSrv.showAlertSuccess(
          `El elmento ${category.name} actulizado`,
        );
      },
      error: () => {},
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  filterName(name: string) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#categorySrv.filterName(name).subscribe({
      next: (categories: Category[]) => {
        this.#state.update((s) => ({
          ...s,
          categories,
        }));
      },
      error: (error) => {
        console.log(error);
        if (error.error.errors) {
          this.#alertSrv.showAlertError('Error de validacioines 💥');
          return;
        }
        this.#alertSrv.showAlertError('Error 💥');
      },
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }
}
