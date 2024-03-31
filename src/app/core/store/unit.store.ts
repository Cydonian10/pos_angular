import { CreateUnitDto, Unit } from '@/api/interfaces/unit.interface';
import { UnitService } from '@/api/services/unit.service';
import { Injectable, computed, inject, signal } from '@angular/core';
import { AlertService } from '../services/alert.service';

type UnitState = {
  units: Unit[];
  isLoading: boolean;
  currentUnit: Unit | undefined;
};

@Injectable({
  providedIn: 'root',
})
export class UnitStore {
  #unitSrv = inject(UnitService);
  #alertSrv = inject(AlertService);

  #state = signal<UnitState>({
    units: [],
    isLoading: false,
    currentUnit: undefined,
  });
  public state = computed(() => this.#state());

  constructor() {
    this.getAll();
  }

  setCurrentUnit(unit: Unit | undefined) {
    this.#state.update((s) => ({ ...s, currentUnit: unit }));
  }

  getAll() {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#unitSrv.getUnits().subscribe({
      next: (units: Unit[]) => {
        this.#state.update((s) => ({ ...s, units }));
      },
      error: () => {
        this.#alertSrv.showAlertError('Error');
      },
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  create(dto: CreateUnitDto) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#unitSrv.create(dto).subscribe({
      next: (unit: Unit) => {
        this.#state.update((s) => ({ ...s, units: [unit, ...s.units] }));
        this.#alertSrv.showAlertSuccess(`El elmento ${unit.name} creado`);
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

  update(dto: CreateUnitDto, id: number) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#unitSrv.update(dto, id).subscribe({
      next: (unit: Unit) => {
        this.#state.update((s) => ({
          ...s,
          units: s.units.map((u) => {
            if (u.id === unit.id) {
              u = unit;
            }
            return u;
          }),
        }));
        this.#alertSrv.showAlertSuccess(`El elmento ${unit.name} actulizado`);
      },
      error: () => {},
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  remove(unit: Unit) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#unitSrv.remove(unit.id).subscribe({
      next: () => {
        this.#state.update((s) => ({
          ...s,
          units: s.units.filter((u) => u.id !== unit.id),
        }));
        this.#alertSrv.showAlertSuccess(
          `El elmento ${unit.name.toUpperCase()} eliminado`,
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

    this.#unitSrv.filterName(name).subscribe({
      next: (units: Unit[]) => {
        this.#state.update((s) => ({
          ...s,
          units,
        }));
      },
      error: () => {
        this.#alertSrv.showAlertError('Error');
      },
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }
}
