import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { checkToken } from '@/core/interceptors/token.interceptor';
import {
  CashRegister,
  CreateCashRegisterDto,
  OpenCashRegisterDto,
  UpdateCashRegisterDto,
} from '../interfaces/cash-register.interface';

@Injectable({
  providedIn: 'root',
})
export class CashRegisterService {
  #http = inject(HttpClient);
  #url = environment.urlapi;

  getAll() {
    return this.#http.get<CashRegister[]>(`${this.#url}/cash-registers`, {
      context: checkToken(),
    });
  }

  getOne(id: number) {
    return this.#http.get<CashRegister>(`${this.#url}/cash-registers/${id}`, {
      context: checkToken(),
    });
  }

  create(dto: CreateCashRegisterDto) {
    return this.#http.post<CashRegister>(`${this.#url}/cash-registers`, dto, {
      context: checkToken(),
    });
  }

  update(dto: UpdateCashRegisterDto, id: number) {
    return this.#http.put<CashRegister>(
      `${this.#url}/cash-registers/${id}`,
      dto,
      {
        context: checkToken(),
      },
    );
  }

  open(dto: OpenCashRegisterDto, id: number) {
    return this.#http.put<CashRegister>(
      `${this.#url}/cash-registers/open/${id}`,
      dto,
      {
        context: checkToken(),
      },
    );
  }

  close(id: number) {
    return this.#http.put<CashRegister>(
      `${this.#url}/cash-registers/close/${id}`,
      {},
      {
        context: checkToken(),
      },
    );
  }

  selectCashRegister(id: number) {
    return this.#http.put<CashRegister>(
      `${this.#url}/cash-registers/${id}/user`,
      {},
      {
        context: checkToken(),
      },
    );
  }
}
