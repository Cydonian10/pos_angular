import { FormErrorPipe } from '@/core/pipes/form-error.pipe';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add-discount',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, FormErrorPipe],
  templateUrl: './add-discount.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDiscountComponent {
  #fb = inject(FormBuilder);
  constructor(
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public unidad: string,
  ) {}

  form = this.#fb.group({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    discountedPrice: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    minimumDiscountQuantity: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get name() {
    return this.form.controls.name;
  }
  get discountedPrice() {
    return this.form.controls.discountedPrice;
  }
  get minimumDiscountQuantity() {
    return this.form.controls.minimumDiscountQuantity;
  }

  handleForm() {
    this.dialogRef.close(this.form.getRawValue());
  }
}
