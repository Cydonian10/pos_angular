import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../interfaces/category.interface';
import { Pagination } from '../interfaces/pagination.interface';
import { checkToken } from '@/core/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  #http = inject(HttpClient);

  #url = environment.urlapi;

  getAll(pagination: Pagination) {
    const params = new HttpParams()
      .set('quantityRecordsPerPage', pagination.quantityRecordsPerPage)
      .set('page', pagination.page);

    return this.#http.get<Category[]>(`${this.#url}/categories`, {
      observe: 'response',
      params,
      context: checkToken(),
    });
  }

  getByName(name: string) {
    return this.#http.get<Category>(`${this.#url}/categories/${name}/find`, {
      context: checkToken(),
    });
  }

  create(dto: CreateCategoryDto) {
    return this.#http.post<Category>(`${this.#url}/categories`, dto, {
      context: checkToken(),
    });
  }

  update(dto: UpdateCategoryDto, id: number) {
    return this.#http.put<Category>(`${this.#url}/categories/${id}`, dto, {
      context: checkToken(),
    });
  }

  delete(id: number) {
    return this.#http.delete<{ id: number }>(`${this.#url}/categories/${id}`, {
      context: checkToken(),
    });
  }

  filterName(name: string) {
    const params = new HttpParams().set('name', name);

    return this.#http.get<Category[]>(`${this.#url}/categories/filter`, {
      params,
      context: checkToken(),
    });
  }
}
