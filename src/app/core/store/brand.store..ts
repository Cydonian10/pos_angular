import { Brand } from '@/api/interfaces/brand.interface';
import { Pagination } from '@/api/interfaces/pagination.interface';
import { BrandService } from '@/api/services/brand.service';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AlertService } from '../services/alert.service';

type BrandState = {
  brands: Brand[];
  isLoading: boolean;
  totalRegistros: number;
};

@Injectable({
  providedIn: 'root',
})
export class BrandStore {
  #brandSrv = inject(BrandService);
  #alertSrv = inject(AlertService);

  #state = signal<BrandState>({
    brands: [],
    isLoading: false,
    totalRegistros: 0,
  });
  state = computed(() => this.#state());

  constructor() {
    // effect(() => {
    //   console.log('**** State Brands *****');
    //   console.log(this.#state());
    // });
    this.getAll({ page: 1, quantityRecordsPerPage: 15 });
  }

  getAll(pagination: Pagination) {
    this.#brandSrv.getAll(pagination).subscribe({
      next: (resp) => {
        const brands: Brand[] = resp.body!;
        const totalRegistros = parseInt(
          resp.headers.get('totalregistros')!,
          10,
        );
        this.#state.update((s) => ({ ...s, brands, totalRegistros }));
      },
      error: () => {},
      complete: () => {},
    });
  }

  create(dto: FormData) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#brandSrv.create(dto).subscribe({
      next: (brand: Brand) => {
        this.#state.update((s) => ({ ...s, brands: [brand, ...s.brands] }));
        this.#alertSrv.showAlertSuccess(`El elmento ${brand.name} creado`);
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

    this.#brandSrv.update(dto, id).subscribe({
      next: (brand: Brand) => {
        this.#state.update((s) => ({
          ...s,
          brands: s.brands.map((b) => {
            if (b.id === brand.id) {
              b = brand;
            }
            return b;
          }),
        }));
        this.#alertSrv.showAlertSuccess(`El elmento ${brand.name} actulizado`);
      },
      error: () => {},
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }
}
