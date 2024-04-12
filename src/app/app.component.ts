import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserStore } from './core/store/user.store';
import { CashRegistersStore } from './store/cash-registers.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  #userStore = inject(UserStore);
  readonly cashRegisterStore = inject(CashRegistersStore);

  constructor() {
    const theme = localStorage.getItem('theme');
    document.documentElement.setAttribute('data-theme', theme!);
    this.#userStore.profile();
    this.cashRegisterStore.loadCurrentCashRegister();
  }
}
