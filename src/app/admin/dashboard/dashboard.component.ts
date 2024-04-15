import {
  LeastSoldProduct,
  ProductsLowStock,
  Stadistics,
  TopSales,
} from '@/api/interfaces/dashboard.interface';
import { DashBoardService } from '@/api/services/dashboard.service';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';
import { CurrencyPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  LOCALE_ID,
  OnInit,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import Chart from 'chart.js/auto';

import localEs from '@angular/common/locales/es-PE';
import { registerLocaleData } from '@angular/common';
import { TableLeastSolProductsComponent } from './components/table-least-sol-products/table-least-sol-products.component';
import { TableTopSalesComponent } from './components/table-top-sales/table-top-sales.component';
import { TableProductsLowStockComponent } from './components/table-products-low-stock/table-products-low-stock.component';
registerLocaleData(localEs);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AdminTitleComponent,
    CurrencyPipe,
    TableLeastSolProductsComponent,
    TableTopSalesComponent,
    TableProductsLowStockComponent,
  ],
  templateUrl: './dashboard.component.html',
  styles: ``,
  providers: [{ provide: LOCALE_ID, useValue: 'es-PE' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent implements OnInit, AfterViewInit {
  private dashboardSrv = inject(DashBoardService);
  public ctx = viewChild<ElementRef>('mostSelledChart');
  public ctx2 = viewChild<ElementRef>('selledByDayChart');

  public stadistics = signal<Stadistics>({} as Stadistics);
  public leastSoldProducts = signal<LeastSoldProduct[]>([]);
  public topSales = signal<TopSales[]>([]);
  public productsLowStock = signal<ProductsLowStock[]>([]);

  public mostSellectChart: any;
  public selledByDayChart: any;

  ngOnInit(): void {
    this.getStadistics();
    this.getMostSelledProduct();
    this.getSalesByDate();
    this.getLeastSoldProduct();
    this.getTopSales();
    this.getProductsLowStock();
  }

  ngAfterViewInit(): void {}

  renderMostSellectChart(labels: string[], data: number[]) {
    this.mostSellectChart = new Chart(this.ctx()?.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: 'Cantidad Vendida',
            data,
            borderWidth: 1,
            backgroundColor: [
              '#9BD0F5',
              '#FFB1C1',
              '#cc65fe',
              '#ffce56',
              '#ff6384',
              '#36a2eb',
            ],
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  renderSelledByDayChart(labels: string[], data: string[]) {
    this.selledByDayChart = new Chart(this.ctx2()?.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Ventas Ultima Semana',
            data,
            borderWidth: 1,
            backgroundColor: [
              '#9BD0F5',
              '#FFB1C1',
              '#cc65fe',
              '#ffce56',
              '#ff6384',
              '#36a2eb',
            ],
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  getStadistics() {
    this.dashboardSrv.getStadistics().subscribe((resp) => {
      this.stadistics.set(resp);
    });
  }

  getMostSelledProduct() {
    this.dashboardSrv.getMostSelledProduct().subscribe((resp) => {
      const labels = resp.map((item) => `${item.name} ${item.unitSymbol}`);
      const data = resp.map((item) => item.quantitySale);

      this.renderMostSellectChart(labels, data);
    });
  }

  getSalesByDate() {
    this.dashboardSrv.getSalesByDay().subscribe((resp) => {
      const labels = resp.map((item) => `${item.dia}`);
      const data = resp.map((item) => item.totalSale);

      this.renderSelledByDayChart(labels, data);
    });
  }

  getLeastSoldProduct() {
    this.dashboardSrv.getLeastSoldProducts().subscribe((resp) => {
      this.leastSoldProducts.set(resp);
    });
  }

  getTopSales() {
    this.dashboardSrv.getTopSales().subscribe((resp) => {
      this.topSales.set(resp);
    });
  }

  getProductsLowStock() {
    this.dashboardSrv.getProductsLowStock().subscribe((resp) => {
      this.productsLowStock.set(resp);
    });
  }
}
