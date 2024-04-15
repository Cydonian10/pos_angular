import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CreateUserDto, UserToken } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AppInitService {
  #http = inject(HttpClient);

  #url = environment.urlapi;

  getStatusAppInit() {
    return this.#http.get<{ msg: string }>(`${this.#url}/auth/app-init`);
  }

  registerUserInit(dto: CreateUserDto) {
    return this.#http.post<UserToken>(`${this.#url}/auth/app-init`, dto);
  }
}
