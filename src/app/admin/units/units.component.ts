import { CreateUnitDto, Unit } from '@/api/interfaces/unit.interface';
import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormUnitComponent } from './components/form-unit/form-unit.component';
import { SideComponent } from '@/components/side/side.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';
import { UnitsStore } from '@/store/units.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [
    NgClass,
    SideComponent,
    FormUnitComponent,
    DialogModule,
    ReactiveFormsModule,
    AdminTitleComponent,
  ],
  templateUrl: './units.component.html',
})
export default class UnitsComponent {
  readonly unitStore = inject(UnitsStore);
  #dialog = inject(Dialog);

  public filter = new FormControl<string>(this.unitStore.filter());

  constructor() {
    this.filterName();
  }

  filterName() {
    this.filter.valueChanges
      .pipe(debounceTime(1000), takeUntilDestroyed())
      .subscribe((filter) => {
        if (filter == '' || filter == null) {
          this.unitStore.updateFilter('');
          this.unitStore.loadAll();
          return;
        }
        this.unitStore.updateFilter(filter);
        this.unitStore.loadAll();
      });
  }

  openForm(unit?: Unit) {
    this.#dialog
      .open(FormUnitComponent, {
        height: '100%',
        data: unit,
      })
      .closed.subscribe((resp: any) => {
        if (resp === false) {
          return;
        }
        resp.id ? this.submitUpdateForm(resp) : this.submitForm(resp);
      });
  }

  submitForm(dto: CreateUnitDto) {
    this.unitStore.createUnit(dto);
  }

  submitUpdateForm(dto: Unit) {
    const { id, ...rest } = dto;
    this.unitStore.updatedUnit(rest, id);
  }

  remove(unit: Unit) {
    const value = window.confirm(
      `Desea eliminar la unidad de medida ${unit.name.toUpperCase()}`,
    );

    value && this.unitStore.delteUnit(unit.id);
  }
}
