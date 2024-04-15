import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserStore } from './core/store/user.store';
import { CashRegistersStore } from './store/cash-registers.store';
import { AppInitService } from './api/services/appinit.service';

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
  readonly appInitSrv = inject(AppInitService);
  readonly router = inject(Router);

  constructor() {
    const theme = localStorage.getItem('theme');
    document.documentElement.setAttribute('data-theme', theme!);
    this.#userStore.profile();
    this.cashRegisterStore.loadCurrentCashRegister();
    this.appInit();
  }

  appInit() {
    this.appInitSrv.getStatusAppInit().subscribe((resp) => {
      console.log(resp);
      if (resp.msg === 'Iniciar la App') {
        this.router.navigateByUrl('/web/init');
      }
    });
  }
}
