import { Pagination } from '@/api/interfaces/pagination.interface';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pagination.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  pagination = model.required<Pagination>();

  totalRegistros = input.required<number>();

  onChangePage = output();

  totalPage = computed(() =>
    Math.ceil(this.totalRegistros() / this.pagination().quantityRecordsPerPage),
  );
  totalPageArray = computed(() => new Array(this.totalPage()));

  selectQuantityRegister = new FormControl<number>(15);

  ngOnInit() {
    this.selectQuantityRegister.valueChanges.subscribe((resp) => {
      this.pagination.update((p) => ({ ...p, quantityRecordsPerPage: resp! }));
      this.onChangePage.emit();
    });
  }

  nextPage() {
    if (this.pagination().page === this.totalPage()) {
      return;
    }
    this.pagination.update((p) => ({ ...p, page: p.page + 1 }));
    this.onChangePage.emit();
  }

  previusPage() {
    if (this.pagination().page === 1) {
      return;
    }
    this.pagination.update((p) => ({ ...p, page: p.page - 1 }));
    this.onChangePage.emit();
  }

  selectPage(page: number) {
    this.pagination.update((p) => ({ ...p, page }));
    this.onChangePage.emit();
  }
}
