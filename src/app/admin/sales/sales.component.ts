import {
  CurrencyPipe,
  JsonPipe,
  NgClass,
  UpperCasePipe,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { SelectCashRegisterComponent } from './components/select-cash-register/select-cash-register.component';
import { UserStore } from '@/core/store/user.store';
import { CashRegister } from '@/api/interfaces/cash-register.interface';
import { FilterSearchProductComponent } from './components/filter-search-product/filter-search-product.component';
import { SaleProductsComponent } from './components/sale-products/sale-products.component';
import { PostItem } from '@/core/interfaces/post.interface';
import { PosService } from '@/core/services/pos.service';
import { PosItemsTableComponent } from './components/pos-items-table/pos-items-table.component';
import { Dialog } from '@angular/cdk/dialog';
import { SelectCustomerComponent } from './components/select-customer/select-customer.component';
import { Customer } from '@/api/interfaces/customer.interface';
import { FilterProduct } from '@/api/interfaces/product.interface';
import { ProductsStore } from '@/store/products.store';
import { CustomersStore } from '@/store/customers.store';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';
import { CardHeaderComponent } from '@/components/card-header/card-header.component';
import { CashRegistersStore } from '@/store/cash-registers.store';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    JsonPipe,
    SelectCashRegisterComponent,
    FilterSearchProductComponent,
    CurrencyPipe,
    UpperCasePipe,
    SaleProductsComponent,
    NgClass,
    PosItemsTableComponent,
    AdminTitleComponent,
    CardHeaderComponent,
  ],
  templateUrl: './sales.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SalesComponent implements OnInit {
  readonly productStore = inject(ProductsStore);
  readonly customerStore = inject(CustomersStore);
  readonly cashRegisterStore = inject(CashRegistersStore);

  #userStore = inject(UserStore);
  #dialog = inject(Dialog);
  posSrv = inject(PosService);

  customerSelected = signal<Customer | undefined>(undefined);
  userState = this.#userStore.state;

  ngOnInit(): void {
    this.productStore.getAll({ page: 1, quantityRecordsPerPage: 0 });
    this.cashRegisterStore.getAll();
  }

  selectCustomer() {
    this.#dialog
      .open(SelectCustomerComponent, {
        data: this.customerStore.filterCustomers(),
      })
      .closed.subscribe((resp: any) => {
        this.customerSelected.set(resp);
      });
  }

  clearPosItems() {
    const resp = window.confirm('Estas seguro(a) de borrar productos');

    if (resp) {
      this.posSrv.limpiearPosItems();
      this.customerSelected.set(undefined);
    }
  }

  removePosItem(posItem: PostItem) {
    this.posSrv.deleteProduct(posItem);
  }

  handleSelectCashRegister(cashRegister: CashRegister) {
    this.cashRegisterStore.selectCashRegister(cashRegister);
  }

  handleCloseCashRegister(cashRegister: CashRegister) {
    this.cashRegisterStore.closeCashRegister(cashRegister);
  }

  filterProducts(filterDto: FilterProduct) {
    this.productStore.filterProduct(filterDto);
  }

  getProducts() {
    this.productStore.clearProducts();
  }

  handleAddPostItem(postItem: PostItem) {
    this.posSrv.addProduct(postItem);
  }

  handleSubmitCreateSale() {}
}
