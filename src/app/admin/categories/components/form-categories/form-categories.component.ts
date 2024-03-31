import { Category } from '@/api/interfaces/category.interface';
import { FormErrorPipe } from '@/core/pipes/form-error.pipe';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-form-categories',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, FormErrorPipe],
  templateUrl: './form-categories.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCategoriesComponent {
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data?: Category,
  ) {}

  ngOnInit() {
    this.data && this.form.patchValue(this.data);
  }

  form = this.fb.group({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get name() {
    return this.form.controls.name;
  }
  get description() {
    return this.form.controls.description;
  }

  handleForm() {
    if (this.form.invalid) {
      return;
    }

    if (this.data) {
      this.dialogRef.close({ ...this.form.getRawValue(), id: this.data.id });
    }

    this.dialogRef.close(this.form.getRawValue());
  }
}
