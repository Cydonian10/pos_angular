import {
  CreateCustomerDto,
  Customer,
  FilterCustomer,
  UpdateCustomerDto,
} from '@/api/interfaces/customer.interface';
import { Pagination } from '@/api/interfaces/pagination.interface';
import { CustomerService } from '@/api/services/customer.service';
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

type CustomerState = {
  customers: Customer[];
  isLoading: boolean;
  currentCustomer: Customer | undefined;
  totalRecords: number;
  filter: FilterCustomer;
  pagination: Pagination;
};

const initialState: CustomerState = {
  customers: [],
  isLoading: false,
  currentCustomer: undefined,
  totalRecords: 0,
  pagination: { page: 1, quantityRecordsPerPage: 100 },
  filter: { name: null, dni: null },
};

export const CustomersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ filter, customers }) => ({
    filterCustomers: computed(() => {
      if (!filter().name && !filter().dni) return customers();

      if (filter().dni)
        return customers().filter((cut) => cut.dni == filter().dni!);
      else
        return customers().filter((cut) =>
          cut.name.toLowerCase().includes(filter().name!.toLowerCase()),
        );
    }),
  })),
  withMethods(
    (
      store,
      customerSrv = inject(CustomerService),
      alertSrv = inject(AlertService),
    ) => ({
      //
      async getAll(pagination: Pagination) {
        this.updatePagination(pagination);
        try {
          patchState(store, { isLoading: true });
          const response = await lastValueFrom(
            customerSrv.getAll(store.pagination()),
          );
          const customers = response.body!;
          const totalRecords = parseInt(
            response.headers.get('totalregistros')!,
            10,
          );
          patchState(store, { customers, totalRecords, isLoading: false });
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      //
      async create(dto: CreateCustomerDto): Promise<void> {
        try {
          patchState(store, { isLoading: true });

          const customer = await lastValueFrom(customerSrv.create(dto));
          patchState(store, (state) => ({
            categories: [customer, ...state.customers],
            totalRecords: state.totalRecords + 1,
            isLoading: false,
          }));
          alertSrv.showAlertSuccess('Elemento Creado');
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      //
      async update(dto: UpdateCustomerDto, id: number): Promise<void> {
        try {
          patchState(store, { isLoading: true });
          const customerUpdate = await lastValueFrom(
            customerSrv.update(dto, id),
          );
          patchState(store, {
            isLoading: false,
            customers: store.customers().map((customer) => {
              if (customer.id === id) {
                customer = customerUpdate;
              }
              return customer;
            }),
          });
        } catch (error) {
          patchState(store, { isLoading: false });
        }
      },

      //
      async delete(dto: Customer): Promise<void> {
        try {
          patchState(store, { isLoading: true });

          const idDelete = await lastValueFrom(customerSrv.remove(dto.id));
          patchState(store, (state) => ({
            customers: store.customers().filter((cust) => cust.id !== dto.id),
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
      updatePagination(pagination: Pagination) {
        patchState(store, { pagination });
      },

      updateFilter(filter: FilterCustomer) {
        patchState(store, { filter });
      },
    }),
  ),
  withHooks((store) => ({
    async onInit(): Promise<void> {
      await store.getAll(store.pagination());
    },
  })),
);
