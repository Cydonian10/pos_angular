import { Egreso } from '@/api/interfaces/egreso.interface';
import { FormErrorPipe } from '@/core/pipes/form-error.pipe';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-egreso',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorPipe, KeyValuePipe, DatePipe],
  templateUrl: './form-egreso.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormEgresoComponent {
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data?: number,
  ) {}
  fechaActual = new Date();
  form = this.fb.group({
    createDate: new FormControl(
      { value: '', disabled: true },
      {
        nonNullable: true,
      },
    ),
    name: new FormControl('', {
      nonNullable: true,
    }),
    egreso: new FormControl<number>(1, {
      nonNullable: true,
    }),
    monto: new FormControl<number>(0, {
      nonNullable: true,
    }),
    cashRegisterId: new FormControl<number>(
      { value: 0, disabled: true },
      {
        nonNullable: true,
      },
    ),
  });

  get name() {
    return this.form.controls.name;
  }
  get egreso() {
    return this.form.controls.egreso;
  }
  get monto() {
    return this.form.controls.monto;
  }
  get cashRegisterId() {
    return this.form.controls.cashRegisterId;
  }

  get createDate() {
    return this.form.controls.createDate;
  }

  ngOnInit() {
    const fechaActual = new Date(); // Obtener la fecha actual
    const fechaLocal = fechaActual.toUTCString();
    this.createDate.setValue(fechaLocal);
    this.cashRegisterId.setValue(this.data!);
  }

  handleForm() {
    this.dialogRef.close(this.form.getRawValue());
    //console.log(this.form.getRawValue());
  }
}
