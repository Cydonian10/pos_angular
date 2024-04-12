import { FilterCustomer } from '@/api/interfaces/customer.interface';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

type FilterType = 'name' | 'dni';

@Component({
  selector: 'app-filter-customers',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './filter-customers.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterCustomersComponent implements OnInit {
  readonly fb = inject(NonNullableFormBuilder);

  filterCustomer = input.required<FilterCustomer>();

  filter = new FormControl<FilterType>('name', {
    nonNullable: true,
  });

  form = this.fb.group({
    name: new FormControl<string | null>(null),
    dni: new FormControl<string | null>(null),
  });

  onFilterCustomer = output<FilterCustomer>();

  ngOnInit(): void {
    this.form.patchValue(this.filterCustomer());
  }

  submitForm() {
    this.onFilterCustomer.emit(this.form.getRawValue());
    // this.form.reset(this.resetForm());
  }

  resetForm = () => ({ name: null, dni: null });
}
