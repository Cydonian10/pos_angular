import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Brand, CreateBrandDto } from '../interfaces/brand.interface';
import { Pagination } from '../interfaces/pagination.interface';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  #http = inject(HttpClient);
  #url = environment.urlapi;

  getAll(pagination: Pagination) {
    const params = new HttpParams()
      .set('quantityRecordsPerPage', pagination.quantityRecordsPerPage)
      .set('page', pagination.page);

    return this.#http.get<Brand[]>(`${this.#url}/brand`, {
      observe: 'response',
      params,
    });
  }

  getByName(name: string) {
    return this.#http.get<Brand>(`${this.#url}/brand/${name}/find`);
  }

  create(dto: FormData) {
    return this.#http.post<Brand>(`${this.#url}/brand`, dto);
  }

  update(dto: FormData, id: number) {
    return this.#http.put<Brand>(`${this.#url}/brand/${id}`, dto);
  }

  // remove(id: number) {
  //   return this.#http.delete(`${this.#url}/units/${id}`);
  // }

  // filterName(name: string) {
  //   const params = new HttpParams().set('name', name);

  //   return this.#http.get<Unit[]>(`${this.#url}/units/filter`, { params });
  // }
}
