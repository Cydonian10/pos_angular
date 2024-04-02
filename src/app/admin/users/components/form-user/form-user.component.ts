import { User } from '@/api/interfaces/user.interface';
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
  selector: 'app-form-user',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, FormErrorPipe],
  templateUrl: './form-user.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUserComponent {
  #fb = inject(FormBuilder);
  constructor(
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data?: User,
  ) {}

  ngOnInit() {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  form = this.#fb.group({
    salary: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    dateBirthday: new FormControl<Date>(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    dni: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get salary() {
    return this.form.controls.salary;
  }
  get dateBirthday() {
    return this.form.controls.dateBirthday;
  }
  get email() {
    return this.form.controls.email;
  }
  get name() {
    return this.form.controls.name;
  }
  get password() {
    return this.form.controls.password;
  }
  get phone() {
    return this.form.controls.phone;
  }

  get dni() {
    return this.form.controls.dni;
  }

  handleForm() {
    if (this.data) {
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }
}
