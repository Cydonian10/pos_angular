import {
  CreateCustomerDto,
  Customer,
} from '@/api/interfaces/customer.interface';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { CustomerService } from '@/api/services/customer.service';

type CustomerState = {
  customers: Customer[];
  isLoading: boolean;
  currentCustomer: Customer | undefined;
};

@Injectable({
  providedIn: 'root',
})
export class CustomerStore {
  #customerSrv = inject(CustomerService);
  #alertSrv = inject(AlertService);

  #state = signal<CustomerState>({
    customers: [],
    isLoading: false,
    currentCustomer: undefined,
  });

  state = computed(() => this.#state());

  constructor() {
    effect(() => {
      console.log('**** State Customer *****');
      console.log(this.#state());
    });
    this.getAll();
  }

  getAll() {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#customerSrv.getAll().subscribe({
      next: (customers: Customer[]) => {
        this.#state.update((s) => ({ ...s, customers }));
      },
      error: () => {
        this.#alertSrv.showAlertError('Error');
      },
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  create(dto: CreateCustomerDto) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#customerSrv.create(dto).subscribe({
      next: (customer: Customer) => {
        this.#state.update((s) => ({
          ...s,
          customers: [customer, ...s.customers],
        }));
        this.#alertSrv.showAlertSuccess(`El elmento ${customer.name} creado`);
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

  update(dto: CreateCustomerDto, id: number) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#customerSrv.update(dto, id).subscribe({
      next: (customer: Customer) => {
        this.#state.update((s) => ({
          ...s,
          customers: s.customers.map((c) => {
            if (c.id === customer.id) {
              c = customer;
            }
            return c;
          }),
        }));
        this.#alertSrv.showAlertSuccess(
          `El elmento ${customer.name} actulizado`,
        );
      },
      error: () => {},
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  remove(customer: Customer) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#customerSrv.remove(customer.id).subscribe({
      next: () => {
        this.#state.update((s) => ({
          ...s,
          customers: s.customers.filter((x) => x.id !== customer.id),
        }));
        this.#alertSrv.showAlertSuccess(
          `El cliente ${customer.name} eliminado`,
        );
      },
      error: () => {},
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }
}
