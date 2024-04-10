import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CreatePurchaseDto, Purchase } from '../interfaces/purchase.interface';
import { checkToken } from '@/core/interceptors/token.interceptor';
import { FilterSaleByDate } from '../interfaces/sale.interface';

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  #http = inject(HttpClient);
  #url = environment.urlapi;

  createPurchase(dtoCreate: CreatePurchaseDto) {
    return this.#http.post(`${this.#url}/purchases`, dtoCreate, {
      context: checkToken(),
    });
  }

  filterPurchaseByDate(dtoFilter: FilterSaleByDate, idSupplier: number) {
    let params = new HttpParams();
    params = params.append('starDate', dtoFilter.starDate.toString());
    params = params.append('endDate', dtoFilter.endDate.toString());

    return this.#http.get<Purchase[]>(
      `${this.#url}/purchases/supplier/${idSupplier}`,
      {
        params,
        context: checkToken(),
      },
    );
  }
}
