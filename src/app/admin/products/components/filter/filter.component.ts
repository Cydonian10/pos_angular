import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FilterProduct } from '@/api/interfaces/product.interface';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [OverlayModule, ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  #fb = inject(FormBuilder);
  isOpen = false;
  onFilterData = output<FilterProduct>();
  onDeleteFilter = output();

  form = this.#fb.group({
    name: new FormControl<string | null>(null, {}),
    price: new FormControl<number | null>(null, {}),
    stock: new FormControl<number | null>(null, {}),
    barCode: new FormControl<number | null>(null, {}),
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
