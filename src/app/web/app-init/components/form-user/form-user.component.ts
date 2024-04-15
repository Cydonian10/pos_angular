import { AppInitService } from '@/api/services/appinit.service';
import { UserService } from '@/api/services/user.service';
import { FormErrorPipe } from '@/core/pipes/form-error.pipe';
import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

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
  #appInitSrv = inject(AppInitService);
  #router = inject(Router);

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

  submitForm() {
    if (this.form.invalid) {
      return;
    }
    this.#appInitSrv
      .registerUserInit(this.form.getRawValue() as any)
      .subscribe((resp) => {
        console.log(resp);
        this.#router.navigateByUrl('/auth/login');
      });
  }
}
