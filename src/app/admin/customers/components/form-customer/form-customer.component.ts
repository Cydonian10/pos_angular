import { Customer } from '@/api/interfaces/customer.interface';
import { FormErrorPipe } from '@/core/pipes/form-error.pipe';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-form-customer',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, FormErrorPipe],
  templateUrl: './form-customer.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCustomerComponent {
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data?: Customer,
  ) {}

  ngOnInit() {
    console.log(this.data);
    this.data && this.form.patchValue(this.data);
  }

  form = this.fb.group({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phone: new FormControl<string | null>('', {
      nonNullable: true,
    }),
    dni: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    address: new FormControl<string | null>('', {}),
  });

  get name() {
    return this.form.controls.name;
  }
  get phone() {
    return this.form.controls.phone;
  }
  get dni() {
    return this.form.controls.dni;
  }
  get address() {
    return this.form.controls.address;
  }

  handleForm() {
    if (this.form.invalid) {
      return;
    }

    if (this.data) {
      this.dialogRef.close({ ...this.form.getRawValue(), id: this.data.id });
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }
}
