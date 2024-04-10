import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'search-supplier',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-supplier.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchSupplierComponent {
  value = new FormControl<string>('', [Validators.required]);

  onSubmitSearchSupplier = output<string>();

  handleSubmit() {
    if (this.value.invalid) {
      return;
    }
    this.onSubmitSearchSupplier.emit(this.value.getRawValue()!);
  }

  clear() {
    this.value.reset();
  }
}
