import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SideService {
  #open = signal(false);
  public open = computed(() => this.#open());

  toogle() {
    this.#open.update((value) => !value);
  }
}
