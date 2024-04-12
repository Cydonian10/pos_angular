import { Product } from '@/api/interfaces/product.interface';
import { PostItem } from '@/core/interfaces/post.interface';
import { CurrencyPipe, NgClass, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'sale-product',
  standalone: true,
  imports: [CurrencyPipe, UpperCasePipe, ReactiveFormsModule, NgClass],
  templateUrl: './sale-products.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleProductsComponent {
  product = input.required<Product>();

  quantity = new FormControl<number | null>(null, {
    nonNullable: true,
    validators: [Validators.required],
  });

  onAddPostItem = output<PostItem>();

  handleAddPostItem(event: Event) {
    event.preventDefault();
    if (this.quantity.invalid) {
      return;
    }

    this.onAddPostItem.emit({
      product: this.product(),
      discount: 0,
      quantity: this.quantity.getRawValue()!,
      subTotal: 0,
    });

    this.quantity.reset(null);
  }
}
