import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FilterProduct } from '@/api/interfaces/product.interface';
import { ProductsStore } from '@/store/products.store';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [OverlayModule, ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  readonly productStore = inject(ProductsStore);
  #fb = inject(FormBuilder);
  isOpen = false;
  onFilterData = output<FilterProduct>();
  onDeleteFilter = output();

  form = this.#fb.group({
    name: new FormControl<string | null>(this.productStore.filter().name, {}),
    price: new FormControl<number | null>(this.productStore.filter().price, {}),
    stock: new FormControl<number | null>(this.productStore.filter().stock, {}),
    barCode: new FormControl<number | null>(
      this.productStore.filter().barCode,
      {},
    ),
  });

  handleFilterData() {
    this.isOpen = false;
    this.onFilterData.emit(this.form.getRawValue());
  }

  handleDeleteFilter() {
    this.isOpen = false;
    this.form.reset();
    this.onDeleteFilter.emit();
  }
}
