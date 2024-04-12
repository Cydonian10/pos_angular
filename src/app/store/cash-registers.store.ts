import {
  CashRegister,
  OpenCashRegisterDto,
  UpdateCashRegisterDto,
} from '@/api/interfaces/cash-register.interface';
import { CashRegisterService } from '@/api/services/cash-register.service';
import { AlertService } from '@/core/services/alert.service';
import { LocalStorageService } from '@/core/services/local-storage.service';
import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { lastValueFrom } from 'rxjs';

type CashRegisterState = {
  cashRegisters: CashRegister[];
  isLoading: boolean;
  currentCashRegister: CashRegister | null;
  totalCash: number;
};

const initialState: CashRegisterState = {
  cashRegisters: [],
  isLoading: false,
  currentCashRegister: null,
  totalCash: 0,
};

export const CashRegistersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      cashRegisterSrv = inject(CashRegisterService),
      alertSrv = inject(AlertService),
      localStorageSrv = inject(LocalStorageService),
    ) => ({
      //
      async getAll(): Promise<void> {
        try {
          patchState(store, { isLoading: true });
          const cashRegisters = await lastValueFrom(cashRegisterSrv.getAll());
          patchState(store, { cashRegisters, isLoading: false });
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      //
      async update(
        dtoUpdate: UpdateCashRegisterDto,
        id: number,
      ): Promise<void> {
        try {
          patchState(store, { isLoading: true });
          const cashRegisterDB = await lastValueFrom(
            cashRegisterSrv.update(dtoUpdate, id),
          );
          patchState(store, {
            isLoading: false,
            cashRegisters: store.cashRegisters().map((cashRe) => {
              if (cashRe.id === id) {
                cashRe = cashRegisterDB;
              }
              return cashRe;
            }),
          });
          alertSrv.showAlertSuccess('Elemento Actualizado');
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      //
      async openCash(dto: OpenCashRegisterDto, id: number): Promise<void> {
        try {
          patchState(store, { isLoading: true });
          const cashRegisterDB = await lastValueFrom(
            cashRegisterSrv.open(dto, id),
          );
          patchState(store, {
            isLoading: false,
            cashRegisters: store.cashRegisters().map((cashRe) => {
              if (cashRe.id === id) {
                cashRe = cashRegisterDB;
              }
              return cashRe;
            }),
          });
          alertSrv.showAlertSuccess(`La caja esta abierta`);
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      //
      async selectCashRegister(dto: CashRegister) {
        try {
          patchState(store, { isLoading: true });
          const cashRegisterDB = await lastValueFrom(
            cashRegisterSrv.selectCashRegister(dto.id),
          );

          patchState(store, {
            isLoading: false,
            currentCashRegister: cashRegisterDB,
            cashRegisters: store.cashRegisters().map((cashRe) => {
              if (cashRe.id === dto.id) {
                cashRe = cashRegisterDB;
              }
              return cashRe;
            }),
          });

          this.saveCurrentCashRegister(dto);

          alertSrv.showAlertSuccess(`La caja ${dto.name} fue seleccionada`);
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      //
      async closeCashRegister(dto: CashRegister): Promise<void> {
        try {
          patchState(store, { isLoading: true });
          const cashRegisterDB = await lastValueFrom(
            cashRegisterSrv.close(dto.id),
          );

          patchState(store, {
            isLoading: false,
            currentCashRegister: null,
            cashRegisters: store.cashRegisters().map((cashRe) => {
              if (cashRe.id === dto.id) {
                cashRe = cashRegisterDB;
              }
              return cashRe;
            }),
          });

          this.saveCurrentCashRegister(null);

          alertSrv.showAlertSuccess(`La caja ${dto.name} fue cerrada`);
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      loadCurrentCashRegister() {
        const cashRegister = localStorageSrv.get<CashRegister | null>('cash');
        patchState(store, { currentCashRegister: cashRegister });
      },

      saveCurrentCashRegister(dto: CashRegister | null) {
        localStorageSrv.save<CashRegister | null>(dto, 'cash');
      },
    }),
  ),

  withHooks({
    async onInit(store) {
      store.loadCurrentCashRegister();
      // await store.getAll();
    },
  }),
);
