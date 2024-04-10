import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, filter } from 'rxjs';

@Component({
  selector: 'filter-search-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './filter-search-product.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSearchProductComponent implements OnInit {
  value = new FormControl<any>(null);
  filter = new FormControl<any>('name');

  onSubmitFilterProduct = output<{
    value: any;
    filter: any;
  }>();

  onGetAllProducts = output<void>();

  ngOnInit(): void {
    this.value.valueChanges
      .pipe(
        debounceTime(1000),
        filter((value) => {
          return value;
        }),
      )
      .subscribe((resp: any) => {
        this.onSubmitFilterProduct.emit({
          value: resp,
          filter: this.filter.getRawValue(),
        });
        this.value.reset();
      });
  }

  clear() {
    this.value.reset();
    this.onGetAllProducts.emit();
  }
}
