import { Empresa } from '@/api/interfaces/empresa.interface';
import { EmpresaService } from '@/api/services/empresa.service';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';
import { CardHeaderComponent } from '@/components/card-header/card-header.component';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [AdminTitleComponent, CardHeaderComponent, ReactiveFormsModule],
  templateUrl: './empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EmpresaComponent {
  private fb = inject(NonNullableFormBuilder);
  readonly empresaSrv = inject(EmpresaService);

  public imageUrl = signal<string | undefined | null>(undefined);

  public form = this.fb.group({
    name: new FormControl(
      { value: '', disabled: true },
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    ruc: new FormControl(
      { value: '', disabled: true },
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    address: new FormControl(
      { value: '', disabled: true },
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    image: new FormControl<any>(''),
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

  get image() {
    return this.form.controls.image;
  }

  ngOnInit() {
    this.empresaSrv.get().subscribe((empresa: Empresa) => {
      this.form.patchValue(empresa);
      this.imageUrl.set(empresa?.image);
    });
  }

  toggleInput(control: FormControl) {
    console.log('hola');
    control.disabled ? control.enable() : control.disable();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.image.setValue(file);

    if (file) {
      this.imageUrl.set(URL.createObjectURL(file));
    }
  }

  submitForm() {
    if (this.form.invalid) {
      return;
    }

    const formData = new FormData();

    formData.append('name', this.name.getRawValue());
    formData.append('ruc', this.ruc.getRawValue());
    formData.append('address', this.address.getRawValue());
    formData.append('image', this.image.getRawValue());

    this.empresaSrv.update(formData).subscribe(() => {
      this.form.disable();
    });
  }
}
