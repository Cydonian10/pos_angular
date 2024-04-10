import { Product } from '@/api/interfaces/product.interface';
import { DetailPurchase } from '@/api/interfaces/purchase.interface';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'purchase-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './purchase-products.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseProductComponent {
  #fb = inject(FormBuilder);

  product = input.required<Product>();

  form = this.#fb.group({
    quantity: new FormControl<number | null>(null, [Validators.required]),
    purchasePrice: new FormControl<number | null>(null, [Validators.required]),
  });

  get quantity() {
    return this.form.controls.quantity;
  }
  get purchasePrice() {
    return this.form.controls.purchasePrice;
  }

  onPartialPurchaseDetail = output<DetailPurchase>();

  handlePartialPurchaseDetail() {
    if (this.form.invalid) {
      return;
    }
    this.onPartialPurchaseDetail.emit({
      quantity: this.quantity.value!,
      purchasePrice: this.purchasePrice.value!,
      product: this.product(),
      subTotal: 0,
    });
  }
}
