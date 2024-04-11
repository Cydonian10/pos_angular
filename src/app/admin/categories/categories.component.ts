import {
  Category,
  CreateCategoryDto,
} from '@/api/interfaces/category.interface';
import { Dialog } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormCategoriesComponent } from './components/form-categories/form-categories.component';
import { Pagination } from '@/api/interfaces/pagination.interface';
import { PaginationComponent } from '@/components/pagination/pagination.component';
import { debounceTime } from 'rxjs';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';
import { CategoriesStore } from '@/store/categories.store';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    PaginationComponent,
    AdminTitleComponent,
  ],
  templateUrl: './categories.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CategoriesComponent implements OnInit {
  readonly categoryStore = inject(CategoriesStore);
  #dialog = inject(Dialog);

  filter = new FormControl(this.categoryStore.filter().name);

  pagination = signal<Pagination>(this.categoryStore.pagination());

  changePage() {
    this.categoryStore.updatePagination(this.pagination());
    this.categoryStore.getAll();
  }

  ngOnInit() {
    this.filterName();
  }

  filterName() {
    this.filter.valueChanges.pipe(debounceTime(1000)).subscribe((filter) => {
      if (filter == '' || filter == null) {
        this.categoryStore.getAll();
        return;
      }
      this.categoryStore.filterName({ name: filter });
    });
  }

  openForm(category?: Category) {
    this.#dialog
      .open(FormCategoriesComponent, {
        height: '100%',
        data: category,
      })
      .closed.subscribe((resp: any) => {
        if (resp === false) return;
        if (resp.id) {
          this.submitUpdate(resp);
          return;
        }
        this.submitCreate(resp);
      });
  }

  submitCreate(dto: CreateCategoryDto) {
    this.categoryStore.create(dto);
  }

  submitUpdate(dto: Category) {
    const { id, ...rest } = dto;
    this.categoryStore.update(rest, id);
  }

  remove(category: Category) {
    const value = window.confirm(
      `Desea eliminar la categoria ${category.name.toUpperCase()} `,
    );

    value && this.categoryStore.delete(category);
  }
}
