import { ProductStore } from '@/core/store/product.store';
import { Dialog } from '@angular/cdk/dialog';
import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  signal,
} from '@angular/core';
import { AddDiscountComponent } from '../components/add-discount/add-discount.component';
import {
  CreateDiscountDto,
  Discount,
} from '@/api/interfaces/discount.interface';
import { ProductService } from '@/api/services/product.service';
import { Product } from '@/api/interfaces/product.interface';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductDetailComponent {
  @Input() id: number = 0;
  #lacation = inject(Location);
  #dialog = inject(Dialog);
  #productSrv = inject(ProductService);

  product = signal<Product>({} as Product);
  discounts = signal<Discount[]>([]);

  constructor() {}

  ngOnInit() {
    //this.#productStore.getDiscounts(this.id);

    this.#productSrv
      .historyPrice(this.id)
      .subscribe((resp) => console.log(resp));

    this.#productSrv.getOne(this.id).subscribe((product: Product) => {
      this.product.set(product);
    });

    this.#productSrv
      .getDiscounts(this.id)
      .subscribe((discounts: Discount[]) => {
        this.discounts.set(discounts);
      });
  }

  openFormAddDiscount() {
    this.#dialog
      .open(AddDiscountComponent, {
        height: '100%',
        data: this.product().unitMeasurement,
        disableClose: true,
      })
      .closed.subscribe((resp: any) => {
        if (resp === false) return;
        this.submitAddDiscount(resp);
      });
  }

  submitAddDiscount(discountDto: CreateDiscountDto) {
    this.#productSrv
      .addDiscount([discountDto], this.product().id)
      .subscribe(() => {
        this.discounts.update((discounts) => [
          { ...discountDto, id: 1 },
          ...discounts,
        ]);
      });
  }

  backPage() {
    this.#lacation.back();
  }

  removeDiscount(discount: Discount) {
    const confirm = window.confirm(
      `Desea eliminar ${discount.name.toUpperCase()}`,
    );

    this.#productSrv.removeDiscount(discount.id).subscribe(() => {
      this.discounts.update((discounts) =>
        discounts.filter((d) => d.id !== discount.id),
      );
    });
  }
}
