import { EmpresaService } from '@/api/services/empresa.service';
import { FormErrorPipe } from '@/core/pipes/form-error.pipe';
import { KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-form-empresa',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, FormErrorPipe],
  templateUrl: './form-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormEmpresaComponent {
  public nextStep = input.required<boolean>();
  public empresaSrv = inject(EmpresaService);
  readonly fb = inject(NonNullableFormBuilder);

  readonly onChangeNextStep = output<void>();

  form = this.fb.group({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    ruc: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    address: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get name() {
    return this.form.controls.name;
  }
  get ruc() {
    return this.form.controls.ruc;
  }
  get address() {
    return this.form.controls.address;
  }

  submitForm() {
    if (this.form.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append('name', this.name.getRawValue());
    formData.append('ruc', this.ruc.getRawValue());
    formData.append('address', this.address.getRawValue().toString());

    this.empresaSrv.create(formData).subscribe((resp) => {
      console.log(resp);
      this.onChangeNextStep.emit();
    });
  }
}
