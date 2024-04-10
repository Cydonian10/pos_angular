import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export interface SearchProduct {
  value: any;
  filter: any;
}

@Component({
  selector: 'search-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-product.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchProductComponent {
  value = new FormControl<any>(null);
  filter = new FormControl<any>('name');

  onSubmitSearchProduct = output<SearchProduct>();

  onClear = output<void>();

  ngOnInit(): void {
    // this.value.valueChanges
    //   .pipe(
    //     debounceTime(1000),
    //     filter((value) => {
    //       return value;
    //     }),
    //   )
    //   .subscribe((resp: any) => {
    //     this.onSubmitFilterProduct.emit({
    //       value: resp,
    //       filter: this.filter.getRawValue(),
    //     });
    //     this.value.reset();
    //   });
  }

  handleSubmit() {
    this.onSubmitSearchProduct.emit({
      filter: this.filter.getRawValue(),
      value: this.value.getRawValue(),
    });
  }

  handleClear() {
    this.value.reset();
    this.onClear.emit();
  }
}
