import { Customer, FilterCustomer } from '@/api/interfaces/customer.interface';
import { FilterCustomersComponent } from '@/components/filter-customers/filter-customers.component';
import { CustomersStore } from '@/store/customers.store';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-select-customer',
  standalone: true,
  imports: [NgClass, FilterCustomersComponent],
  templateUrl: './select-customer.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCustomerComponent implements OnDestroy {
  readonly customerStore = inject(CustomersStore);

  constructor(
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public customers?: Customer[],
  ) {}

  ngOnDestroy(): void {
    this.customerStore.updateFilter({ dni: null, name: null });
  }

  filterCustomer(filterDto: FilterCustomer) {
    this.customerStore.updateFilter(filterDto);
  }
}
