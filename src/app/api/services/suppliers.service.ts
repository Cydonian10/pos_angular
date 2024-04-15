import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { checkToken } from '@/core/interceptors/token.interceptor';
import { CreateSupplierDto, Supplier } from '../interfaces/supplier.interface';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  #http = inject(HttpClient);
  #url = environment.urlapi;

  getAll() {
    return this.#http.get<Supplier[]>(`${this.#url}/suppliers`, {
      context: checkToken(),
    });
  }

  create(dtoCreate: CreateSupplierDto) {
    return this.#http.post<Supplier>(`${this.#url}/suppliers`, dtoCreate, {
      context: checkToken(),
    });
  }

  update(dtoCreate: CreateSupplierDto, id: number) {
    return this.#http.put<Supplier>(`${this.#url}/suppliers/${id}`, dtoCreate, {
      context: checkToken(),
    });
  }

  search(name: string) {
    return this.#http.get<Supplier[]>(
      `${this.#url}/suppliers/search?name=${name}`,
      { context: checkToken() },
    );
  }
}
