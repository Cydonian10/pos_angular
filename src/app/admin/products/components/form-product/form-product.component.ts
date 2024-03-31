import { Brand } from '@/api/interfaces/brand.interface';
import { Category } from '@/api/interfaces/category.interface';
import { Product } from '@/api/interfaces/product.interface';
import { Unit } from '@/api/interfaces/unit.interface';
import { FormErrorPipe } from '@/core/pipes/form-error.pipe';

import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-form-product',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorPipe, KeyValuePipe],
  templateUrl: './form-product.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormProductComponent {
  constructor(
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA)
    public data?: {
      product: Product;
      categories: Category[];
      units: Unit[];
      brands: Brand[];
    },
  ) {}

  ngOnInit() {
    this.data && this.form.patchValue(this.data.product);
    this.imageUrl.set(this.data?.product.image);

    this.getUnit();
    this.getBrand();
    this.getCategory();
  }

  #fb = inject(FormBuilder);

  form = this.#fb.group({
    stock: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    salePrice: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    purchasePrice: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    size: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    categoryId: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    brandId: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    unitMeasurementId: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    barCode: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    Image: new FormControl(),
  });

  imageUrl = signal<string | undefined>(undefined);

  get name() {
    return this.form.controls.name;
  }
  get description() {
    return this.form.controls.description;
  }
  get stock() {
    return this.form.controls.stock;
  }
  get salePrice() {
    return this.form.controls.salePrice;
  }
  get purchasePrice() {
    return this.form.controls.purchasePrice;
  }
  get size() {
    return this.form.controls.size;
  }
  get categoryId() {
    return this.form.controls.categoryId;
  }
  get brandId() {
    return this.form.controls.brandId;
  }
  get unitMeasurementId() {
    return this.form.controls.unitMeasurementId;
  }
  get barCode() {
    return this.form.controls.barCode;
  }

  get image() {
    return this.form.controls.Image;
  }

  getUnit() {
    if (this.data?.product) {
      const unit = this.data?.units.filter(
        (unit) => unit.name == this.data?.product.unitMeasurement,
      );
      this.unitMeasurementId.setValue(unit[0].id);
    }
  }

  getBrand() {
    if (this.data?.product) {
      const brand = this.data?.brands.filter(
        (brand) => brand.name == this.data?.product.brand,
      );
      this.brandId.setValue(brand[0].id);
    }
  }

  getCategory() {
    if (this.data?.product) {
      const category = this.data?.categories.filter(
        (category) => category.name == this.data?.product.category,
      );
      this.categoryId.setValue(category[0].id);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.image.setValue(file);

    if (file) {
      this.imageUrl.set(URL.createObjectURL(file));
    }
  }

  handleForm() {
    if (this.form.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.name.getRawValue());
    formData.append('description', this.description.getRawValue());

    formData.append('stock', this.stock.getRawValue().toString());

    formData.append('salePrice', this.salePrice.getRawValue().toString());

    formData.append(
      'purchasePrice',
      this.purchasePrice.getRawValue().toString(),
    );
    formData.append('size', this.size.getRawValue());
    formData.append('categoryId', this.categoryId.getRawValue().toString());
    formData.append('brandId', this.brandId.getRawValue().toString());
    formData.append(
      'unitMeasurementId',
      this.unitMeasurementId.getRawValue().toString(),
    );
    formData.append('barCode', this.barCode.getRawValue().toString());
    formData.append(
      'unitMeasurementId',
      this.unitMeasurementId.getRawValue().toString(),
    );
    formData.append('image', this.image.getRawValue());

    if (this.data?.product) {
      this.dialogRef.close({
        form: formData,
        id: this.data.product.id,
      });
    }

    this.dialogRef.close(formData);
  }
}
