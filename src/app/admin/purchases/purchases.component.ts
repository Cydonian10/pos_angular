import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';
import {
  SearchProduct,
  SearchProductComponent,
} from '@/components/search-product/search-product.component';
import { ProductService } from '@/api/services/product.service';
import { Product } from '@/api/interfaces/product.interface';
import { SearchSupplierComponent } from './components/search-supplier/search-supplier.component';
import { PurchaseProductComponent } from './components/purchase-products/purchase-products.component';
import {
  CreatePurchaseDto,
  DetailPurchase,
} from '@/api/interfaces/purchase.interface';
import { ShoppinService } from '@/core/services/shopping.service';
import { SupplierService } from '@/api/services/suppliers.service';
import { Supplier } from '@/api/interfaces/supplier.interface';
import { PurchaseSuppliersComponent } from './components/purchase-suppliers/purchase-suppliers.component';
import { CurrencyPipe } from '@angular/common';
import { PurchaseService } from '@/api/services/purchase.service';
import { AlertService } from '@/core/services/alert.service';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [
    AdminTitleComponent,
    SearchProductComponent,
    SearchSupplierComponent,
    PurchaseProductComponent,
    PurchaseSuppliersComponent,
    CurrencyPipe,
  ],
  templateUrl: './purchases.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PurchasesComponent {
  #alertSrv = inject(AlertService);
  #productSrv = inject(ProductService);
  #supplierSrv = inject(SupplierService);
  #purchaseSrv = inject(PurchaseService);
  shoppingCart = inject(ShoppinService);

  isLoading = signal(false);
  products = signal<Product[]>([]);
  suppliers = signal<Supplier[]>([]);
  currentSupplier = signal<Supplier | null>(null);

  handleSubmitSearchProduct(searchProduct: SearchProduct) {
    this.isLoading.set(true);
    this.#productSrv.filterOneData(searchProduct).subscribe({
      next: (products: Product[]) => this.products.set(products),
      error: () => this.isLoading.set(false),
      complete: () => this.isLoading.set(false),
    });
  }

  addPurchaseDetail(dto: DetailPurchase) {
    this.shoppingCart.addDetailPurchase(dto);
  }

  handleClearProducts() {
    this.products.set([]);
    this.currentSupplier.set(null);
  }

  handleClearItemsShopping() {
    this.shoppingCart.clearShoppintCart();
  }

  submitSearchSupplier(name: string) {
    this.isLoading.set(true);
    this.currentSupplier.set(null);
    this.#supplierSrv.search(name).subscribe({
      next: (suppliers: Supplier[]) => this.suppliers.set(suppliers),
      error: () => this.isLoading.set(false),
      complete: () => this.isLoading.set(false),
    });
  }

  selectSupplier(supplier: Supplier) {
    this.currentSupplier.set(supplier);
  }

  submitGeneratePurchase() {
    if (!this.currentSupplier()) {
      this.#alertSrv.showAlertError('Necesita selecionar un proveedor');
      return;
    }

    const data: CreatePurchaseDto = {
      taxes: 0.18,
      date: new Date(),
      supplierId: this.currentSupplier()!.id,
      details: this.shoppingCart.shoppinCart(),
    };
    window.print();
    this.isLoading.set(true);
    this.#purchaseSrv.createPurchase(data).subscribe({
      next: () => this.#alertSrv.showAlertSuccess('Compra guardada'),
      error: () => this.isLoading.set(false),
      complete: () => this.isLoading.set(false),
    });
  }
}
