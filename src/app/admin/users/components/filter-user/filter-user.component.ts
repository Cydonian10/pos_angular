import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'filter-user',
  standalone: true,
  imports: [OverlayModule, ReactiveFormsModule],
  templateUrl: './filter-user.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterUserComponent {
  isOpen = false;
  #fb = inject(FormBuilder);

  roles = input.required<string[]>();

  onAddFilter = output<string>();
  onDeleteFilter = output<void>();

  form = this.#fb.group({
    rol: new FormControl(''),
  });

  handleDeleteFilter() {
    this.onDeleteFilter.emit();
  }
  handleFilterData() {
    this.onAddFilter.emit(this.form.getRawValue().rol!);
  }
}
