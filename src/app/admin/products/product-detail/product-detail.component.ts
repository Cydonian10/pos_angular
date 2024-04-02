import { ProductStore } from '@/core/store/product.store';
import { Dialog } from '@angular/cdk/dialog';
import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { AddDiscountComponent } from '../components/add-discount/add-discount.component';
import {
  CreateDiscountDto,
  Discount,
} from '@/api/interfaces/discount.interface';

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
  #productStore = inject(ProductStore);
  #lacation = inject(Location);
  #dialog = inject(Dialog);

  state = this.#productStore.state;

  constructor() {}

  ngOnInit() {
    this.#productStore.getDiscounts(this.id);
  }

  openFormAddDiscount() {
    this.#dialog
      .open(AddDiscountComponent, {
        height: '100%',
        data: this.state().currentProduct?.unitMeasurement,
        disableClose: true,
      })
      .closed.subscribe((resp: any) => {
        if (resp === false) return;
        this.submitAddDiscount(resp);
      });
  }

  submitAddDiscount(discount: CreateDiscountDto) {
    const id = this.state().currentProduct?.id;
    this.#productStore.addDiscount(discount, id!);
    // console.log(discount,);
  }

  backPage() {
    this.#lacation.back();
  }

  removeDiscount(discount: Discount) {
    const confirm = window.confirm(
      `Desea eliminar ${discount.name.toUpperCase()}`,
    );

    this.#productStore.removeDiscount(discount);
  }
}
