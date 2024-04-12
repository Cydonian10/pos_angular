import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { checkToken } from '@/core/interceptors/token.interceptor';
import { Stadistics } from '../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root',
})
export class DashBoardService {
  private http = inject(HttpClient);
  private url = environment.urlapi;

  getStadistics() {
    return this.http.get<Stadistics>(`${this.url}/dashboard`, {
      context: checkToken(),
    });
  }
}
