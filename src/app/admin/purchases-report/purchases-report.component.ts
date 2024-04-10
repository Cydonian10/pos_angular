import { Purchase } from '@/api/interfaces/purchase.interface';
import { PurchaseService } from '@/api/services/purchase.service';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-purchases-report',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, AdminTitleComponent, CurrencyPipe],
  templateUrl: './purchases-report.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PurchasesReportComponent {
  #fb = inject(NonNullableFormBuilder);
  #purchaseSrv = inject(PurchaseService);

  constructor(private el: ElementRef) {}

  formDates = this.#fb.group({
    starDate: [new Date(), [Validators.required]],
    endDate: [new Date(), [Validators.required]],
  });

  daysPassed = signal<number>(0);
  purchaseByDate = signal<Purchase[]>([]);
  selectPurchase = signal<Purchase | undefined>(undefined);

  priceTotalSales = computed(() =>
    this.purchaseByDate().reduce((sum, mod) => sum + mod.totalPrice, 0),
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

  handleSelectSale(value: Purchase) {
    this.el.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    this.selectPurchase.set(value);
  }

  handleSubmitFilterByDates() {
    this.#purchaseSrv
      .filterPurchaseByDate(this.formDates.getRawValue(), 1)
      .subscribe({
        next: (resp) => {
          this.purchaseByDate.set(resp);
        },
        error: (err) => {
          console.log('[Error component] 😡 error 💥💥', err);
        },
        complete: () => {},
      });
  }

  // handleDowloadExcel() {
  //   this.#purchaseSrv.downLoadExcel(this.formDates.getRawValue()).subscribe({
  //     next: (data: Blob) => {
  //       const blob = new Blob([data], {
  //         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //       });
  //       const url = window.URL.createObjectURL(blob);
  //       window.open(url);
  //     },
  //   });
  // }
}
