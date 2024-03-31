import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CreateUnitDto, Unit } from '../interfaces/unit.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  #http = inject(HttpClient);

  #url = environment.urlapi;

  getUnits() {
    return this.#http.get<Unit[]>(`${this.#url}/units`);
  }

  getByName(name: string) {
    return this.#http.get<Unit>(`${this.#url}/units/${name}/find`);
  }

  create(dto: CreateUnitDto) {
    return this.#http.post<Unit>(`${this.#url}/units`, dto);
  }

  update(dto: CreateUnitDto, id: number) {
    return this.#http.put<Unit>(`${this.#url}/units/${id}`, dto);
  }

  remove(id: number) {
    return this.#http.delete(`${this.#url}/units/${id}`);
  }

  filterName(name: string) {
    const params = new HttpParams().set('name', name);

    return this.#http.get<Unit[]>(`${this.#url}/units/filter`, { params });
  }
}
