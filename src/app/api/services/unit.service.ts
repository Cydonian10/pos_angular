import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CreateUnitDto, Unit } from '../interfaces/unit.interface';
import { environment } from '../../../environments/environment.development';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  #http = inject(HttpClient);

  #url = environment.urlapi;

  getUnits() {
    return this.#http.get<Unit[]>(`${this.#url}/units`).pipe(delay(500));
  }

  getByName(name: string) {
    return this.#http
      .get<Unit>(`${this.#url}/units/${name}/find`)
      .pipe(delay(500));
  }

  create(dto: CreateUnitDto) {
    return this.#http.post<Unit>(`${this.#url}/units`, dto).pipe(delay(500));
  }

  update(dto: CreateUnitDto, id: number) {
    return this.#http
      .put<Unit>(`${this.#url}/units/${id}`, dto)
      .pipe(delay(500));
  }

  remove(id: number) {
    return this.#http.delete(`${this.#url}/units/${10000}`).pipe(delay(500));
  }

  filterName(name: string) {
    const params = new HttpParams().set('name', name);

    return this.#http
      .get<Unit[]>(`${this.#url}/units/filter`, { params })
      .pipe(delay(500));
  }
}
