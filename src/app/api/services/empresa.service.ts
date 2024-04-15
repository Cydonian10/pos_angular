import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Empresa } from '../interfaces/empresa.interface';
import { checkToken } from '@/core/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  #http = inject(HttpClient);

  #url = environment.urlapi;

  get() {
    return this.#http.get<Empresa>(`${this.#url}/empresa`, {
      context: checkToken(),
    });
  }

  create(form: FormData) {
    return this.#http.post<Empresa>(`${this.#url}/empresa`, form);
  }
}
