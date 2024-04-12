import {
  CreateCustomerDto,
  Customer,
  FilterCustomer,
  UpdateCustomerDto,
} from '@/api/interfaces/customer.interface';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';
import { Dialog } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormCustomerComponent } from './components/form-customer/form-customer.component';
import { CustomersStore } from '@/store/customers.store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { PaginationComponent } from '@/components/pagination/pagination.component';
import { Pagination } from '@/api/interfaces/pagination.interface';
import { FilterCustomersComponent } from '@/components/filter-customers/filter-customers.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  templateUrl: './customers.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    AdminTitleComponent,
    ReactiveFormsModule,
    PaginationComponent,
    FilterCustomersComponent,
  ],
})
export default class CustomersComponent {
  readonly customerStore = inject(CustomersStore);
  #dialog = inject(Dialog);

  pagination = signal<Pagination>(this.customerStore.pagination());

  changePage() {
    this.customerStore.getAll(this.pagination());
  }

  filterCustomer(filterDto: FilterCustomer) {
    this.customerStore.updateFilter(filterDto);
  }

  openForm(customer?: Customer) {
    this.#dialog
      .open(FormCustomerComponent, {
        height: '100%',
        data: customer,
        disableClose: true,
      })
      .closed.subscribe((resp: any) => {
        if (resp == false) return;
        if (resp.id) {
          const { id, ...rest } = resp;
          this.submitUpdate(rest, id);
        } else {
          this.submitCreate(resp);
        }
      });
  }

  submitCreate(dto: CreateCustomerDto) {
    this.customerStore.create(dto);
  }

  submitUpdate(dto: UpdateCustomerDto, id: number) {
    this.customerStore.update(dto, id);
  }

  remove(customer: Customer) {
    const value = window.confirm(
      `Desea eliminar el cliente ${customer.name.toUpperCase()} `,
    );
    value && this.customerStore.delete(customer);
  }
}
