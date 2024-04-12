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

  // calculamos el total de paginas
  totalPage = computed(() =>
    Math.ceil(this.totalRegistros() / this.pagination().quantityRecordsPerPage),
  );

  // esto total de paginas lo volvemos un array
  totalPageArray = computed(() => new Array(this.totalPage()));

  selectQuantityRegister = new FormControl<number>(0);

  ngOnInit() {
    // seteamos el valor del cantidad de registros por pagina
    this.selectQuantityRegister.setValue(
      this.pagination().quantityRecordsPerPage,
    );

    // emitimos el valor para camibar de pagina
    this.selectQuantityRegister.valueChanges.subscribe((resp) => {
      this.pagination.update((p) => ({
        page: p.page === this.totalPage() && p.page !== 1 ? p.page - 1 : p.page,
        quantityRecordsPerPage: +resp!,
      }));

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
