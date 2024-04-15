import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { checkToken } from '@/core/interceptors/token.interceptor';
import {
  LeastSoldProduct,
  ProductsLowStock,
  Stadistics,
  TopSales,
} from '../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root',
})
export class DashBoardService {
  private http = inject(HttpClient);
  private url = environment.urlapi;

  getStadistics() {
    return this.http.get<Stadistics>(`${this.url}/dashboard`, {
      context: checkToken(),
    });
  }

  getMostSelledProduct() {
    return this.http.get<any[]>(`${this.url}/dashboard/most-selled`, {
      context: checkToken(),
    });
  }

  getSalesByDay() {
    return this.http.get<any[]>(`${this.url}/dashboard/sales-last-weak`, {
      context: checkToken(),
    });
  }

  getLeastSoldProducts() {
    return this.http.get<LeastSoldProduct[]>(
      `${this.url}/dashboard/least-sold-product`,
      {
        context: checkToken(),
      },
    );
  }

  getTopSales() {
    return this.http.get<TopSales[]>(`${this.url}/dashboard/top-sales`, {
      context: checkToken(),
    });
  }

  getProductsLowStock() {
    return this.http.get<ProductsLowStock[]>(
      `${this.url}/dashboard/products-low-stock`,
      {
        context: checkToken(),
      },
    );
  }
}
