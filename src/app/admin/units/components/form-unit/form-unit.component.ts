import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
} from '@angular/core';
import { ModalLayout } from '@/layouts/modal-layout/modal-layout.component';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Unit } from '@/api/interfaces/unit.interface';
import { SideComponent } from '@/components/side/side.component';
import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { KeyValuePipe } from '@angular/common';
import { FormErrorPipe } from '@/core/pipes/form-error.pipe';

@Component({
  selector: 'app-form-unit',
  standalone: true,
  imports: [
    ModalLayout,
    ReactiveFormsModule,
    SideComponent,
    DialogModule,
    KeyValuePipe,
    FormErrorPipe,
  ],
  templateUrl: './form-unit.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUnitComponent {
  fb = inject(FormBuilder);

  form = this.fb.group({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    symbol: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get name() {
    return this.form.controls.name;
  }
  get symbol() {
    return this.form.controls.symbol;
  }

  constructor(
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data?: Unit,
  ) {}

  ngOnInit() {
    if (this.data) {
      this.form.patchValue(this.data);
    }
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
