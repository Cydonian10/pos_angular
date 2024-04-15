import { SaleService } from '@/api/services/sale.service';
import { CurrencyPipe, DatePipe, registerLocaleData } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  LOCALE_ID,
  inject,
  signal,
  computed,
  ElementRef,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import localeEs from '@angular/common/locales/es';
import { Bill } from '@/api/interfaces/sale.interface';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';

// Registra el idioma español
registerLocaleData(localeEs);

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, CurrencyPipe, AdminTitleComponent],
  templateUrl: './sales-report.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: LOCALE_ID, useValue: 'es-PE' }, // Establece el idioma en español
  ],
})
export default class SalesReportComponent implements OnInit {
  #fb = inject(NonNullableFormBuilder);
  #saleSrv = inject(SaleService);

  constructor(private el: ElementRef) {}

  formDates = this.#fb.group({
    starDate: [new Date(), [Validators.required]],
    endDate: [new Date(), [Validators.required]],
  });

  daysPassed = signal<number>(0);
  salesByDate = signal<Bill[]>([]);
  selectSale = signal<Bill | undefined>(undefined);

  priceTotalSales = computed(() =>
    this.salesByDate().reduce((sum, mod) => sum + mod.totalPrice, 0),
  );

  get starDate() {
    return this.formDates.controls.starDate;
  }

  get endDate() {
    return this.formDates.controls.endDate;
  }

  ngOnInit(): void {
    this.endDate.valueChanges.subscribe((resp) => {
      var milisegundosInicio = new Date(this.starDate.getRawValue()).getTime();
      var milisegundosFin = new Date(resp).getTime();

      var diferenciaMilisegundos = milisegundosFin - milisegundosInicio;
      var diasTranscurridos = diferenciaMilisegundos / (1000 * 60 * 60 * 24);

      this.daysPassed.set(diasTranscurridos);
    });
  }

  handleSelectSale(value: Bill) {
    this.el.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    this.selectSale.set(value);
  }

  handleSubmitFilterByDates() {
    this.#saleSrv.filterSaleByDate(this.formDates.getRawValue()).subscribe({
      next: (resp) => {
        this.salesByDate.set(resp);
      },
      error: (err) => {
        console.log('[Error component] 😡 error 💥💥', err);
      },
      complete: () => {},
    });
  }

  handleDowloadExcel() {
    this.#saleSrv.downLoadExcel(this.formDates.getRawValue()).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
    });
  }
}
