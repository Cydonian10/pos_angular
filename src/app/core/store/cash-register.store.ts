import {
  CashRegister,
  OpenCashRegisterDto,
  UpdateCashRegisterDto,
} from '@/api/interfaces/cash-register.interface';
import { CashRegisterService } from '@/api/services/cash-register.service';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { LocalStorageService } from '../services/local-storage.service';

type CashRegisterState = {
  cashRegisters: CashRegister[];
  isLoading: boolean;
  selectCashRegister: CashRegister | null;
  totalCash: number;
};

@Injectable({
  providedIn: 'root',
})
export class CashRegisterStore {
  #cashRegisterSrv = inject(CashRegisterService);
  #alertSrv = inject(AlertService);
  #localStorageSrv = inject(LocalStorageService);

  #state = signal<CashRegisterState>({
    cashRegisters: [],
    isLoading: false,
    selectCashRegister: null,
    totalCash: 0,
  });
  state = computed(() => this.#state());

  constructor() {
    effect(() => {
      console.log('**** State Cash Register *****');
      console.log(this.#state());
    });
  }

  getAll() {
    this.#state.update((s) => ({ ...s, isLoading: true }));
    this.#cashRegisterSrv.getAll().subscribe({
      next: (cashRegisters: CashRegister[]) => {
        this.#state.update((s) => ({ ...s, cashRegisters }));
      },
      error: (resp) => this.#alertSrv.showAlertError(resp),
      complete: () => this.#state.update((s) => ({ ...s, isLoading: true })),
    });
  }

  update(dto: UpdateCashRegisterDto, id: number) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#cashRegisterSrv.update(dto, id).subscribe({
      next: (cashRegister: CashRegister) => {
        this.#state.update((s) => ({
          ...s,
          cashRegisters: s.cashRegisters.map((cr) => {
            if (cr.id === cashRegister.id) {
              cr = cashRegister;
            }
            return cr;
          }),
        }));
        this.#alertSrv.showAlertSuccess(
          `El elmento ${cashRegister.name} actulizado`,
        );
      },
      error: () => {},
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  openCash(dto: OpenCashRegisterDto, id: number) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#cashRegisterSrv.open(dto, id).subscribe({
      next: (cashRegister: CashRegister) => {
        this.#state.update((s) => ({
          ...s,
          cashRegisters: s.cashRegisters.map((cr) => {
            if (cr.id === cashRegister.id) {
              cr = cashRegister;
            }
            return cr;
          }),
        }));
        this.#alertSrv.showAlertSuccess(
          `El elmento ${cashRegister.name} abierto`,
        );
      },
      error: (resp) => this.#alertSrv.showAlertError(resp.error.msg),
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  selectedCashRegister(cashRegister: CashRegister) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#cashRegisterSrv.selectCashRegister(cashRegister.id).subscribe({
      next: (cashRegister: CashRegister) => {
        this.#state.update((s) => ({
          ...s,
          selectCashRegister: cashRegister,
          cashRegisters: s.cashRegisters.map((cr) => {
            if (cr.id === cashRegister.id) {
              cr = cashRegister;
            }
            return cr;
          }),
        }));
        this.#localStorageSrv.save(cashRegister, 'cash');
        this.#alertSrv.showAlertSuccess(
          `El elmento ${cashRegister.name} abierto`,
        );
      },
      error: (resp) => this.#alertSrv.showAlertError(resp.error.msg),
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  setCurrentCashRegister() {
    const cashRegister = this.#localStorageSrv.get<CashRegister | null>('cash');

    cashRegister &&
      this.#state.update((s) => ({ ...s, selectCashRegister: cashRegister }));
  }
}
