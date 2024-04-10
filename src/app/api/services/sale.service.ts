import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import {
  Bill,
  CreateSaleDto,
  FilterSaleByDate,
} from '../interfaces/sale.interface';
import { checkToken } from '@/core/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  #http = inject(HttpClient);

  #url = environment.urlapi;

  createSale(dtoCreate: CreateSaleDto) {
    return this.#http.post<void>(`${this.#url}/sales`, dtoCreate, {
      context: checkToken(),
    });
  }

  filterSaleByDate(dtoFilter: FilterSaleByDate) {
    let params = new HttpParams();
    params = params.append('starDate', dtoFilter.starDate.toString());
    params = params.append('endDate', dtoFilter.endDate.toString());

    return this.#http.get<Bill[]>(`${this.#url}/sales`, {
      params,
      context: checkToken(),
    });
  }

  downLoadExcel(dtoFilter: FilterSaleByDate) {
    let params = new HttpParams();
    params = params.append('starDate', dtoFilter.starDate.toString());
    params = params.append('endDate', dtoFilter.endDate.toString());

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    return this.#http.get(`${this.#url}/sales/excel`, {
      headers,
      responseType: 'blob',
      params,
      context: checkToken(),
    });
  }
}
