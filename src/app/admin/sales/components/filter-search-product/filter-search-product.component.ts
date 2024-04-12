import { FilterProduct } from '@/api/interfaces/product.interface';
import { ProductsStore } from '@/store/products.store';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  output,
} from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, repeat, take } from 'rxjs';

type TypeFilter = 'name' | 'price' | 'stock' | 'barCode';

@Component({
  selector: 'filter-search-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './filter-search-product.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSearchProductComponent implements OnInit {
  readonly fb = inject(NonNullableFormBuilder);
  readonly productStore = inject(ProductsStore);

  filter = new FormControl<TypeFilter>('name', {
    nonNullable: true,
  });

  form = this.fb.group({
    name: new FormControl<string | null>(this.productStore.filter().name, {}),
    price: new FormControl<number | null>(this.productStore.filter().price, {}),
    stock: new FormControl<number | null>(this.productStore.filter().stock, {}),
    barCode: new FormControl<number | null>(
      this.productStore.filter().barCode,
      {},
    ),
  });

  onSubmitFilterProduct = output<FilterProduct>();

  onGetAllProducts = output<void>();

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), take(1), repeat())
      .subscribe((filter: any) => {
        this.onSubmitFilterProduct.emit(filter);
        this.form.reset({
          barCode: null,
          name: null,
          price: null,
          stock: null,
        });
        this.productStore.updatedFilter({
          barCode: null,
          name: null,
          price: null,
          stock: null,
        });
      });
  }

  clear() {
    this.onGetAllProducts.emit();
    this.productStore.updatedFilter({
      barCode: null,
      name: null,
      price: null,
      stock: null,
    });
  }
}
