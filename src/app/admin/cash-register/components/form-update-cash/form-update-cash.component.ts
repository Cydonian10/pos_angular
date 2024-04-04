import { CashRegister } from '@/api/interfaces/cash-register.interface';
import { FormErrorPipe } from '@/core/pipes/form-error.pipe';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-update-cash',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, FormErrorPipe],
  templateUrl: './form-update-cash.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUpdateCashComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data?: CashRegister,
  ) {}

  form = this.fb.group({
    name: new FormControl(''),
  });

  ngOnInit(): void {
    this.data && this.name.patchValue(this.data.name);
  }

  get name() {
    return this.form.controls.name;
  }

  handleForm() {
    this.dialogRef.close({ name: this.name.getRawValue(), id: this.data?.id });
  }
}
