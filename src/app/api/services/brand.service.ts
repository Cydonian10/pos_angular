import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Brand } from '../interfaces/brand.interface';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  #http = inject(HttpClient);
  #url = environment.urlapi;

  getAll() {
    return this.#http.get<Brand[]>(`${this.#url}/brand`);
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

  remove(id: number) {
    return this.#http.delete(`${this.#url}/brand/${id}`);
  }
}
