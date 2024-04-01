import { CreateUnitDto, Unit } from '@/api/interfaces/unit.interface';
import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormUnitComponent } from './components/form-unit/form-unit.component';
import { SideComponent } from '@/components/side/side.component';
import { SideService } from '@/core/services/side.service';
import { UnitStore } from '@/core/store/unit.store';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';

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
  #sideSrv = inject(SideService);
  #unitStore = inject(UnitStore);
  #dialog = inject(Dialog);

  public unitState = this.#unitStore.state;
  public open = this.#sideSrv.open;
  public filter = new FormControl<string>('');

  ngOnInit() {
    this.filterName();
  }

  filterName() {
    this.filter.valueChanges.pipe(debounceTime(1000)).subscribe((filter) => {
      if (filter == '' || filter == null) {
        this.#unitStore.getAll();
        return;
      }
      this.#unitStore.filterName(filter);
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
    this.#unitStore.create(dto);
  }

  submitUpdateForm(dto: Unit) {
    const { id, ...rest } = dto;
    this.#unitStore.update(rest, id);
  }

  remove(unit: Unit) {
    const value = window.confirm(
      `Desea eliminar la unidad de medida ${unit.name.toUpperCase()}`,
    );

    value && this.#unitStore.remove(unit);
  }
}
