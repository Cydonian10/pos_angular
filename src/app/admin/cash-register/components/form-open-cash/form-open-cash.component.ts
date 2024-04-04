import { CashRegister } from '@/api/interfaces/cash-register.interface';
import { FormErrorPipe } from '@/core/pipes/form-error.pipe';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-open-cash',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorPipe, KeyValuePipe],
  templateUrl: './form-open-cash.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormOpenCashComponent {
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data?: CashRegister,
  ) {}

  form = this.fb.group({
    initialCash: new FormControl(0, {
      nonNullable: true,
    }),
  });

  get initialCash() {
    return this.form.controls.initialCash;
  }

  handleForm() {
    this.dialogRef.close({
      initialCash: this.initialCash.getRawValue(),
      id: this.data?.id,
    });
  }
}
