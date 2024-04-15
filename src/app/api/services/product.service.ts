import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Pagination } from '../interfaces/pagination.interface';
import {
  FilterProduct,
  HistoryProductPrice,
  Product,
} from '../interfaces/product.interface';
import { CreateDiscountDto, Discount } from '../interfaces/discount.interface';
import { checkToken } from '@/core/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  #http = inject(HttpClient);

  #url = environment.urlapi;

  getAll(pagination: Pagination) {
    const params = new HttpParams()
      .set('quantityRecordsPerPage', pagination.quantityRecordsPerPage)
      .set('page', pagination.page);

    return this.#http.get<Product[]>(`${this.#url}/products`, {
      observe: 'response',
      params,
      context: checkToken(),
    });
  }

  getOne(id: number) {
    return this.#http.get<Product>(`${this.#url}/products/${id}`, {
      context: checkToken(),
    });
  }

  create(dto: FormData) {
    return this.#http.post<Product>(`${this.#url}/products`, dto, {
      context: checkToken(),
    });
  }

  update(dto: FormData, id: number) {
    return this.#http.put<Product>(`${this.#url}/products/${id}`, dto, {
      context: checkToken(),
    });
  }

  filterData(filter: FilterProduct) {
    let params = new HttpParams();
    if (filter.name) params = params.append('name', filter.name);
    if (filter.price) params = params.append('price', filter.price);
    if (filter.stock) params = params.append('stock', filter.stock);
    if (filter.barCode) params = params.append('barCode', filter.barCode);

    return this.#http.get<Product[]>(`${this.#url}/products/filter`, {
      params,
      context: checkToken(),
    });
  }

  filterOneData(filter: any) {
    return this.#http.get<Product[]>(
      `${this.#url}/products/filter?${filter.filter}=${filter.value}`,
      { context: checkToken() },
    );
  }

  addDiscount(discounts: CreateDiscountDto[], productId: number) {
    return this.#http.put<void>(
      `${this.#url}/products/add-discounts/${productId}`,
      discounts,
      { context: checkToken() },
    );
  }

  getDiscounts(productId: number) {
    return this.#http.get<Discount[]>(
      `${this.#url}/products/${productId}/discounts`,
      { context: checkToken() },
    );
  }

  removeDiscount(discountId: number) {
    return this.#http.delete<void>(
      `${this.#url}/products/discount/${discountId}`,
      { context: checkToken() },
    );
  }

  historyPrice(productId: number) {
    return this.#http.get<HistoryProductPrice[]>(
      `${this.#url}/products/history/${productId}`,
      { context: checkToken() },
    );
  }
}
