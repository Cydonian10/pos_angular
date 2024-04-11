import { PaginationComponent } from '@/components/pagination/pagination.component';
import { Dialog } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormBrandComponent } from './components/form-brand/form-brand.component';
import { Brand } from '@/api/interfaces/brand.interface';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';
import { BrandsStore } from '@/store/brands.store';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    PaginationComponent,
    AdminTitleComponent,
  ],
  templateUrl: './brands.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BrandsComponent {
  readonly brandStore = inject(BrandsStore);
  #dialog = inject(Dialog);

  nameFilter = new FormControl(this.brandStore.filter().name);

  constructor() {
    this.filterName();
  }

  filterName() {
    this.nameFilter.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      if (value == '' || value == null) {
        this.brandStore.updateFilter({ name: '' });
        return;
      }
      this.brandStore.updateFilter({ name: value });
    });
  }

  openForm(brand?: Brand) {
    this.#dialog
      .open(FormBrandComponent, {
        height: '100%',
        data: brand,
      })
      .closed.subscribe((resp: any) => {
        if (!resp) return;
        resp.id ? this.submitUpdate(resp) : this.submitCreate(resp);
      });
  }

  submitCreate(dto: FormData) {
    this.brandStore.create(dto);
  }

  submitUpdate(dto: { formData: FormData; id: number }) {
    this.brandStore.update(dto.formData, dto.id);
  }

  remove(brand: Brand) {
    const confirm = window.confirm(`Desea eliminar ${brand.name}`);

    console.log(confirm);
  }
}
