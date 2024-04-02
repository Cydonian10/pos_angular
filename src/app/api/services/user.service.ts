import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import {
  AddRolDto,
  CreateUserDto,
  LoginUserDto,
  RemoveRolDto,
  User,
  UserAuth,
  UserToken,
} from '../interfaces/user.interface';
import { switchMap, tap, zip } from 'rxjs';
import { checkToken } from '@/core/interceptors/token.interceptor';
import { TokenService } from '@/core/services/token.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #http = inject(HttpClient);
  #tokenSrv = inject(TokenService);

  #url = environment.urlapi;

  getAll() {
    return this.#http.get<User[]>(`${this.#url}/auth/users`);
  }

  getOne(id: string) {
    return this.#http.get<User>(`${this.#url}/auth/users/${id}`);
  }

  registerUser(dto: CreateUserDto) {
    return this.#http.post<UserToken>(`${this.#url}/auth/register`, dto);
  }

  login(dto: LoginUserDto) {
    return this.#http.post<UserToken>(`${this.#url}/auth/login`, dto).pipe(
      tap((resp) => this.#tokenSrv.saveToken(resp)),
      switchMap(() => this.profile()),
    );
  }

  addRol(dto: AddRolDto) {
    return this.#http.post<void>(`${this.#url}/auth/asignar-rol`, dto);
  }

  removeRol(dto: RemoveRolDto) {
    return this.#http.post<void>(`${this.#url}/auth/remove-rol`, dto);
  }

  filterData(filter: any) {
    let params = new HttpParams();
    if (filter.rol) params = params.append('rol', filter.rol);

    return this.#http.get<User[]>(`${this.#url}/auth/filter`, {
      params,
    });
  }

  getRolesUser(userId: string) {
    return this.#http.get<string[]>(`${this.#url}/auth/${userId}/roles`);
  }

  getUserAndRole(id: string) {
    return zip(this.getOne(id), this.getRolesUser(id));
  }

  getRoles() {
    return this.#http.get<string[]>(`${this.#url}/auth/roles`);
  }

  profile() {
    return this.#http.get<UserAuth>(`${this.#url}/auth/profile`, {
      context: checkToken(),
    });
  }
}
