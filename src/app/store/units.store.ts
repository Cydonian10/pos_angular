import { CreateUnitDto, Unit } from '@/api/interfaces/unit.interface';
import { UnitService } from '@/api/services/unit.service';
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

type UnitState = {
  units: Unit[];
  isLoading: boolean;
  currentUnit: Unit | undefined;
  filter: string;
};

const initialState: UnitState = {
  units: [],
  isLoading: false,
  currentUnit: undefined,
  filter: '',
};

export const UnitsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ units }) => ({
    unitsCount: computed(() => units().length),
  })),
  withMethods(
    (
      store,
      unitSrv = inject(UnitService),
      alertSrv = inject(AlertService),
    ) => ({
      async loadAll(): Promise<void> {
        try {
          patchState(store, { isLoading: true });
          const units = await lastValueFrom(unitSrv.filterName(store.filter()));
          patchState(store, { isLoading: false, units });
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      async createUnit(dto: CreateUnitDto): Promise<void> {
        try {
          patchState(store, { isLoading: true });
          const unit = await lastValueFrom(unitSrv.create(dto));
          patchState(store, {
            isLoading: false,
            units: [unit, ...store.units()],
          });
          alertSrv.showAlertSuccess('Elemento Insertado');
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      async delteUnit(id: number): Promise<void> {
        try {
          patchState(store, { isLoading: true });
          await lastValueFrom(unitSrv.remove(id));
          patchState(store, {
            isLoading: false,
            units: store.units().filter((unit) => unit.id !== id),
          });
          alertSrv.showAlertSuccess('Elemento Eliminado');
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      async updatedUnit(dtoUpdate: CreateUnitDto, id: number): Promise<void> {
        try {
          patchState(store, { isLoading: true });
          const unit = await lastValueFrom(unitSrv.update(dtoUpdate, id));
          patchState(store, {
            isLoading: false,
            units: store.units().map((u) => {
              if (u.id === id) {
                u = unit;
              }
              return u;
            }),
          });
          alertSrv.showAlertSuccess('Elemento Actualizado');
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      updateFilter(filter: string): void {
        patchState(store, { filter });
      },
    }),
  ),
  withHooks({
    async onInit(store) {
      await store.loadAll();
    },
  }),
);
