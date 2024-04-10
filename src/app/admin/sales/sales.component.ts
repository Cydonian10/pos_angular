import { CashRegisterStore } from '@/core/store/cash-register.store';
import { ProductStore } from '@/core/store/product.store';
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
import { CustomerStore } from '@/core/store/customer.store';
import { Dialog } from '@angular/cdk/dialog';
import { SelectCustomerComponent } from './components/select-customer/select-customer.component';
import { Customer } from '@/api/interfaces/customer.interface';

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
  ],
  templateUrl: './sales.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SalesComponent implements OnInit {
  #productStore = inject(ProductStore);
  #cashRegisterStore = inject(CashRegisterStore);
  #userStore = inject(UserStore);
  #customerStore = inject(CustomerStore);
  #dialog = inject(Dialog);
  posSrv = inject(PosService);

  customerSelected = signal<Customer | undefined>(undefined);
  cashRegisterState = this.#cashRegisterStore.state;
  userState = this.#userStore.state;
  productState = this.#productStore.state;
  customerState = this.#customerStore.state;

  ngOnInit(): void {
    this.#cashRegisterStore.getAll();
  }

  selectCustomer() {
    this.#dialog
      .open(SelectCustomerComponent, {
        data: this.customerState().customers,
      })
      .closed.subscribe((resp: any) => {
        this.customerSelected.set(resp);
        console.log(this.customerSelected());
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
    this.#cashRegisterStore.selectedCashRegister(cashRegister);
  }

  handleCloseCashRegister(cashRegister: CashRegister) {
    this.#cashRegisterStore.closeCashRegister(cashRegister);
  }

  handleFilterProducts(productFilter: any) {
    this.#productStore.filterOneData(productFilter);
  }

  handleGetProducts() {
    this.#productStore.getAll({ page: 1, quantityRecordsPerPage: 15 });
  }

  handleAddPostItem(postItem: PostItem) {
    this.posSrv.addProduct(postItem);
  }

  handleSubmitCreateSale() {}
}
