import { Supplier } from '@/api/interfaces/supplier.interface';
import { FormErrorPipe } from '@/core/pipes/form-error.pipe';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-form-supplier',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, FormErrorPipe],
  templateUrl: './form-supplier.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSupplierComponent implements OnInit {
  #fb = inject(NonNullableFormBuilder);
  constructor(
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA)
    public data?: Supplier,
  ) {}

  form = this.#fb.group({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    adress: new FormControl('', [Validators.required, Validators.minLength(3)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  get name() {
    return this.form.controls.name;
  }
  get adress() {
    return this.form.controls.adress;
  }
  get phone() {
    return this.form.controls.phone;
  }

  ngOnInit(): void {
    this.data && this.form.patchValue(this.data);
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.data) {
      this.dialogRef.close({ ...this.form.getRawValue(), id: this.data.id });
    } else {
      this.dialogRef.close({ ...this.form.getRawValue() });
    }
  }
}
