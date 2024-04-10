import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { checkToken } from '@/core/interceptors/token.interceptor';
import { CreateEgresoDto, Egreso } from '../interfaces/egreso.interface';

@Injectable({
  providedIn: 'root',
})
export class EgresoService {
  #http = inject(HttpClient);

  #url = environment.urlapi;

  get(dtoParams: { createDate: string; cashRegisterId: number }) {
    return this.#http.get<Egreso[]>(
      `${this.#url}/egresos/search?createDate=${dtoParams.createDate}&cashRegisterId=${dtoParams.cashRegisterId}`,
      { context: checkToken() },
    );
  }

  create(dtoCreate: CreateEgresoDto) {
    return this.#http.post<Egreso>(`${this.#url}/egresos`, dtoCreate);
  }
}
