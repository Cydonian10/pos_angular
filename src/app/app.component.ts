import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TokenService } from './core/services/token.service';
import { UserStore } from './core/store/user.store';
import { CashRegisterStore } from './core/store/cash-register.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  #userStore = inject(UserStore);
  #cashRegisterStore = inject(CashRegisterStore);

  constructor() {
    const theme = localStorage.getItem('theme');
    document.documentElement.setAttribute('data-theme', theme!);
    this.#userStore.profile();
    this.#cashRegisterStore.setCurrentCashRegister();
  }
}
