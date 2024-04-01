import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import {
  CreateCustomerDto,
  Customer,
  UpdateCustomerDto,
} from '../interfaces/customer.interface';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  #http = inject(HttpClient);

  #url = environment.urlapi;

  getAll() {
    return this.#http.get<Customer[]>(`${this.#url}/customers`);
  }

  create(dto: CreateCustomerDto) {
    return this.#http.post<Customer>(`${this.#url}/customers`, dto);
  }

  getOne() {}

  update(dto: UpdateCustomerDto, id: number) {
    return this.#http.put<Customer>(`${this.#url}/customers/${id}`, dto);
  }

  remove(id: number) {
    return this.#http.delete<void>(`${this.#url}/customers/${id}`);
  }
}
