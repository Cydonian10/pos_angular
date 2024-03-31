import { Brand } from '@/api/interfaces/brand.interface';
import { FormErrorPipe } from '@/core/pipes/form-error.pipe';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
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
  selector: 'app-form-brand',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, FormErrorPipe],
  templateUrl: './form-brand.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormBrandComponent {
  fb = inject(FormBuilder);
  imageUrl: string | undefined = undefined;

  form = this.fb.group({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    image: new FormControl(),
  });

  get name() {
    return this.form.controls.name;
  }

  get description() {
    return this.form.controls.description;
  }

  get image() {
    return this.form.controls.image;
  }

  constructor(
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data?: Brand,
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.image.setValue(file);

    if (file) {
      this.imageUrl = URL.createObjectURL(file);
    }
  }

  ngOnInit() {
    this.data && this.form.patchValue(this.data);
    this.imageUrl = this.data?.image;
  }

  handleForm() {
    const formData = new FormData();
    formData.append('name', this.name.getRawValue());
    formData.append('description', this.description.getRawValue());
    formData.append('image', this.image.getRawValue());

    if (this.data) {
      this.dialogRef.close({ formData, id: this.data.id });
      return;
    }

    this.dialogRef.close(formData);
  }
}
