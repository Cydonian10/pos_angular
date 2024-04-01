import {
  CreateCustomerDto,
  Customer,
  UpdateCustomerDto,
} from '@/api/interfaces/customer.interface';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';
import { CustomerStore } from '@/core/store/customer.store';
import { Dialog } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormCustomerComponent } from './components/form-customer/form-customer.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [NgClass, AdminTitleComponent],
  templateUrl: './customers.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CustomersComponent {
  #customerStore = inject(CustomerStore);
  #dialog = inject(Dialog);

  customerState = this.#customerStore.state;

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
    this.#customerStore.create(dto);
  }

  submitUpdate(dto: UpdateCustomerDto, id: number) {
    this.#customerStore.update(dto, id);
  }

  remove(customer: Customer) {
    const value = window.confirm(
      `Desea eliminar el cliente ${customer.name.toUpperCase()} `,
    );

    if (value) {
      this.#customerStore.remove(customer);
    }
  }
}
